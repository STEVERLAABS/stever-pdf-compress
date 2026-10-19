# Stever PDF Compress

Compresseur de fichiers PDF **100 % local** : l'application s'exécute
entièrement dans le navigateur, sans serveur, sans compte et sans envoi de
vos documents. Le moteur est **qpdf 12.2 compilé en WebAssembly**.

🌐 **Site en ligne :** <https://steverlaabs.github.io/stever-pdf-compress/>

## Fonctionnalités

- **Compression par lots** : glissez-déposez plusieurs PDF, traitez-les en une
  fois.
- **4 niveaux de compression** : sans perte, léger, équilibré, extrême.
- **Réglages avancés** : qualité JPEG, taille minimale des images ciblées,
  object streams, normalisation des flux, suppression des ressources
  inutilisées, linéarisation web.
- **Documents protégés** : détection automatique, déchiffrement avec le mot de
  passe fourni par l'utilisateur.
- **Vérification automatique** : chaque PDF produit est relu et contrôlé
  (`qpdf --check`) avant téléchargement.
- **Comparaison avant/après** : taille, pourcentage d'économie, total du lot.
- **Téléchargement individuel ou archive ZIP** de tous les résultats.
- **Interface bilingue français / arabe** avec support complet de la direction
  droite-à-gauche (RTL).
- **Aucune donnée envoyée** : tout le traitement est effectué sur l'appareil.

## Méthodes de compression utilisées

Stever PDF Compress combine les techniques de qpdf pour obtenir le meilleur
résultat sans dégrader inutilement le document.

| Méthode | Effet | Perte |
| --- | --- | --- |
| Object streams (`--object-streams=generate`) | Regroupe et compresse les objets PDF | Aucune |
| Recompression des flux (`--recompress-flate`, niveau 9) | Recompresse tous les flux au maximum | Aucune |
| Décodage des filtres (`--decode-level=generalized`) | Convertit LZW/ASCII85/RunLength puis recompresse en deflate | Aucune |
| Normalisation du contenu (`--normalize-content`) | Nettoie les flux de contenu | Aucune |
| Ressources inutilisées (`--remove-unreferenced-resources`) | Supprime les objets non référencés | Aucune |
| Optimisation des images (`--optimize-images`, JPEG) | Recompresse les images en JPEG à la qualité choisie | Oui (modes avec images) |
| Linéarisation (`--linearize`) | Optimise l'ouverture progressive sur le web | Aucune |
| Déchiffrement (`--decrypt`) | Retire la protection par mot de passe | Aucune |

## Niveaux proposés

| Niveau | Optimisation images | Qualité JPEG | Images ciblées |
| --- | --- | --- | --- |
| Sans perte | non | — | — |
| Léger | oui | 85 | ≥ 256 × 256 |
| Équilibré (conseillé) | oui | 70 | ≥ 128 × 128 |
| Extrême | oui | 45 | ≥ 64 × 64 |

Les valeurs sont modifiables dans **Options avancées**.

Ordres de grandeur observés sur des documents scannés : **40 à 70 %** de
réduction en mode Équilibré/Extrême, **5 à 30 %** en mode Sans perte selon la
structure d'origine du fichier.

## Utilisation

1. Ouvrez le site : <https://steverlaabs.github.io/stever-pdf-compress/>.
2. Déposez un ou plusieurs fichiers PDF.
3. Choisissez un niveau de compression, puis cliquez sur **Compresser tout**.
4. Téléchargez chaque résultat ou l'archive ZIP complète.

Les fichiers restent sur votre appareil pendant tout le traitement.

## Confidentialité

- Aucun envoi réseau : l'application ne charge que ses propres ressources
  statiques (HTML, JavaScript, WebAssembly).
- Aucun stockage des documents : ils restent en mémoire dans l'onglet et
  disparaissent à la fermeture.
- Seuls les réglages d'interface (niveau, qualité, langue) sont mémorisés dans
  le `localStorage` du navigateur.

## Technique

- **Moteur** : qpdf 12.2.0 (Apache-2.0) compilé en WebAssembly via
  `@neslinesli93/qpdf-wasm` (ISC), avec zlib et libjpeg-turbo.
- **Exécution** : module WebAssembly dans un Web Worker dédié — l'interface
  reste fluide.
- **Archives** : fflate (MIT).
- **Interface** : HTML/CSS/JavaScript natifs, aucune dépendance de framework.

### Lancer en local

Servez le dossier avec n'importe quel serveur statique (un accès `file://` ne
permet pas de charger le Web Worker et le module WebAssembly) :

```bash
python -m http.server 8080
# puis ouvrir http://localhost:8080/
```

## Contenu du dépôt

| Fichier | Rôle |
| --- | --- |
| `index.html` | L'application complète (interface FR/AR, CSS, JavaScript) |
| `worker/pdf-worker.js` | Worker WebAssembly : analyse, compression, vérification |
| `vendor/qpdf.js` | Amorçage Emscripten du moteur qpdf |
| `vendor/qpdf.wasm` | Moteur qpdf 12.2 compilé en WebAssembly |
| `vendor/fflate.js` | Bibliothèque ZIP (fflate) |
| `logo.svg` | Logo horizontal « STEVER · PDF COMPRESS · ING STEVER » |
| `logo-mark.svg` | Emblème carré (avatar, favicon haute résolution) |
| `favicon.svg` | Favicon simplifié |
| `LICENSE` | Droits de publication — ING STEVER |
| `THIRD-PARTY-NOTICES.md` | Licences des composants intégrés |

## Limites connues

- Un PDF chiffré dont le mot de passe est inconnu ne peut pas être compressé.
- L'optimisation des images recompresse en JPEG : elle est **irréversible**.
  Utilisez les modes Sans perte ou Léger pour préserver la qualité.
- Les images ne sont pas sous-échantillonnées (résolution conservée) : la
  réduction porte sur la qualité JPEG et la structure du fichier.
- Les fichiers très volumineux (plus de 200 Mo) dépendent de la mémoire
  disponible du navigateur.

## Licence et droits

**© 2026 ING STEVER — Tous droits réservés.**
Toute reproduction, distribution ou modification sans autorisation écrite
préalable est interdite (voir `LICENSE`).

Les composants tiers intégrés conservent leurs licences respectives
(voir `THIRD-PARTY-NOTICES.md`) : qpdf (Apache-2.0), qpdf-wasm (ISC),
zlib, libjpeg-turbo, Emscripten, fflate (MIT).
