/* ============================================================
   Stever PDF Compress — worker qpdf (WebAssembly)
   Traite les PDF localement dans le navigateur (aucun envoi réseau).
   © 2026 ING STEVER — Tous droits réservés.
   Moteur : qpdf 12 (Apache-2.0) via @neslinesli93/qpdf-wasm (MIT)
   ============================================================ */
'use strict';

const VERSION = (function () {
  try { return new URL(self.location.href).searchParams.get('v') || '1'; } catch (err) { return '1'; }
})();

let qpdf = null;
let loadError = null;
const features = {
  optimizeImages: null,
  jpegQuality: null,
  minArea: null
};

function safeUnlink(path) {
  try { qpdf.FS.unlink(path); } catch (err) { /* fichier absent */ }
}

function tmpName(prefix, ext) {
  return prefix + '_' + Math.random().toString(36).slice(2, 10) + '_' + Date.now().toString(36) + '.' + (ext || 'pdf');
}

/* Exécute qpdf en capturant stdout/stderr et le code de sortie. */
function runQpdf(args) {
  let log = '';
  const orig = { log: console.log, warn: console.warn, error: console.error };
  const capture = (...parts) => { log += parts.map((p) => String(p)).join(' ') + '\n'; };
  console.log = capture; console.warn = capture; console.error = capture;
  let code = 0;
  try {
    const res = qpdf.callMain(args);
    code = (typeof res === 'number') ? res : 0;
  } catch (err) {
    if (err && typeof err.status === 'number') code = err.status;
    else if (typeof err === 'number') code = err;
    else if (err === 0) code = 0;
    else code = 1;
  } finally {
    console.log = orig.log; console.warn = orig.warn; console.error = orig.error;
  }
  return { code, log: log.trim() };
}

async function ensureReady() {
  if (qpdf) return;
  if (loadError) throw loadError;
  try {
    if (typeof Module === 'undefined') {
      importScripts('../vendor/qpdf.js?v=' + VERSION);
    }
    const wasmUrl = new URL('../vendor/qpdf.wasm?v=' + VERSION, self.location.href).href;
    qpdf = await Module({ locateFile: () => wasmUrl, noInitialRun: true });
    const helpText = runQpdf(['--help=all']).log;
    if (helpText.length > 0) {
      features.optimizeImages = helpText.includes('--optimize-images');
      features.jpegQuality = features.optimizeImages && helpText.includes('--jpeg-quality');
      features.minArea = features.optimizeImages && helpText.includes('--oi-min-area');
    } else {
      const probe = (flag) => { try { return runQpdf(['--help=' + flag]).code === 0; } catch (err) { return false; } };
      features.optimizeImages = probe('--optimize-images');
      features.jpegQuality = features.optimizeImages && probe('--jpeg-quality');
      features.minArea = features.optimizeImages && probe('--oi-min-area');
    }
  } catch (err) {
    loadError = err;
    throw err;
  }
}

function freshBuffer(view) {
  const src = new Uint8Array(view.buffer, view.byteOffset, view.byteLength);
  const copy = new Uint8Array(src.byteLength);
  copy.set(src);
  return copy.buffer;
}

/* ------------------------------------------------------------------
   Inspection : pages, chiffrement, validité
------------------------------------------------------------------ */
function inspectBytes(bytes) {
  const inFile = tmpName('in');
  const info = { pages: null, encrypted: false, needsPassword: false, valid: false, damaged: false };
  qpdf.FS.writeFile(inFile, new Uint8Array(bytes));
  try {
    const check = runQpdf(['--check', inFile]);
    const checkLog = check.log || '';
    const lower = checkLog.toLowerCase();
    if (check.code < 2) {
      info.valid = true;
      info.encrypted = /file is encrypted/i.test(checkLog) && !/file is not encrypted/i.test(checkLog);
    } else if (lower.includes('password')) {
      info.encrypted = true;
      info.needsPassword = true;
      info.valid = true;
    } else {
      info.damaged = true;
    }
    if (runQpdf(['--is-encrypted', inFile]).code === 0) info.encrypted = true;
    if (runQpdf(['--requires-password', inFile]).code === 0) {
      info.encrypted = true;
      info.needsPassword = true;
    }
    const npages = runQpdf(['--show-npages', inFile]);
    if (npages.code === 0) {
      const match = npages.log.match(/(\d+)/);
      if (match) info.pages = parseInt(match[1], 10);
    }
  } finally {
    safeUnlink(inFile);
  }
  return info;
}

/* ------------------------------------------------------------------
   Construction des commandes de compression (du plus complet au plus simple)
------------------------------------------------------------------ */
function buildVariants(opts, inFile, outFile, passFile) {
  const common = [];
  if (opts.decrypt && passFile) {
    common.push('--decrypt', '--password-file=' + passFile);
  }
  if (opts.linearize) {
    common.push('--linearize');
  } else if (opts.objectStreams !== false) {
    common.push('--object-streams=generate');
  }
  common.push(
    '--compression-level=9',
    '--recompress-flate',
    '--stream-data=compress',
    '--decode-level=generalized'
  );
  if (opts.normalize) common.push('--normalize-content=y');
  if (opts.removeUnref) common.push('--remove-unreferenced-resources=yes');

  const prefixes = [];
  if (opts.optimizeImages) {
    const imageArgs = ['--optimize-images'];
    if (typeof opts.jpegQuality === 'number' && features.jpegQuality !== false) {
      imageArgs.push('--jpeg-quality=' + Math.max(10, Math.min(100, Math.round(opts.jpegQuality))));
    }
    if (typeof opts.minArea === 'number' && features.minArea !== false) {
      imageArgs.push('--oi-min-area=' + Math.max(0, Math.round(opts.minArea)));
    }
    prefixes.push({ mode: 'full', args: imageArgs });
    prefixes.push({ mode: 'images', args: ['--optimize-images'] });
  }
  prefixes.push({ mode: 'lossless', args: [] });

  return prefixes.map((p) => ({
    mode: p.mode,
    args: ['--no-warn', ...common, ...p.args, inFile, outFile]
  }));
}

function isOptionError(log) {
  const l = (log || '').toLowerCase();
  return l.includes('unknown option') || l.includes('unrecognized option') || l.includes('not a known option');
}

/* ------------------------------------------------------------------
   Traitement complet d'un fichier
------------------------------------------------------------------ */
function processBytes(bytes, opts) {
  const inFile = tmpName('in');
  const outFile = tmpName('out');
  let passFile = null;
  const logs = [];
  let success = false;
  let chosenMode = 'lossless';
  let outBytes = null;
  let verify = null;
  let pages = null;
  let lastCode = 1;
  let lastLog = '';
  let errorKind = null;

  try {
    qpdf.FS.writeFile(inFile, new Uint8Array(bytes));
    if (opts.decrypt && opts.password) {
      passFile = tmpName('pass', 'txt');
      qpdf.FS.writeFile(passFile, opts.password);
    }

    const variants = buildVariants(opts, inFile, outFile, passFile);
    for (const variant of variants) {
      safeUnlink(outFile);
      const res = runQpdf(variant.args);
      lastCode = res.code;
      lastLog = res.log;
      logs.push('[' + variant.mode + '] code=' + res.code + (res.log ? '\n' + res.log : ''));
      chosenMode = variant.mode;

      if (res.code === 0 || res.code === 3) { success = true; break; }

      const log = (res.log || '').toLowerCase();
      if (log.includes('password')) { errorKind = 'bad-password'; break; }
      if (!isOptionError(res.log)) { errorKind = 'failed'; break; }
      /* option inconnue : on essaie la variante suivante, plus simple */
    }

    if (success) {
      try {
        const view = qpdf.FS.readFile(outFile);
        outBytes = freshBuffer(view);
        const check = runQpdf(['--check', outFile]);
        verify = { code: check.code, valid: check.code < 2 };
        if (check.code >= 2) logs.push('[verify] code=' + check.code + '\n' + check.log);
        const npages = runQpdf(['--show-npages', outFile]);
        if (npages.code === 0) {
          const match = npages.log.match(/(\d+)/);
          if (match) pages = parseInt(match[1], 10);
        }
      } catch (err) {
        success = false;
        errorKind = 'read-output';
        lastLog = String((err && err.message) || err);
      }
    }

    return {
      ok: success,
      mode: chosenMode,
      code: lastCode,
      log: logs.join('\n'),
      outBytes,
      verify,
      pages,
      errorKind
    };
  } finally {
    safeUnlink(inFile);
    safeUnlink(outFile);
    if (passFile) safeUnlink(passFile);
  }
}

/* ------------------------------------------------------------------
   Messages
------------------------------------------------------------------ */
self.onmessage = async (event) => {
  const msg = event.data || {};
  const id = msg.id;
  const op = msg.op;
  try {
    await ensureReady();
    if (op === 'init') {
      self.postMessage({ id, op, ok: true, features });
      return;
    }
    if (op === 'inspect') {
      const info = inspectBytes(msg.bytes);
      self.postMessage({ id, op, ok: true, info });
      return;
    }
    if (op === 'qa') {
      /* Exécution brute réservée aux tests internes : args avec {IN}/{OUT}. */
      const qaIn = tmpName('qain');
      const qaOut = tmpName('qaout');
      qpdf.FS.writeFile(qaIn, new Uint8Array(msg.bytes));
      const args = (msg.args || []).map((a) => (a === '{IN}' ? qaIn : (a === '{OUT}' ? qaOut : a)));
      const qaRes = runQpdf(args);
      let qaBytes = null;
      try { qaBytes = freshBuffer(qpdf.FS.readFile(qaOut)); } catch (err) { qaBytes = null; }
      safeUnlink(qaIn);
      safeUnlink(qaOut);
      const qaTransfer = qaBytes ? [qaBytes] : [];
      self.postMessage({ id, op, ok: true, code: qaRes.code, log: qaRes.log, outBytes: qaBytes }, qaTransfer);
      return;
    }
    if (op === 'process') {
      const res = processBytes(msg.bytes, msg.options || {});
      const transfer = res.outBytes ? [res.outBytes] : [];
      self.postMessage({
        id,
        op,
        ok: res.ok,
        mode: res.mode,
        code: res.code,
        log: res.log,
        verify: res.verify,
        pages: res.pages,
        errorKind: res.errorKind,
        outBytes: res.outBytes
      }, transfer);
      return;
    }
    self.postMessage({ id, op, ok: false, error: 'unknown-op' });
  } catch (err) {
    self.postMessage({ id, op, ok: false, error: String((err && err.message) || err) });
  }
};
