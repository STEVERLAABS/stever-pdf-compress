# Notices des composants tiers — Stever PDF Compress

Stever PDF Compress intègre et redistribue les composants open source suivants.
Ils conservent leurs licences et droits d'auteur respectifs. Le code propre à
l'application reste la propriété exclusive d'ING STEVER (voir `LICENSE`).

---

## qpdf 12.2.0

- **Rôle :** moteur de traitement PDF (compression structurelle, optimisation
  des images, linéarisation, déchiffrement), compilé en WebAssembly.
- **Licence :** Apache License 2.0.
- **Copyright :** © 2005–2026 Jay Berkenbilt et contributeurs de qpdf.
- **Source :** <https://github.com/qpdf/qpdf>
- **Texte de la licence :** <https://www.apache.org/licenses/LICENSE-2.0>

---

## @neslinesli93/qpdf-wasm 0.3.0

- **Rôle :** compilation Emscripten de qpdf et fichiers d'amorçage JavaScript
  (`vendor/qpdf.js`, `vendor/qpdf.wasm`).
- **Licence :** ISC License.
- **Copyright :** © 2023–2026 neslinesli93.
- **Source :** <https://github.com/neslinesli93/qpdf-wasm>

```
Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY
SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION
OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN
CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
```

---

## zlib 1.3.2

- **Rôle :** compression/décompression deflate, liée statiquement dans le
  binaire WebAssembly de qpdf.
- **Licence :** zlib License.
- **Copyright :** © 1995–2026 Jean-loup Gailly et Mark Adler.
- **Source :** <https://zlib.net/>

```
This software is provided 'as-is', without any express or implied warranty.
In no event will the authors be held liable for any damages arising from the
use of this software.

Permission is granted to anyone to use this software for any purpose,
including commercial applications, and to alter it and redistribute it
freely, subject to the following restrictions:

1. The origin of this software must not be misrepresented; you must not claim
   that you wrote the original software. If you use this software in a
   product, an acknowledgment in the product documentation would be
   appreciated but is not required.
2. Altered source versions must be plainly marked as such, and must not be
   misrepresented as being the original software.
3. This notice may not be removed or altered from any source distribution.
```

---

## libjpeg-turbo 3.2.0

- **Rôle :** (dé)compression JPEG utilisée par qpdf pour l'optimisation des
  images, liée statiquement dans le binaire WebAssembly.
- **Licences :** IJG License, BSD 3-Clause License et zlib License.
- **Copyright :** © 1991–2020 Thomas G. Lane, Guido Vollbeding (IJG) ;
  © 2009–2026 D. R. Commander, libjpeg-turbo project.
- **Source :** <https://github.com/ImageMagick/jpeg-turbo>
  (amont : <https://github.com/libjpeg-turbo/libjpeg-turbo>)
- **Textes :** <https://github.com/libjpeg-turbo/libjpeg-turbo/blob/main/LICENSE.md>

---

## Emscripten (runtime généré)

- **Rôle :** code JavaScript d'exécution du module WebAssembly présent dans
  `vendor/qpdf.js`.
- **Licences :** MIT License et University of Illinois/NCSA Open Source License.
- **Copyright :** © 2010–2026 Emscripten authors (University of Illinois,
  Mozilla Foundation et contributeurs).
- **Source :** <https://emscripten.org/>

---

## fflate 0.8.3

- **Rôle :** création des archives ZIP dans le navigateur.
- **Licence :** MIT License.
- **Copyright :** © 2020 Arjun Barrett.
- **Source :** <https://github.com/101arrowz/fflate>

```
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to
deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
sell copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE.
```
