<p align="center">
  <img src="logo.svg" alt="Stever PDF Compress — ING STEVER" width="460">
</p>

# Stever PDF Compress

Compresseur de fichiers PDF **100 % local** : l'application s'exécute entièrement dans le navigateur, sans serveur, sans compte et sans envoi de vos documents. Le moteur est **qpdf 12 compilé en WebAssembly**, embarqué directement dans cette page HTML unique.

🌐 **Site en ligne :** <https://steverlaabs.github.io/stever-pdf-compress/>

## Fonctionnalités

- **Compression par lots** : glissez-déposez plusieurs PDF, traitez-les en une fois.
- **4 niveaux de compression** : sans perte, léger, équilibré, extrême.
- **Réglages avancés** : qualité JPEG, taille minimale des images ciblées, object streams, normalisation des flux, suppression des ressources inutilisées, linéarisation web.
- **Documents protégés** : détection automatique, déchiffrement avec le mot de passe fourni par l'utilisateur.
- **Vérification automatique** : chaque PDF produit est relu et contrôlé (`qpdf --check`) avant téléchargement.
- **Comparaison avant/après** : taille, pourcentage d'économie, total du lot.
- **Téléchargement individuel ou archive ZIP** de tous les résultats.
- **Interface bilingue français / arabe** avec support complet de la direction droite-à-gauche (RTL).
- **Aucune donnée envoyée** : tout le traitement est effectué sur l'appareil.

## Utilisation

1. Ouvrez le site : <https://steverlaabs.github.io/stever-pdf-compress/> ou ouvrez `index.html` via un serveur local.
2. Déposez un ou plusieurs fichiers PDF.
3. Choisissez un niveau de compression, puis cliquez sur **Compresser tout**.
4. Téléchargez chaque résultat ou l'archive ZIP complète.

Les fichiers restent sur votre appareil pendant tout le traitement.

## Lancer en local

Un seul fichier HTML, aucune installation :

```bash
python serve.py
# puis ouvrir http://localhost:8080/index.html
```

(ou n'importe quel serveur statique : `python -m http.server 8080`)

## Technique

- **Fichier unique** : `index.html` embarque CSS, JavaScript, le moteur qpdf (WebAssembly), la bibliothèque ZIP (fflate) et le Web Worker — aucun fichier externe après le chargement.
- **Exécution** : module WebAssembly dans un Web Worker dédié — l'interface reste fluide.
- **Interface** : HTML/CSS/JavaScript natifs, aucun framework.
- **Confidentialité** : aucun envoi réseau ; les documents restent en mémoire dans l'onglet et disparaissent à la fermeture.

## Contenu du dépôt

| Fichier | Rôle |
| --- | --- |
| `index.html` | L'application complète (HTML + CSS + JavaScript + qpdf WebAssembly + fflate + worker) |
| `serve.py` | Serveur de développement local (Python) |
| `logo.svg` | Logo horizontal « Stever PDF Compress — ING STEVER » |
| `logo-mark.svg` | Emblème carré (avatar, favicon haute résolution) |
| `favicon.svg` | Favicon simplifié |
| `LICENSE` | Droits de publication – ING STEVER |

## Licence et droits

**© 2026 ING STEVER — Tous droits réservés.**
Toute reproduction, distribution ou modification sans autorisation écrite préalable est interdite (voir `LICENSE`).

Les composants tiers intégrés conservent leurs licences respectives : qpdf (Apache-2.0), qpdf-wasm, zlib, libjpeg-turbo, Emscripten, fflate (MIT).

---
<p align="right">
هذا التطبيق مضغوط PDF محلي بالكامل يعمل في المتصفح بدون خادم وبدون إرسال أي بيانات.
</p>
