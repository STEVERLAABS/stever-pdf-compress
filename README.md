<p align="center">
  <img src="logo.svg" alt="Stever PDF Compress â€” ING STEVER" width="460">
</p>

# Stever PDF Compress

Compresseur de fichiers PDF **100 % local** : l'application s'exÃ©cute entiÃ¨rement dans le navigateur, sans serveur, sans compte et sans envoi de vos documents. Le moteur est **qpdf 12 compilÃ© en WebAssembly**, embarquÃ© directement dans cette page HTML unique.

ðŸŒ **Site en ligne :** <https://steverlaabs.github.io/stever-pdf-compress/>

## FonctionnalitÃ©s

- **Compression par lots** : glissez-dÃ©posez plusieurs PDF, traitez-les en une fois.
- **4 niveaux de compression** : sans perte, lÃ©ger, Ã©quilibrÃ©, extrÃªme.
- **RÃ©glages avancÃ©s** : qualitÃ© JPEG, taille minimale des images ciblÃ©es, object streams, normalisation des flux, suppression des ressources inutilisÃ©es, linÃ©arisation web.
- **Documents protÃ©gÃ©s** : dÃ©tection automatique, dÃ©chiffrement avec le mot de passe fourni par l'utilisateur.
- **VÃ©rification automatique** : chaque PDF produit est relu et contrÃ´lÃ© (`qpdf --check`) avant tÃ©lÃ©chargement.
- **Comparaison avant/aprÃ¨s** : taille, pourcentage d'Ã©conomie, total du lot.
- **TÃ©lÃ©chargement individuel ou archive ZIP** de tous les rÃ©sultats.
- **Interface bilingue franÃ§ais / arabe** avec support complet de la direction droite-Ã -gauche (RTL).
- **Aucune donnÃ©e envoyÃ©e** : tout le traitement est effectuÃ© sur l'appareil.

## Utilisation

1. Ouvrez le site : <https://steverlaabs.github.io/stever-pdf-compress/> ou ouvrez `index.html` via un serveur local.
2. DÃ©posez un ou plusieurs fichiers PDF.
3. Choisissez un niveau de compression, puis cliquez sur **Compresser tout**.
4. TÃ©lÃ©chargez chaque rÃ©sultat ou l'archive ZIP complÃ¨te.

Les fichiers restent sur votre appareil pendant tout le traitement.

## Lancer en local

Un seul fichier HTML, aucune installation :

```bash
python serve.py
# puis ouvrir http://localhost:8080/index.html
```

(ou n'importe quel serveur statique : `python -m http.server 8080`)

## Technique

- **Fichier unique** : `index.html` embarque CSS, JavaScript, le moteur qpdf (WebAssembly), la bibliothÃ¨que ZIP (fflate) et le Web Worker â€” aucun fichier externe aprÃ¨s le chargement.
- **ExÃ©cution** : module WebAssembly dans un Web Worker dÃ©diÃ© â€” l'interface reste fluide.
- **Interface** : HTML/CSS/JavaScript natifs, aucun framework.
- **ConfidentialitÃ©** : aucun envoi rÃ©seau ; les documents restent en mÃ©moire dans l'onglet et disparaissent Ã  la fermeture.

## Contenu du dÃ©pÃ´t

| Fichier | RÃ´le |
| --- | --- |
| `index.html` | L'application complÃ¨te (HTML + CSS + JavaScript + qpdf WebAssembly + fflate + worker) |
| `serve.py` | Serveur de dÃ©veloppement local (Python) |
| `logo.svg` | Logo horizontal Â« Stever PDF Compress â€” ING STEVER Â» |
| `logo-mark.svg` | EmblÃ¨me carrÃ© (avatar, favicon haute rÃ©solution) |
| `favicon.svg` | Favicon simplifiÃ© |
| `LICENSE` | Droits de publication â€“ ING STEVER |

## Licence et droits

**Â© 2026 ING STEVER â€” Tous droits rÃ©servÃ©s.**
Toute reproduction, distribution ou modification sans autorisation Ã©crite prÃ©alable est interdite (voir `LICENSE`).

Les composants tiers intÃ©grÃ©s conservent leurs licences respectives : qpdf (Apache-2.0), qpdf-wasm, zlib, libjpeg-turbo, Emscripten, fflate (MIT).

---
<p align="right">
هذا التطبيق مضغوط PDF محلي بالكامل يعمل في المتصفح بدون خادم وبدون إرسال أي بيانات.
</p>