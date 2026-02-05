# THÈME POWERPOINT WAVESTONE — DOCUMENTATION TECHNIQUE EXHAUSTIVE

> Document généré par analyse XML des fichiers .thmx  
> Version du thème : Wavestone July 30

---

# PARTIE 1 : FICHIER DE THÈME (theme1.xml)

---

## 1.1 IDENTIFICATION DU THÈME

| Propriété | Valeur |
|-----------|--------|
| **Nom du thème** | `Thème` |
| **ID famille** | `{7651ED72-379F-4D74-8539-27DDC192EF1C}` |
| **Version ID** | `{F0999875-5B3B-44C1-A0BE-B32C69E854DF}` |
| **Schéma de couleurs** | `Wavestone July 30` |
| **Schéma de polices** | `Wavestone NEW` |
| **Schéma de formats** | `Thème Office` |

---

## 1.2 SCHÉMA DE COULEURS (clrScheme)

### Couleurs sémantiques principales

| Identifiant | Nom XML | Code HEX | Nom descriptif | Usage |
|-------------|---------|----------|----------------|-------|
| **dk1** | Sombre 1 | `#000000` | Noir | Texte principal |
| **lt1** | Clair 1 | `#FFFFFF` | Blanc | Arrière-plans |
| **dk2** | Sombre 2 | `#FFFFFF` | Blanc | Texte secondaire |
| **lt2** | Clair 2 | `#451DC7` | Violet Wavestone | Couleur signature |

### Couleurs d'accentuation

| Identifiant | Code HEX | Nom descriptif | Usage typique |
|-------------|----------|----------------|---------------|
| **accent1** | `#04F06A` | Vert vif | Mise en valeur, succès |
| **accent2** | `#CAFEE0` | Vert menthe | Arrière-plans légers |
| **accent3** | `#250F6B` | Indigo foncé | Fonds de slides |
| **accent4** | `#4682B4` | Bleu acier | Graphiques |
| **accent5** | `#8F00FF` | Violet électrique | Accents dynamiques |
| **accent6** | `#F6F6F6` | Gris très clair | Fonds neutres |

### Couleurs de liens

| Identifiant | Code HEX | Usage |
|-------------|----------|-------|
| **hlink** | `#451DC7` | Liens hypertextes actifs |
| **folHlink** | `#451DC7` | Liens visités |

### Correspondance sémantique (mapping dans le masque)

```
bg1 ←→ lt1 (Blanc #FFFFFF)     - Arrière-plan principal
bg2 ←→ lt2 (Violet #451DC7)    - Couleur de marque  
tx1 ←→ dk1 (Noir #000000)      - Texte sur fond clair
tx2 ←→ dk2 (Violet #451DC7)    - Texte de marque
```

---

## 1.3 SCHÉMA DE POLICES (fontScheme)

### Police majeure (titres)

| Propriété | Valeur |
|-----------|--------|
| **Nom** | `Aptos SemiBold` |
| **Référence XML** | `+mj-lt` |
| **Style** | Semi-gras (600) |
| **Type** | Sans-serif moderne |
| **Usage** | Titres, en-têtes, texte d'impact |

### Police mineure (corps)

| Propriété | Valeur |
|-----------|--------|
| **Nom** | `Aptos` |
| **Référence XML** | `+mn-lt` |
| **Style** | Regular (400) |
| **Type** | Sans-serif moderne |
| **Usage** | Corps de texte, paragraphes |

### Polices complémentaires utilisées dans le thème

| Police | Usage |
|--------|-------|
| **Aptos Light** | Métadonnées (date, auteur) |
| **Tempus Sans ITC** | Numéros de chapitres et d'agenda |
| **Poppins** | Puces de niveau 3, éléments UI |
| **Poppins Light** | Texte léger |
| **Avenir Next LT Pro** | Puces de niveau 2 |
| **Courier New** | Puces cercle vide (niveaux 4+) |
| **Arial** | Texte alternatif |

---

## 1.4 STYLES DE REMPLISSAGE (fillStyleLst)

### Style 1 : Remplissage uni
```
Type : solidFill
Couleur : Couleur du placeholder (phClr)
```

### Style 2 : Dégradé léger vertical
```
Type : gradFill (rotation avec forme)
Direction : 90° vertical (5400000 EMU = 5.4M)

Arrêts de couleur :
  0%   → lumMod 110%, satMod 105%, tint 67%
  50%  → lumMod 105%, satMod 103%, tint 73%
  100% → lumMod 105%, satMod 109%, tint 81%
```

### Style 3 : Dégradé intense vertical
```
Type : gradFill (rotation avec forme)
Direction : 90° vertical

Arrêts de couleur :
  0%   → satMod 103%, lumMod 102%, tint 94%
  50%  → satMod 110%, lumMod 100%, shade 100%
  100% → lumMod 99%, satMod 120%, shade 78%
```

---

## 1.5 STYLES DE LIGNES (lnStyleLst)

| Style | Épaisseur EMU | Épaisseur pt | Terminaison | Type |
|-------|---------------|--------------|-------------|------|
| **1** | 6 350 | 0,5 pt | Plate (`flat`) | Simple |
| **2** | 12 700 | 1,0 pt | Plate | Simple |
| **3** | 19 050 | 1,5 pt | Plate | Simple |

**Propriétés communes :**
- Remplissage : couleur du placeholder (`phClr`)
- Tiret : solide (`solid`)
- Jointure : mitre avec limite 800000

---

## 1.6 STYLES D'EFFETS (effectStyleLst)

| Style | Effet |
|-------|-------|
| **1** | Aucun effet |
| **2** | Aucun effet |
| **3** | Ombre portée |

### Détail du style d'effet 3 (ombre portée)

| Propriété | Valeur EMU | Valeur convertie |
|-----------|------------|------------------|
| **Rayon de flou** | 57 150 | 4,5 pt |
| **Distance** | 19 050 | 1,5 pt |
| **Direction** | 5 400 000 | 90° (vers le bas) |
| **Alignement** | Centre | — |
| **Rotation avec forme** | Non | — |
| **Couleur** | `#000000` | Noir |
| **Opacité** | 63% | — |

---

## 1.7 STYLES D'ARRIÈRE-PLAN (bgFillStyleLst)

### Style 1 : Fond uni
```
Type : solidFill
Couleur : phClr (couleur du placeholder)
```

### Style 2 : Fond teinté
```
Type : solidFill
Couleur : phClr avec tint 95%, satMod 170%
```

### Style 3 : Dégradé radial pour couvertures
```
Type : gradFill (rotation avec forme)
Direction : 90° vertical

Arrêts :
  0%   → tint 93%, satMod 150%, shade 98%, lumMod 102%
  50%  → tint 98%, satMod 130%, shade 90%, lumMod 103%
  100% → shade 63%, satMod 120%
```

---

## 1.8 OBJETS PAR DÉFAUT (objectDefaults)

### Forme par défaut (spDef)

| Propriété | Valeur |
|-----------|--------|
| **Remplissage** | `accent6` → Gris très clair (`#F6F6F6`) |
| **Bordure** | Aucune (`noFill`) |
| **Marges internes** | 108 000 EMU = 3 cm (tous côtés) |
| **Ancrage texte** | Haut (`anchor="t"`) |
| **Ajustement auto** | Désactivé |

#### Style de texte dans les formes

| Propriété | Valeur |
|-----------|--------|
| **Alignement** | Gauche |
| **Espacement avant** | 6 pt (600 centièmes) |
| **Taille** | 20 pt |
| **Couleur** | `bg2` → Violet Wavestone |

### Ligne par défaut (lnDef)

| Propriété | Valeur |
|-----------|--------|
| **Couleur** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Style de référence** | Index 1 (0,5 pt) |

### Zone de texte par défaut (txDef)

| Propriété | Valeur |
|-----------|--------|
| **Remplissage** | Aucun |
| **Marges** | L: 0, T: 36000 EMU (1pt), R: 0, B: 36000 EMU |
| **Ajustement** | Auto (`spAutoFit`) |
| **Alignement** | Gauche |
| **Espacement avant** | 6 pt |
| **Taille par défaut** | 16 pt |

---

# PARTIE 2 : SLIDE MASTER (MASQUE)

---

## 2.1 INFORMATIONS GÉNÉRALES

| Propriété | Valeur |
|-----------|--------|
| **Fichier** | `slideMaster1.xml` |
| **Préservé** | Oui (`preserve="1"`) |
| **Mode N&B** | Gris clair (`ltGray`) |
| **Layouts associés** | 28 |

---

## 2.2 ARRIÈRE-PLAN DU MASQUE

| Propriété | Valeur |
|-----------|--------|
| **Type** | Référence thème (`bgRef`) |
| **Index** | 1001 |
| **Couleur** | `bg1` → Blanc (`#FFFFFF`) |

---

## 2.3 PLACEHOLDER TITRE

### Position et dimensions

| Propriété | EMU | Centimètres |
|-----------|-----|-------------|
| **X** | 423 984 | 1,18 cm |
| **Y** | 404 664 | 1,12 cm |
| **Largeur** | 11 342 769 | 31,51 cm |
| **Hauteur** | 936 774 | 2,60 cm |

### Propriétés

| Propriété | Valeur |
|-----------|--------|
| **Nom** | `Title Placeholder 1` |
| **Forme** | Rectangle (`rect`) |
| **Remplissage** | Aucun |
| **Marges internes** | 0 (tous côtés) |
| **Ancrage** | Haut |
| **Ajustement** | Désactivé |

### Style de texte (titleStyle)

| Propriété | Valeur |
|-----------|--------|
| **Police** | Aptos SemiBold (`+mj-lt`) |
| **Taille** | 24 pt |
| **Couleur** | Violet Wavestone (`bg2` → `#451DC7`) |
| **Alignement** | Gauche |
| **Interligne** | 100% |
| **Espacement avant** | 0% |
| **Crénage** | 1200 |

**Texte par défaut :** `Complete with a title here that carries your message on two lines at most for more readability`

---

## 2.4 PLACEHOLDER CORPS DE TEXTE

### Position et dimensions

| Propriété | EMU | Centimètres |
|-----------|-----|-------------|
| **X** | 423 984 | 1,18 cm |
| **Y** | 1 341 438 | 3,73 cm |
| **Largeur** | 11 342 769 | 31,51 cm |
| **Hauteur** | 4 894 976 | 13,60 cm |

### Propriétés

| Propriété | Valeur |
|-----------|--------|
| **Nom** | `Text placeholder 1` |
| **Marges** | L: 0, T: 1pt, R: 0, B: 1pt |
| **Ajustement** | Désactivé |

---

## 2.5 HIÉRARCHIE DES NIVEAUX DE TEXTE (bodyStyle)

### Niveau 1 — Sans puce

| Propriété | Valeur |
|-----------|--------|
| **Marge gauche** | 0 cm (0 EMU) |
| **Retrait** | 0 cm |
| **Puce** | Aucune |
| **Police** | Aptos (`+mn-lt`) |
| **Taille** | 16 pt |
| **Couleur** | Noir (`tx1` → `#000000`) |
| **Alignement** | Gauche |
| **Espacement avant** | 6 pt |
| **Interligne** | 100% |

### Niveau 2 — Puce ronde pleine

| Propriété | Valeur |
|-----------|--------|
| **Marge gauche** | 0,75 cm (271 463 EMU) |
| **Retrait** | -0,75 cm (-271 463 EMU) |
| **Puce** | `•` (rond plein) |
| **Police de puce** | Avenir Next LT Pro |
| **Couleur de puce** | Violet (`bg2` → `#451DC7`) |
| **Police texte** | Aptos |
| **Taille** | 16 pt |
| **Couleur** | Noir |
| **Espacement avant** | 6 pt |

### Niveau 3 — Tiret

| Propriété | Valeur |
|-----------|--------|
| **Marge gauche** | 1,50 cm (539 750 EMU) |
| **Retrait** | -0,76 cm (-273 050 EMU) |
| **Puce** | `–` (tiret demi-cadratin) |
| **Police de puce** | Poppins |
| **Couleur de puce** | Violet (`bg2`) |
| **Police texte** | Aptos |
| **Taille** | 14 pt |
| **Espacement avant** | 6 pt |

### Niveau 4 — Cercle vide

| Propriété | Valeur |
|-----------|--------|
| **Marge gauche** | 2,24 cm (806 450 EMU) |
| **Retrait** | -0,74 cm (-266 700 EMU) |
| **Puce** | `o` (cercle vide) |
| **Police de puce** | Courier New |
| **Couleur de puce** | Violet (`bg2`) |
| **Police texte** | Aptos |
| **Taille** | 12 pt |
| **Espacement avant** | 6 pt |

### Niveaux 5-9 — Cercle vide (identiques au niveau 4)

| Niveau | Marge | Alignement | Taille | Espacement |
|--------|-------|------------|--------|------------|
| 5 | 2,24 cm | Gauche | 12 pt | 6 pt |
| 6 | 1,50 cm | Justifié | 12 pt | 6 pt |
| 7 | 2,00 cm | Justifié | 12 pt | 5 pt |
| 8 | 2,24 cm | Justifié | 12 pt | 6 pt |
| 9 | 2,24 cm | Justifié | 12 pt | 6 pt |

---

## 2.6 TABLEAU RÉCAPITULATIF DES PUCES

| Niv | Marge | Puce | Police puce | Couleur | Taille texte |
|-----|-------|------|-------------|---------|--------------|
| 1 | 0 | — | — | — | 16 pt |
| 2 | 0,75 cm | • | Avenir Next LT Pro | Violet | 16 pt |
| 3 | 1,50 cm | – | Poppins | Violet | 14 pt |
| 4 | 2,24 cm | o | Courier New | Violet | 12 pt |
| 5+ | 2,24 cm | o | Courier New | Violet | 12 pt |

---

## 2.7 ÉLÉMENT COPYRIGHT

### Position et dimensions

| Propriété | EMU | Centimètres |
|-----------|-----|-------------|
| **X** | 10 591 800 | 29,42 cm |
| **Y** | 6 578 600 | 18,27 cm |
| **Largeur** | 1 189 038 | 3,30 cm |
| **Hauteur** | 239 774 | 0,67 cm |

### Style

| Propriété | Valeur |
|-----------|--------|
| **Format** | `© WAVESTONE | <N°>` |
| **Police** | Aptos (`+mn-lt`) |
| **Taille** | 7 pt |
| **Couleur** | Violet (`bg2`) |
| **Alignement H** | Droite |
| **Alignement V** | Centre |

---

## 2.8 STICKERS DE STATUT

### Caractéristiques communes

| Propriété | Valeur |
|-----------|--------|
| **Position X** | 25,98 cm (9 352 934 EMU) |
| **Position Y** | 1,22 cm (437 670 EMU) |
| **Largeur** | 6,67 cm (2 400 300 EMU) |
| **Hauteur** | 1,75 cm (628 650 EMU) |
| **Visibilité** | Caché par défaut |
| **Forme** | Rectangle coins arrondis (rayon 8%) |
| **Remplissage** | Violet Wavestone (`bg2`) |
| **Bordure** | Aucune |

### Ombre portée

| Propriété | Valeur |
|-----------|--------|
| **Flou** | 14 pt (177 800 EMU) |
| **Distance** | 10 pt (127 000 EMU) |
| **Direction** | 90° (bas) |
| **Couleur** | Violet à 15% opacité |

### Style du texte

| Propriété | Valeur |
|-----------|--------|
| **Police** | Aptos |
| **Graisse** | Gras |
| **Taille** | 12 pt |
| **Couleur** | Blanc (`bg1`) |
| **Alignement** | Centre H + Centre V |

### Liste des 8 stickers

| ID | Nom interne | Texte affiché |
|----|-------------|---------------|
| 71 | `Backup [Sticker]` | **BACK UP** |
| 69 | `Dummy [Sticker]` | **DUMMY DATA** |
| 68 | `Update [Sticker]` | **UPDATE DATA** |
| 67 | `Final [Sticker]` | **FINAL SLIDE** |
| 66 | `Draft [Sticker]` | **DRAFT SLIDE** |
| 10 | `Discussion [Sticker]` | **FOR DISCUSSION** |
| 9 | `Internal [Sticker]` | **INTERNAL USE ONLY** |
| 7 | `Responsible [Sticker]` | **RESPONSIBLE: XXX** |

---

## 2.9 COMMENTAIRES DE RÉVISION

| Propriété | Valeur |
|-----------|--------|
| **Position X** | 25,29 cm |
| **Position Y** | 1,12 cm |
| **Largeur** | 6,67 cm |
| **Hauteur** | 2,06 cm |
| **Visibilité** | Caché |

| Nom interne | Texte |
|-------------|-------|
| `Content [Comment]` | Content |
| `Formatting [Comment]` | Formatting |

---

## 2.10 PLACEHOLDER NOTE DE BAS DE PAGE

| Propriété | Valeur |
|-----------|--------|
| **Position** | X: 1,18 cm, Y: 17,36 cm |
| **Taille** | 31,51 cm × 0,71 cm |
| **Visibilité** | Caché |
| **Format** | `(n)` |
| **Police** | Aptos 9 pt noir |

---

## 2.11 HARVEY BALLS

### Groupes disponibles

| Groupe | États | Visibilité par défaut |
|--------|-------|----------------------|
| Harvey 3 | 0/3, 1/3, 2/3, 3/3 | Caché |
| Harvey 4 | 0/4 à 4/4 | Caché |
| Harvey 8 | 0/8 à 8/8 | Caché |

### Propriétés

| Propriété | Valeur |
|-----------|--------|
| **Position** | X: 31,76 cm, Y: 3,85 cm |
| **Diamètre** | 0,81 cm |
| **Couleur pleine** | Violet (`bg2`) |
| **Bordure** | Violet, 1,5 pt |

---

## 2.12 GUIDES DE MISE EN PAGE

### Guides horizontaux

| ID | Position (cm) | Usage |
|----|---------------|-------|
| 21 | 6,64 | Principal |
| 25 | 0,71 | Marge haute |
| 26 | 2,35 | Haut contenu |
| 27 | 10,92 | Centre |
| 28 | 11,83 | Secondaire |

### Guides verticaux

| ID | Position (cm) | Usage |
|----|---------------|-------|
| 23 | 0,74 | Marge gauche |
| 24 | 20,62 | Colonnes |

**Couleur des guides :** Orange (`#F26B43`)

---

# PARTIE 3 : LES 28 LAYOUTS

---

## LAYOUT 1 : Cover full blue with picture

### Arrière-plan
Dégradé personnalisé

### Éléments (9 visibles)

#### Subtitle 1

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 1.18 cm |
| **Position Y** | 5.88 cm |
| **Largeur** | 18.93 cm |
| **Hauteur** | 1.38 cm |
| **Police** | Arial |
| **Taille police** | 18.0 pt |
| **Couleur texte** | `bg1` → Blanc (`#FFFFFF`) |
| **Remplissage** | `bg1` → Blanc (`#FFFFFF`) |
| **Forme** | Rectangle |
| **Texte par défaut** | "Placeholder for your sub headline" |

#### Client logo placeholder

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder image |
| **Position X** | 1.18 cm |
| **Position Y** | 9.58 cm |
| **Largeur** | 7.3 cm |
| **Hauteur** | 2.17 cm |
| **Couleur texte** | `bg1` → Blanc (`#FFFFFF`) |
| **Remplissage** | `bg1` → Blanc (`#FFFFFF`) |
| **Texte par défaut** | "Insert logo client" |

#### Date Author Internal placeholer

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 1.18 cm |
| **Position Y** | 7.27 cm |
| **Largeur** | 18.93 cm |
| **Hauteur** | 1.34 cm |
| **Police** | Aptos Light |
| **Taille police** | 12.0 pt |
| **Couleur texte** | `bg1` → Blanc (`#FFFFFF`) |
| **Remplissage** | `bg1` → Blanc (`#FFFFFF`) |
| **Texte par défaut** | "Date | Author | Internal" |

#### Freeform: Shape 16

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 0.02 cm |
| **Position Y** | 10.88 cm |
| **Largeur** | 33.83 cm |
| **Hauteur** | 7.22 cm |
| **Remplissage** | Aucun |

#### Freeform: Shape 17

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 22.48 cm |
| **Position Y** | 6.59 cm |
| **Largeur** | 11.37 cm |
| **Hauteur** | 12.44 cm |
| **Remplissage** | Aucun |

#### Picture Placeholder 1

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder image |
| **Position X** | 20.6 cm |
| **Position Y** | 0.0 cm |
| **Largeur** | 13.26 cm |
| **Hauteur** | 19.05 cm |
| **Couleur texte** | `bg1` → Blanc (`#FFFFFF`) |
| **Remplissage** | `bg1` → Blanc (`#FFFFFF`) |
| **Texte par défaut** | "Insert image" |

#### Title 9

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder titre |
| **Position X** | 1.18 cm |
| **Position Y** | 1.12 cm |
| **Largeur** | 18.93 cm |
| **Hauteur** | 4.74 cm |
| **Taille police** | 34.0 pt |
| **Couleur texte** | `bg1` → Blanc (`#FFFFFF`) |
| **Remplissage** | `bg1` → Blanc (`#FFFFFF`) |
| **Texte par défaut** | "Complete here with the title of your presentation  of maximum 3 lines" |

#### Blue Wavestone logo

| Propriété | Valeur |
|-----------|--------|
| **Type** | Image |
| **Position X** | 0.54 cm |
| **Position Y** | 16.87 cm |
| **Largeur** | 7.62 cm |
| **Hauteur** | 1.9 cm |

#### White Wavestone logo

| Propriété | Valeur |
|-----------|--------|
| **Type** | Image |
| **Position X** | 0.54 cm |
| **Position Y** | 16.87 cm |
| **Largeur** | 7.62 cm |
| **Hauteur** | 1.9 cm |

---

## LAYOUT 2 : Cover full blue without picture

### Arrière-plan
Dégradé personnalisé

### Éléments (8 visibles)

#### Subtitle 1

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 1.18 cm |
| **Position Y** | 5.88 cm |
| **Largeur** | 18.93 cm |
| **Hauteur** | 1.38 cm |
| **Police** | Arial |
| **Taille police** | 18.0 pt |
| **Couleur texte** | `bg1` → Blanc (`#FFFFFF`) |
| **Remplissage** | `bg1` → Blanc (`#FFFFFF`) |
| **Forme** | Rectangle |
| **Texte par défaut** | "Placeholder for your sub headline" |

#### Client logo placeholder

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder image |
| **Position X** | 1.18 cm |
| **Position Y** | 9.58 cm |
| **Largeur** | 7.3 cm |
| **Hauteur** | 2.17 cm |
| **Couleur texte** | `bg1` → Blanc (`#FFFFFF`) |
| **Remplissage** | `bg1` → Blanc (`#FFFFFF`) |
| **Texte par défaut** | "Insert logo client" |

#### Date Author Internal placeholer

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 1.18 cm |
| **Position Y** | 7.27 cm |
| **Largeur** | 18.93 cm |
| **Hauteur** | 1.34 cm |
| **Police** | Aptos Light |
| **Taille police** | 12.0 pt |
| **Couleur texte** | `bg1` → Blanc (`#FFFFFF`) |
| **Remplissage** | `bg1` → Blanc (`#FFFFFF`) |
| **Texte par défaut** | "Date | Author | Internal" |

#### Title 9

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder titre |
| **Position X** | 1.18 cm |
| **Position Y** | 1.12 cm |
| **Largeur** | 18.93 cm |
| **Hauteur** | 4.74 cm |
| **Taille police** | 34.0 pt |
| **Couleur texte** | `bg1` → Blanc (`#FFFFFF`) |
| **Remplissage** | `bg1` → Blanc (`#FFFFFF`) |
| **Texte par défaut** | "Complete here with the title of your presentation  of maximum 3 lines" |

#### Freeform: Shape 3

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 0.02 cm |
| **Position Y** | 10.88 cm |
| **Largeur** | 33.83 cm |
| **Hauteur** | 7.22 cm |
| **Remplissage** | Aucun |

#### Freeform: Shape 9

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 22.48 cm |
| **Position Y** | 6.59 cm |
| **Largeur** | 11.37 cm |
| **Hauteur** | 12.44 cm |
| **Remplissage** | Aucun |

#### Blue Wavestone logo

| Propriété | Valeur |
|-----------|--------|
| **Type** | Image |
| **Position X** | 0.54 cm |
| **Position Y** | 16.87 cm |
| **Largeur** | 7.62 cm |
| **Hauteur** | 1.9 cm |

#### White Wavestone logo

| Propriété | Valeur |
|-----------|--------|
| **Type** | Image |
| **Position X** | 0.54 cm |
| **Position Y** | 16.87 cm |
| **Largeur** | 7.62 cm |
| **Hauteur** | 1.9 cm |

---

## LAYOUT 3 : Cover full white with picture

### Arrière-plan
Couleur unie : `bg1` → Blanc (`#FFFFFF`)

### Éléments (9 visibles)

#### Subtitle 1

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 1.18 cm |
| **Position Y** | 5.88 cm |
| **Largeur** | 18.93 cm |
| **Hauteur** | 1.38 cm |
| **Police** | Arial |
| **Taille police** | 18.0 pt |
| **Couleur texte** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Remplissage** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Forme** | Rectangle |
| **Texte par défaut** | "Placeholder for your sub headline" |

#### Client logo placeholder

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder image |
| **Position X** | 1.18 cm |
| **Position Y** | 9.58 cm |
| **Largeur** | 7.3 cm |
| **Hauteur** | 2.17 cm |
| **Couleur texte** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Remplissage** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Texte par défaut** | "Insert logo client" |

#### Date Author Internal placeholer

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 1.18 cm |
| **Position Y** | 7.27 cm |
| **Largeur** | 18.93 cm |
| **Hauteur** | 1.34 cm |
| **Police** | Aptos Light |
| **Taille police** | 12.0 pt |
| **Couleur texte** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Remplissage** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Texte par défaut** | "Date | Author | Internal" |

#### Picture Placeholder

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder image |
| **Position X** | 20.6 cm |
| **Position Y** | 0.0 cm |
| **Largeur** | 13.26 cm |
| **Hauteur** | 19.05 cm |
| **Couleur texte** | `tx1` → Noir (`#000000`) |
| **Remplissage** | `tx1` → Noir (`#000000`) |
| **Texte par défaut** | "Insert image" |

#### Title 9

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder titre |
| **Position X** | 1.18 cm |
| **Position Y** | 1.12 cm |
| **Largeur** | 18.93 cm |
| **Hauteur** | 4.74 cm |
| **Taille police** | 34.0 pt |
| **Couleur texte** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Remplissage** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Texte par défaut** | "Complete here with the title of your presentation  of maximum 3 lines" |

#### Freeform: Shape 10

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Largeur** | 33.99 cm |
| **Hauteur** | 7.26 cm |
| **Remplissage** | Aucun |

#### Freeform: Shape 13

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 22.51 cm |
| **Position Y** | 6.56 cm |
| **Largeur** | 11.42 cm |
| **Hauteur** | 12.5 cm |
| **Remplissage** | Aucun |

#### White Wavestone logo

| Propriété | Valeur |
|-----------|--------|
| **Type** | Image |
| **Position X** | 0.54 cm |
| **Position Y** | 16.87 cm |
| **Largeur** | 7.62 cm |
| **Hauteur** | 1.9 cm |

#### Blue Wavestone logo

| Propriété | Valeur |
|-----------|--------|
| **Type** | Image |
| **Position X** | 0.54 cm |
| **Position Y** | 16.87 cm |
| **Largeur** | 7.62 cm |
| **Hauteur** | 1.9 cm |

---

## LAYOUT 4 : Cover full white without picture

### Arrière-plan
Couleur unie : `bg1` → Blanc (`#FFFFFF`)

### Éléments (8 visibles)

#### Subtitle 1

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 1.18 cm |
| **Position Y** | 5.88 cm |
| **Largeur** | 18.93 cm |
| **Hauteur** | 1.38 cm |
| **Police** | Arial |
| **Taille police** | 18.0 pt |
| **Couleur texte** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Remplissage** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Forme** | Rectangle |
| **Texte par défaut** | "Placeholder for your sub headline" |

#### Client logo placeholder

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder image |
| **Position X** | 1.18 cm |
| **Position Y** | 9.58 cm |
| **Largeur** | 7.3 cm |
| **Hauteur** | 2.17 cm |
| **Couleur texte** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Remplissage** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Texte par défaut** | "Insert logo client" |

#### Date Author Internal placeholer

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 1.18 cm |
| **Position Y** | 7.27 cm |
| **Largeur** | 18.93 cm |
| **Hauteur** | 1.34 cm |
| **Police** | Aptos Light |
| **Taille police** | 12.0 pt |
| **Couleur texte** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Remplissage** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Texte par défaut** | "Date | Author | Internal" |

#### Title 9

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder titre |
| **Position X** | 1.18 cm |
| **Position Y** | 1.12 cm |
| **Largeur** | 18.93 cm |
| **Hauteur** | 4.74 cm |
| **Taille police** | 34.0 pt |
| **Couleur texte** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Remplissage** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Texte par défaut** | "Complete here with the title of your presentation  of maximum 3 lines" |

#### Freeform: Shape 9

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 0.02 cm |
| **Position Y** | 10.88 cm |
| **Largeur** | 33.83 cm |
| **Hauteur** | 7.22 cm |
| **Remplissage** | Aucun |

#### Freeform: Shape 12

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 22.48 cm |
| **Position Y** | 6.59 cm |
| **Largeur** | 11.37 cm |
| **Hauteur** | 12.44 cm |
| **Remplissage** | Aucun |

#### White Wavestone logo

| Propriété | Valeur |
|-----------|--------|
| **Type** | Image |
| **Position X** | 0.54 cm |
| **Position Y** | 16.87 cm |
| **Largeur** | 7.62 cm |
| **Hauteur** | 1.9 cm |

#### Blue Wavestone logo

| Propriété | Valeur |
|-----------|--------|
| **Type** | Image |
| **Position X** | 0.54 cm |
| **Position Y** | 16.87 cm |
| **Largeur** | 7.62 cm |
| **Hauteur** | 1.9 cm |

---

## LAYOUT 5 : General content without picture 

### Arrière-plan
Hérite du masque (blanc)

### Éléments (4 visibles)

#### Toptitle placeholder 1

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 1.18 cm |
| **Position Y** | 0.4 cm |
| **Largeur** | 21.65 cm |
| **Hauteur** | 0.72 cm |
| **Police** | Aptos (mineure) |
| **Taille police** | 10.0 pt |
| **Couleur texte** | `accent3` → Indigo foncé (`#250F6B`) |
| **Remplissage** | `accent3` → Indigo foncé (`#250F6B`) |
| **Forme** | Rectangle |
| **Texte par défaut** | "Insert a top title here - must not exceed 1 line" |

#### Chapter placeholder 1

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 22.83 cm |
| **Position Y** | 0.4 cm |
| **Largeur** | 9.86 cm |
| **Hauteur** | 0.72 cm |
| **Police** | Aptos (mineure) |
| **Taille police** | 10.0 pt |
| **Couleur texte** | `accent3` → Indigo foncé (`#250F6B`) |
| **Remplissage** | `accent3` → Indigo foncé (`#250F6B`) |
| **Forme** | Rectangle |
| **Texte par défaut** | "CHAPTER 1 – CHAPTER 2 – CHAPTER 3 " |

#### Title 1

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder titre |
| **Position X** | 1.18 cm |
| **Position Y** | 1.12 cm |
| **Largeur** | 31.51 cm |
| **Hauteur** | 2.6 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 24.0 pt |
| **Couleur texte** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Remplissage** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Texte par défaut** | "Complete with a title here that carries your message on two lines at most for more  readability" |

#### Content Placeholder 4

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 1.18 cm |
| **Position Y** | 3.73 cm |
| **Largeur** | 31.51 cm |
| **Hauteur** | 13.6 cm |
| **Texte par défaut** | "Click to edit Master text styles Second level Third level Fourth level Fifth level" |

---

## LAYOUT 6 : Headline only

### Arrière-plan
Hérite du masque (blanc)

### Éléments (3 visibles)

#### Toptitle 1

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 1.18 cm |
| **Position Y** | 0.4 cm |
| **Largeur** | 21.65 cm |
| **Hauteur** | 0.72 cm |
| **Police** | Aptos (mineure) |
| **Taille police** | 10.0 pt |
| **Couleur texte** | `accent3` → Indigo foncé (`#250F6B`) |
| **Remplissage** | `accent3` → Indigo foncé (`#250F6B`) |
| **Forme** | Rectangle |
| **Texte par défaut** | "Insert a top title here - must not exceed 1 line" |

#### Chapter placeholder 1

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 22.83 cm |
| **Position Y** | 0.4 cm |
| **Largeur** | 9.86 cm |
| **Hauteur** | 0.72 cm |
| **Police** | Aptos (mineure) |
| **Taille police** | 10.0 pt |
| **Couleur texte** | `accent3` → Indigo foncé (`#250F6B`) |
| **Remplissage** | `accent3` → Indigo foncé (`#250F6B`) |
| **Forme** | Rectangle |
| **Texte par défaut** | "CHAPTER 1 – CHAPTER 2 – CHAPTER 3 " |

#### Title 1

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder titre |
| **Position X** | 1.18 cm |
| **Position Y** | 1.12 cm |
| **Largeur** | 31.51 cm |
| **Hauteur** | 2.6 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 24.0 pt |
| **Couleur texte** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Remplissage** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Texte par défaut** | "Complete with a title here that carries your message on two lines at most for more readability" |

---

## LAYOUT 7 : Flat text left + text right

### Arrière-plan
Hérite du masque (blanc)

### Éléments (5 visibles)

#### Toptitle placeholder 1

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 1.18 cm |
| **Position Y** | 0.4 cm |
| **Largeur** | 21.65 cm |
| **Hauteur** | 0.72 cm |
| **Police** | Aptos (mineure) |
| **Taille police** | 10.0 pt |
| **Couleur texte** | `accent3` → Indigo foncé (`#250F6B`) |
| **Remplissage** | `accent3` → Indigo foncé (`#250F6B`) |
| **Forme** | Rectangle |
| **Texte par défaut** | "Insert a top title here - must not exceed 1 line" |

#### Chapter placeholder 1

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 22.83 cm |
| **Position Y** | 0.4 cm |
| **Largeur** | 9.86 cm |
| **Hauteur** | 0.72 cm |
| **Police** | Aptos (mineure) |
| **Taille police** | 10.0 pt |
| **Couleur texte** | `accent3` → Indigo foncé (`#250F6B`) |
| **Remplissage** | `accent3` → Indigo foncé (`#250F6B`) |
| **Forme** | Rectangle |
| **Texte par défaut** | "CHAPTER 1 – CHAPTER 2 – CHAPTER 3 " |

#### Title 1

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder titre |
| **Position X** | 1.18 cm |
| **Position Y** | 1.12 cm |
| **Largeur** | 31.51 cm |
| **Hauteur** | 2.6 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 24.0 pt |
| **Couleur texte** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Remplissage** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Texte par défaut** | "Complete with a title here that carries your message on two lines at most for more  readability" |

#### Text placeholder 1

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 1.18 cm |
| **Position Y** | 3.73 cm |
| **Largeur** | 15.28 cm |
| **Hauteur** | 13.6 cm |
| **Texte par défaut** | "Click to edit Master text styles Second level Third level Fourth level Fifth level" |

#### Text placeholder 2

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 17.41 cm |
| **Position Y** | 3.73 cm |
| **Largeur** | 15.28 cm |
| **Hauteur** | 13.6 cm |
| **Texte par défaut** | "Click to edit Master text styles Second level Third level Fourth level Fifth level" |

---

## LAYOUT 8 : General content with picture right

### Arrière-plan
Hérite du masque (blanc)

### Éléments (4 visibles)

#### Toptitle 1

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 1.18 cm |
| **Position Y** | 0.4 cm |
| **Largeur** | 18.95 cm |
| **Hauteur** | 0.72 cm |
| **Police** | Aptos (mineure) |
| **Taille police** | 10.0 pt |
| **Couleur texte** | `accent3` → Indigo foncé (`#250F6B`) |
| **Remplissage** | `accent3` → Indigo foncé (`#250F6B`) |
| **Forme** | Rectangle |
| **Texte par défaut** | "Insert a top title here - must not exceed 1 line" |

#### Title 1

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder titre |
| **Position X** | 1.18 cm |
| **Position Y** | 1.12 cm |
| **Largeur** | 18.95 cm |
| **Hauteur** | 2.6 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 24.0 pt |
| **Couleur texte** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Remplissage** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Texte par défaut** | "Complete with a title here that carries your message on two lines at most for more  readability" |

#### Content Placeholder 4

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 1.18 cm |
| **Position Y** | 3.73 cm |
| **Largeur** | 18.95 cm |
| **Hauteur** | 13.6 cm |
| **Texte par défaut** | "Click to edit Master text styles Second level Third level Fourth level Fifth level" |

#### Picture Placeholder 1

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder image |
| **Position X** | 21.94 cm |
| **Position Y** | 0.0 cm |
| **Largeur** | 11.92 cm |
| **Hauteur** | 19.05 cm |
| **Texte par défaut** | "Insert image" |

---

## LAYOUT 9 : General content with picture bottom

### Arrière-plan
Hérite du masque (blanc)

### Éléments (5 visibles)

#### Toptitle 1

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 1.18 cm |
| **Position Y** | 0.4 cm |
| **Largeur** | 21.65 cm |
| **Hauteur** | 0.72 cm |
| **Police** | Aptos (mineure) |
| **Taille police** | 10.0 pt |
| **Couleur texte** | `accent3` → Indigo foncé (`#250F6B`) |
| **Remplissage** | `accent3` → Indigo foncé (`#250F6B`) |
| **Forme** | Rectangle |
| **Texte par défaut** | "Insert a top title here - must not exceed 1 line" |

#### Title 1

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder titre |
| **Position X** | 1.18 cm |
| **Position Y** | 1.12 cm |
| **Largeur** | 31.51 cm |
| **Hauteur** | 2.6 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 24.0 pt |
| **Couleur texte** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Remplissage** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Texte par défaut** | "Complete with a title here that carries your message on two lines at most for more  readability" |

#### Content Placeholder 4

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 1.18 cm |
| **Position Y** | 3.73 cm |
| **Largeur** | 31.51 cm |
| **Hauteur** | 8.8 cm |
| **Texte par défaut** | "Click to edit Master text styles Second level Third level Fourth level Fifth level" |

#### Picture Placeholder 1

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder image |
| **Position X** | 0.0 cm |
| **Position Y** | 12.91 cm |
| **Largeur** | 33.87 cm |
| **Hauteur** | 6.14 cm |
| **Texte par défaut** | "Insert image" |

#### Chapter placeholder 1

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 22.83 cm |
| **Position Y** | 0.4 cm |
| **Largeur** | 9.86 cm |
| **Hauteur** | 0.72 cm |
| **Police** | Aptos (mineure) |
| **Taille police** | 10.0 pt |
| **Couleur texte** | `accent3` → Indigo foncé (`#250F6B`) |
| **Remplissage** | `accent3` → Indigo foncé (`#250F6B`) |
| **Forme** | Rectangle |
| **Texte par défaut** | "CHAPTER 1 – CHAPTER 2 – CHAPTER 3 " |

---

## LAYOUT 10 : Agenda - 1 to 6 chapters

### Arrière-plan
Hérite du masque (blanc)

### Éléments (19 visibles)

#### Text Placeholder 4

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 1.18 cm |
| **Position Y** | 3.73 cm |
| **Largeur** | 3.69 cm |
| **Hauteur** | 2.02 cm |
| **Police** | Tempus Sans ITC |
| **Taille police** | 22.0 pt |
| **Couleur texte** | `tx1` → Noir (`#000000`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle |
| **Texte par défaut** | "01" |

#### Text Placeholder 8

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 5.61 cm |
| **Position Y** | 3.73 cm |
| **Largeur** | 21.7 cm |
| **Hauteur** | 2.02 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 22.0 pt |
| **Couleur texte** | `tx1` → Noir (`#000000`) |
| **Remplissage** | `tx1` → Noir (`#000000`) |
| **Forme** | Rectangle |
| **Texte par défaut** | "Chapter 1" |

#### Text Placeholder 8

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 27.95 cm |
| **Position Y** | 3.73 cm |
| **Largeur** | 4.72 cm |
| **Hauteur** | 2.02 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 10.0 pt |
| **Couleur texte** | `tx1` → Noir (`#000000`) |
| **Remplissage** | `tx1` → Noir (`#000000`) |
| **Forme** | Rectangle |
| **Texte par défaut** | "Page x" |

#### Text Placeholder 4

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 1.18 cm |
| **Position Y** | 6.04 cm |
| **Largeur** | 3.69 cm |
| **Hauteur** | 2.02 cm |
| **Police** | Tempus Sans ITC |
| **Taille police** | 22.0 pt |
| **Couleur texte** | `tx1` → Noir (`#000000`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle |
| **Texte par défaut** | "02" |

#### Text Placeholder 8

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 5.61 cm |
| **Position Y** | 6.04 cm |
| **Largeur** | 21.7 cm |
| **Hauteur** | 2.02 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 22.0 pt |
| **Couleur texte** | `tx1` → Noir (`#000000`) |
| **Remplissage** | `tx1` → Noir (`#000000`) |
| **Forme** | Rectangle |
| **Texte par défaut** | "Chapter 2" |

#### Text Placeholder 8

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 27.95 cm |
| **Position Y** | 6.04 cm |
| **Largeur** | 4.72 cm |
| **Hauteur** | 2.02 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 10.0 pt |
| **Couleur texte** | `tx1` → Noir (`#000000`) |
| **Remplissage** | `tx1` → Noir (`#000000`) |
| **Forme** | Rectangle |
| **Texte par défaut** | "Page x" |

#### Text Placeholder 4

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 1.18 cm |
| **Position Y** | 8.36 cm |
| **Largeur** | 3.69 cm |
| **Hauteur** | 2.02 cm |
| **Police** | Tempus Sans ITC |
| **Taille police** | 22.0 pt |
| **Couleur texte** | `tx1` → Noir (`#000000`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle |
| **Texte par défaut** | "03" |

#### Text Placeholder 8

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 5.61 cm |
| **Position Y** | 8.36 cm |
| **Largeur** | 21.7 cm |
| **Hauteur** | 2.02 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 22.0 pt |
| **Couleur texte** | `tx1` → Noir (`#000000`) |
| **Remplissage** | `tx1` → Noir (`#000000`) |
| **Forme** | Rectangle |
| **Texte par défaut** | "Chapter 3" |

#### Text Placeholder 8

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 27.95 cm |
| **Position Y** | 8.36 cm |
| **Largeur** | 4.72 cm |
| **Hauteur** | 2.02 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 10.0 pt |
| **Couleur texte** | `tx1` → Noir (`#000000`) |
| **Remplissage** | `tx1` → Noir (`#000000`) |
| **Forme** | Rectangle |
| **Texte par défaut** | "Page x" |

#### Text Placeholder 4

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 1.18 cm |
| **Position Y** | 10.67 cm |
| **Largeur** | 3.69 cm |
| **Hauteur** | 2.02 cm |
| **Police** | Tempus Sans ITC |
| **Taille police** | 22.0 pt |
| **Couleur texte** | `tx1` → Noir (`#000000`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle |
| **Texte par défaut** | "04" |

#### Text Placeholder 8

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 5.61 cm |
| **Position Y** | 10.67 cm |
| **Largeur** | 21.7 cm |
| **Hauteur** | 2.02 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 22.0 pt |
| **Couleur texte** | `tx1` → Noir (`#000000`) |
| **Remplissage** | `tx1` → Noir (`#000000`) |
| **Forme** | Rectangle |
| **Texte par défaut** | "Chapter 4" |

#### Text Placeholder 8

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 27.95 cm |
| **Position Y** | 10.67 cm |
| **Largeur** | 4.72 cm |
| **Hauteur** | 2.02 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 10.0 pt |
| **Couleur texte** | `tx1` → Noir (`#000000`) |
| **Remplissage** | `tx1` → Noir (`#000000`) |
| **Forme** | Rectangle |
| **Texte par défaut** | "Page x" |

#### Text Placeholder 4

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 1.18 cm |
| **Position Y** | 12.99 cm |
| **Largeur** | 3.69 cm |
| **Hauteur** | 2.02 cm |
| **Police** | Tempus Sans ITC |
| **Taille police** | 22.0 pt |
| **Couleur texte** | `tx1` → Noir (`#000000`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle |
| **Texte par défaut** | "05" |

#### Text Placeholder 8

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 5.61 cm |
| **Position Y** | 12.99 cm |
| **Largeur** | 21.7 cm |
| **Hauteur** | 2.02 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 22.0 pt |
| **Couleur texte** | `tx1` → Noir (`#000000`) |
| **Remplissage** | `tx1` → Noir (`#000000`) |
| **Forme** | Rectangle |
| **Texte par défaut** | "Chapter 5" |

#### Text Placeholder 8

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 27.95 cm |
| **Position Y** | 12.99 cm |
| **Largeur** | 4.72 cm |
| **Hauteur** | 2.02 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 10.0 pt |
| **Couleur texte** | `tx1` → Noir (`#000000`) |
| **Remplissage** | `tx1` → Noir (`#000000`) |
| **Forme** | Rectangle |
| **Texte par défaut** | "Page x" |

#### Text Placeholder 4

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 1.18 cm |
| **Position Y** | 15.31 cm |
| **Largeur** | 3.69 cm |
| **Hauteur** | 2.02 cm |
| **Police** | Tempus Sans ITC |
| **Taille police** | 22.0 pt |
| **Couleur texte** | `tx1` → Noir (`#000000`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle |
| **Texte par défaut** | "06" |

#### Text Placeholder 8

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 5.61 cm |
| **Position Y** | 15.31 cm |
| **Largeur** | 21.7 cm |
| **Hauteur** | 2.02 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 22.0 pt |
| **Couleur texte** | `tx1` → Noir (`#000000`) |
| **Remplissage** | `tx1` → Noir (`#000000`) |
| **Forme** | Rectangle |
| **Texte par défaut** | "Chapter 6" |

#### Text Placeholder 8

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 27.95 cm |
| **Position Y** | 15.31 cm |
| **Largeur** | 4.72 cm |
| **Hauteur** | 2.02 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 10.0 pt |
| **Couleur texte** | `tx1` → Noir (`#000000`) |
| **Remplissage** | `tx1` → Noir (`#000000`) |
| **Forme** | Rectangle |
| **Texte par défaut** | "Page x" |

#### Title 1

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder titre |
| **Taille police** | 24.0 pt |
| **Texte par défaut** | "AGENDA" |

---

## LAYOUT 11 : Agenda - 1 to 10 chapters

### Arrière-plan
Hérite du masque (blanc)

### Éléments (31 visibles)

#### Text Placeholder 4

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 1.18 cm |
| **Position Y** | 3.73 cm |
| **Largeur** | 3.69 cm |
| **Hauteur** | 1.09 cm |
| **Police** | Tempus Sans ITC |
| **Taille police** | 20.0 pt |
| **Couleur texte** | `tx1` → Noir (`#000000`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle |
| **Texte par défaut** | "01" |

#### Text Placeholder 8

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 5.61 cm |
| **Position Y** | 3.73 cm |
| **Largeur** | 22.12 cm |
| **Hauteur** | 1.09 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 20.0 pt |
| **Couleur texte** | `tx1` → Noir (`#000000`) |
| **Remplissage** | `tx1` → Noir (`#000000`) |
| **Forme** | Rectangle |
| **Texte par défaut** | "Chapter 1" |

#### Text Placeholder 8

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 28.37 cm |
| **Position Y** | 3.73 cm |
| **Largeur** | 4.3 cm |
| **Hauteur** | 1.09 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 10.0 pt |
| **Couleur texte** | `tx1` → Noir (`#000000`) |
| **Remplissage** | `tx1` → Noir (`#000000`) |
| **Forme** | Rectangle |
| **Texte par défaut** | "Page x" |

#### Text Placeholder 4

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 1.18 cm |
| **Position Y** | 5.12 cm |
| **Largeur** | 3.69 cm |
| **Hauteur** | 1.09 cm |
| **Police** | Tempus Sans ITC |
| **Taille police** | 20.0 pt |
| **Couleur texte** | `tx1` → Noir (`#000000`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle |
| **Texte par défaut** | "02" |

#### Text Placeholder 8

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 5.61 cm |
| **Position Y** | 5.12 cm |
| **Largeur** | 22.12 cm |
| **Hauteur** | 1.09 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 20.0 pt |
| **Couleur texte** | `tx1` → Noir (`#000000`) |
| **Remplissage** | `tx1` → Noir (`#000000`) |
| **Forme** | Rectangle |
| **Texte par défaut** | "Chapter 2" |

#### Text Placeholder 8

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 28.37 cm |
| **Position Y** | 5.12 cm |
| **Largeur** | 4.3 cm |
| **Hauteur** | 1.09 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 10.0 pt |
| **Couleur texte** | `tx1` → Noir (`#000000`) |
| **Remplissage** | `tx1` → Noir (`#000000`) |
| **Forme** | Rectangle |
| **Texte par défaut** | "Page x" |

#### Text Placeholder 4

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 1.18 cm |
| **Position Y** | 6.51 cm |
| **Largeur** | 3.69 cm |
| **Hauteur** | 1.09 cm |
| **Police** | Tempus Sans ITC |
| **Taille police** | 20.0 pt |
| **Couleur texte** | `tx1` → Noir (`#000000`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle |
| **Texte par défaut** | "03" |

#### Text Placeholder 8

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 5.61 cm |
| **Position Y** | 6.51 cm |
| **Largeur** | 22.12 cm |
| **Hauteur** | 1.09 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 20.0 pt |
| **Couleur texte** | `tx1` → Noir (`#000000`) |
| **Remplissage** | `tx1` → Noir (`#000000`) |
| **Forme** | Rectangle |
| **Texte par défaut** | "Chapter 3" |

#### Text Placeholder 8

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 28.37 cm |
| **Position Y** | 6.51 cm |
| **Largeur** | 4.3 cm |
| **Hauteur** | 1.09 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 10.0 pt |
| **Couleur texte** | `tx1` → Noir (`#000000`) |
| **Remplissage** | `tx1` → Noir (`#000000`) |
| **Forme** | Rectangle |
| **Texte par défaut** | "Page x" |

#### Text Placeholder 4

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 1.18 cm |
| **Position Y** | 7.9 cm |
| **Largeur** | 3.69 cm |
| **Hauteur** | 1.09 cm |
| **Police** | Tempus Sans ITC |
| **Taille police** | 20.0 pt |
| **Couleur texte** | `tx1` → Noir (`#000000`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle |
| **Texte par défaut** | "04" |

#### Text Placeholder 8

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 5.61 cm |
| **Position Y** | 7.9 cm |
| **Largeur** | 22.12 cm |
| **Hauteur** | 1.09 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 20.0 pt |
| **Couleur texte** | `tx1` → Noir (`#000000`) |
| **Remplissage** | `tx1` → Noir (`#000000`) |
| **Forme** | Rectangle |
| **Texte par défaut** | "Chapter 4" |

#### Text Placeholder 8

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 28.37 cm |
| **Position Y** | 7.9 cm |
| **Largeur** | 4.3 cm |
| **Hauteur** | 1.09 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 10.0 pt |
| **Couleur texte** | `tx1` → Noir (`#000000`) |
| **Remplissage** | `tx1` → Noir (`#000000`) |
| **Forme** | Rectangle |
| **Texte par défaut** | "Page x" |

#### Text Placeholder 4

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 1.18 cm |
| **Position Y** | 9.29 cm |
| **Largeur** | 3.69 cm |
| **Hauteur** | 1.09 cm |
| **Police** | Tempus Sans ITC |
| **Taille police** | 20.0 pt |
| **Couleur texte** | `tx1` → Noir (`#000000`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle |
| **Texte par défaut** | "05" |

#### Text Placeholder 8

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 5.61 cm |
| **Position Y** | 9.29 cm |
| **Largeur** | 22.12 cm |
| **Hauteur** | 1.09 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 20.0 pt |
| **Couleur texte** | `tx1` → Noir (`#000000`) |
| **Remplissage** | `tx1` → Noir (`#000000`) |
| **Forme** | Rectangle |
| **Texte par défaut** | "Chapter 5" |

#### Text Placeholder 8

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 28.37 cm |
| **Position Y** | 9.29 cm |
| **Largeur** | 4.3 cm |
| **Hauteur** | 1.09 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 10.0 pt |
| **Couleur texte** | `tx1` → Noir (`#000000`) |
| **Remplissage** | `tx1` → Noir (`#000000`) |
| **Forme** | Rectangle |
| **Texte par défaut** | "Page x" |

#### Text Placeholder 4

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 1.18 cm |
| **Position Y** | 10.67 cm |
| **Largeur** | 3.69 cm |
| **Hauteur** | 1.09 cm |
| **Police** | Tempus Sans ITC |
| **Taille police** | 20.0 pt |
| **Couleur texte** | `tx1` → Noir (`#000000`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle |
| **Texte par défaut** | "06" |

#### Text Placeholder 8

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 5.61 cm |
| **Position Y** | 10.67 cm |
| **Largeur** | 22.12 cm |
| **Hauteur** | 1.09 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 20.0 pt |
| **Couleur texte** | `tx1` → Noir (`#000000`) |
| **Remplissage** | `tx1` → Noir (`#000000`) |
| **Forme** | Rectangle |
| **Texte par défaut** | "Chapter 6" |

#### Text Placeholder 8

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 28.37 cm |
| **Position Y** | 10.67 cm |
| **Largeur** | 4.3 cm |
| **Hauteur** | 1.09 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 10.0 pt |
| **Couleur texte** | `tx1` → Noir (`#000000`) |
| **Remplissage** | `tx1` → Noir (`#000000`) |
| **Forme** | Rectangle |
| **Texte par défaut** | "Page x" |

#### Text Placeholder 4

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 1.18 cm |
| **Position Y** | 12.06 cm |
| **Largeur** | 3.69 cm |
| **Hauteur** | 1.09 cm |
| **Police** | Tempus Sans ITC |
| **Taille police** | 20.0 pt |
| **Couleur texte** | `tx1` → Noir (`#000000`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle |
| **Texte par défaut** | "07" |

#### Text Placeholder 8

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 5.61 cm |
| **Position Y** | 12.06 cm |
| **Largeur** | 22.12 cm |
| **Hauteur** | 1.09 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 20.0 pt |
| **Couleur texte** | `tx1` → Noir (`#000000`) |
| **Remplissage** | `tx1` → Noir (`#000000`) |
| **Forme** | Rectangle |
| **Texte par défaut** | "Chapter 7" |

#### Text Placeholder 8

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 28.37 cm |
| **Position Y** | 12.06 cm |
| **Largeur** | 4.3 cm |
| **Hauteur** | 1.09 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 10.0 pt |
| **Couleur texte** | `tx1` → Noir (`#000000`) |
| **Remplissage** | `tx1` → Noir (`#000000`) |
| **Forme** | Rectangle |
| **Texte par défaut** | "Page x" |

#### Text Placeholder 4

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 1.18 cm |
| **Position Y** | 13.45 cm |
| **Largeur** | 3.69 cm |
| **Hauteur** | 1.09 cm |
| **Police** | Tempus Sans ITC |
| **Taille police** | 20.0 pt |
| **Couleur texte** | `tx1` → Noir (`#000000`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle |
| **Texte par défaut** | "08" |

#### Text Placeholder 8

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 5.61 cm |
| **Position Y** | 13.45 cm |
| **Largeur** | 22.12 cm |
| **Hauteur** | 1.09 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 20.0 pt |
| **Couleur texte** | `tx1` → Noir (`#000000`) |
| **Remplissage** | `tx1` → Noir (`#000000`) |
| **Forme** | Rectangle |
| **Texte par défaut** | "Chapter 8" |

#### Text Placeholder 8

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 28.37 cm |
| **Position Y** | 13.45 cm |
| **Largeur** | 4.3 cm |
| **Hauteur** | 1.09 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 10.0 pt |
| **Couleur texte** | `tx1` → Noir (`#000000`) |
| **Remplissage** | `tx1` → Noir (`#000000`) |
| **Forme** | Rectangle |
| **Texte par défaut** | "Page x" |

#### Text Placeholder 4

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 1.18 cm |
| **Position Y** | 14.84 cm |
| **Largeur** | 3.69 cm |
| **Hauteur** | 1.09 cm |
| **Police** | Tempus Sans ITC |
| **Taille police** | 20.0 pt |
| **Couleur texte** | `tx1` → Noir (`#000000`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle |
| **Texte par défaut** | "09" |

#### Text Placeholder 8

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 5.61 cm |
| **Position Y** | 14.84 cm |
| **Largeur** | 22.12 cm |
| **Hauteur** | 1.09 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 20.0 pt |
| **Couleur texte** | `tx1` → Noir (`#000000`) |
| **Remplissage** | `tx1` → Noir (`#000000`) |
| **Forme** | Rectangle |
| **Texte par défaut** | "Chapter 9" |

#### Text Placeholder 8

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 28.37 cm |
| **Position Y** | 14.84 cm |
| **Largeur** | 4.3 cm |
| **Hauteur** | 1.09 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 10.0 pt |
| **Couleur texte** | `tx1` → Noir (`#000000`) |
| **Remplissage** | `tx1` → Noir (`#000000`) |
| **Forme** | Rectangle |
| **Texte par défaut** | "Page x" |

#### Text Placeholder 4

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 1.18 cm |
| **Position Y** | 16.23 cm |
| **Largeur** | 3.69 cm |
| **Hauteur** | 1.09 cm |
| **Police** | Tempus Sans ITC |
| **Taille police** | 20.0 pt |
| **Couleur texte** | `tx1` → Noir (`#000000`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle |
| **Texte par défaut** | "10" |

#### Text Placeholder 8

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 5.61 cm |
| **Position Y** | 16.23 cm |
| **Largeur** | 22.12 cm |
| **Hauteur** | 1.09 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 20.0 pt |
| **Couleur texte** | `tx1` → Noir (`#000000`) |
| **Remplissage** | `tx1` → Noir (`#000000`) |
| **Forme** | Rectangle |
| **Texte par défaut** | "Chapter 10" |

#### Text Placeholder 8

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 28.37 cm |
| **Position Y** | 16.23 cm |
| **Largeur** | 4.3 cm |
| **Hauteur** | 1.09 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 10.0 pt |
| **Couleur texte** | `tx1` → Noir (`#000000`) |
| **Remplissage** | `tx1` → Noir (`#000000`) |
| **Forme** | Rectangle |
| **Texte par défaut** | "Page x" |

#### Title 1

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder titre |
| **Position X** | 1.18 cm |
| **Position Y** | 1.12 cm |
| **Largeur** | 31.51 cm |
| **Hauteur** | 2.6 cm |
| **Taille police** | 24.0 pt |
| **Texte par défaut** | "AGENDA" |

---

## LAYOUT 12 : Chapter gradient blue

### Arrière-plan
Hérite du masque (blanc)

### Éléments (5 visibles)

#### Text Placeholder 1

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 1.18 cm |
| **Position Y** | 3.75 cm |
| **Largeur** | 15.12 cm |
| **Hauteur** | 3.39 cm |
| **Police** | Tempus Sans ITC |
| **Taille police** | 88.0 pt |
| **Couleur texte** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle |
| **Texte par défaut** | "1." |

#### Freeform: Shape 2

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 18.34 cm |
| **Position Y** | 0.0 cm |
| **Largeur** | 15.53 cm |
| **Hauteur** | 19.05 cm |
| **Police** | East Asian (majeure) |
| **Remplissage** | Aucun |
| **Alignement** | Centré |

#### Graphic 2

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Largeur** | 3.32 cm |
| **Hauteur** | 19.21 cm |
| **Remplissage** | Aucun |

#### Graphic 1

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Largeur** | 4.14 cm |
| **Hauteur** | 19.26 cm |
| **Remplissage** | Aucun |

#### Title 1

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder titre |
| **Position X** | 1.18 cm |
| **Position Y** | 7.14 cm |
| **Largeur** | 15.12 cm |
| **Hauteur** | 3.39 cm |
| **Police** | Aptos (mineure) |
| **Taille police** | 36.0 pt |
| **Texte par défaut** | "Chapter divider" |

---

## LAYOUT 13 : Chapter vibrant blue

### Arrière-plan
Hérite du masque (blanc)

### Éléments (5 visibles)

#### Text Placeholder 1

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 1.18 cm |
| **Position Y** | 3.75 cm |
| **Largeur** | 15.12 cm |
| **Hauteur** | 3.39 cm |
| **Police** | Tempus Sans ITC |
| **Taille police** | 88.0 pt |
| **Couleur texte** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle |
| **Texte par défaut** | "1." |

#### Freeform: Shape 2

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 18.34 cm |
| **Position Y** | 0.0 cm |
| **Largeur** | 15.53 cm |
| **Hauteur** | 19.05 cm |
| **Police** | East Asian (majeure) |
| **Remplissage** | Aucun |
| **Alignement** | Centré |

#### Graphic 2

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Largeur** | 3.32 cm |
| **Hauteur** | 19.21 cm |
| **Remplissage** | Aucun |

#### Graphic 1

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Largeur** | 4.14 cm |
| **Hauteur** | 19.26 cm |
| **Remplissage** | Aucun |

#### Title 1

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder titre |
| **Position X** | 1.18 cm |
| **Position Y** | 7.14 cm |
| **Largeur** | 15.12 cm |
| **Hauteur** | 3.39 cm |
| **Police** | Aptos (mineure) |
| **Taille police** | 36.0 pt |
| **Texte par défaut** | "Chapter divider" |

---

## LAYOUT 14 : Chapter deep blue

### Arrière-plan
Hérite du masque (blanc)

### Éléments (5 visibles)

#### Text Placeholder 1

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 1.18 cm |
| **Position Y** | 3.75 cm |
| **Largeur** | 15.12 cm |
| **Hauteur** | 3.39 cm |
| **Police** | Tempus Sans ITC |
| **Taille police** | 88.0 pt |
| **Couleur texte** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle |
| **Texte par défaut** | "1." |

#### Freeform: Shape 3

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 18.34 cm |
| **Position Y** | 0.0 cm |
| **Largeur** | 15.53 cm |
| **Hauteur** | 19.05 cm |
| **Police** | East Asian (majeure) |
| **Remplissage** | Aucun |
| **Alignement** | Centré |

#### Graphic 2

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Largeur** | 3.32 cm |
| **Hauteur** | 19.21 cm |
| **Remplissage** | Aucun |

#### Graphic 1

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Largeur** | 4.14 cm |
| **Hauteur** | 19.26 cm |
| **Remplissage** | Aucun |

#### Title 1

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder titre |
| **Position X** | 1.18 cm |
| **Position Y** | 7.14 cm |
| **Largeur** | 15.12 cm |
| **Hauteur** | 3.39 cm |
| **Police** | Aptos (mineure) |
| **Taille police** | 36.0 pt |
| **Texte par défaut** | "Chapter divider" |

---

## LAYOUT 15 : Chapter white with picture

### Arrière-plan
Hérite du masque (blanc)

### Éléments (5 visibles)

#### Text Placeholder 1

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 1.18 cm |
| **Position Y** | 3.74 cm |
| **Largeur** | 15.12 cm |
| **Hauteur** | 3.39 cm |
| **Police** | Tempus Sans ITC |
| **Taille police** | 88.0 pt |
| **Couleur texte** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle |
| **Texte par défaut** | "1." |

#### Picture placeholder

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder image |
| **Position X** | 21.12 cm |
| **Position Y** | 0.0 cm |
| **Largeur** | 12.75 cm |
| **Hauteur** | 19.05 cm |
| **Texte par défaut** | "Insert image" |

#### Graphic 2

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 0.0 cm |
| **Position Y** | 4.77 cm |
| **Largeur** | 33.87 cm |
| **Hauteur** | 6.06 cm |
| **Remplissage** | Aucun |

#### Graphic 1

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 11.04 cm |
| **Position Y** | 7.99 cm |
| **Largeur** | 22.83 cm |
| **Hauteur** | 6.3 cm |
| **Remplissage** | Aucun |

#### Title 1

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder titre |
| **Position X** | 1.18 cm |
| **Position Y** | 7.14 cm |
| **Largeur** | 15.12 cm |
| **Hauteur** | 3.39 cm |
| **Police** | Aptos (mineure) |
| **Taille police** | 36.0 pt |
| **Texte par défaut** | "Chapter divider" |

---

## LAYOUT 16 : Quote with picture left

### Arrière-plan
Dégradé personnalisé

### Éléments (4 visibles)

#### Graphic 2

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 0.0 cm |
| **Position Y** | 4.77 cm |
| **Largeur** | 33.87 cm |
| **Hauteur** | 6.06 cm |
| **Remplissage** | Aucun |

#### Graphic 1

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 11.04 cm |
| **Position Y** | 7.99 cm |
| **Largeur** | 22.83 cm |
| **Hauteur** | 6.3 cm |
| **Remplissage** | Aucun |

#### Text Placeholder 1

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 14.66 cm |
| **Position Y** | 3.8 cm |
| **Largeur** | 18.03 cm |
| **Hauteur** | 11.68 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 28.0 pt |
| **Couleur texte** | `bg1` → Blanc (`#FFFFFF`) |
| **Remplissage** | `bg1` → Blanc (`#FFFFFF`) |
| **Texte par défaut** | "“Insert a quote here.”" |

#### Picture Placeholder 1

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder image |
| **Position X** | 0.0 cm |
| **Position Y** | 0.0 cm |
| **Largeur** | 12.84 cm |
| **Hauteur** | 19.05 cm |
| **Couleur texte** | `bg1` → Blanc (`#FFFFFF`) |
| **Remplissage** | `bg1` → Blanc (`#FFFFFF`) |
| **Texte par défaut** | "Insert image" |

---

## LAYOUT 17 : Quote with people picture

### Arrière-plan
Dégradé personnalisé

### Éléments (4 visibles)

#### Graphic 2

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 0.0 cm |
| **Position Y** | 4.77 cm |
| **Largeur** | 33.87 cm |
| **Hauteur** | 6.06 cm |
| **Remplissage** | Aucun |

#### Graphic 1

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 11.04 cm |
| **Position Y** | 7.99 cm |
| **Largeur** | 22.83 cm |
| **Hauteur** | 6.3 cm |
| **Remplissage** | Aucun |

#### Text Placeholder 1

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 1.18 cm |
| **Position Y** | 6.87 cm |
| **Largeur** | 31.51 cm |
| **Hauteur** | 6.91 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 28.0 pt |
| **Couleur texte** | `bg1` → Blanc (`#FFFFFF`) |
| **Remplissage** | `bg1` → Blanc (`#FFFFFF`) |
| **Texte par défaut** | "“Insert a quote here.”" |

#### Picture Placeholder 1

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder image |
| **Position X** | 14.9 cm |
| **Position Y** | 2.06 cm |
| **Largeur** | 4.07 cm |
| **Hauteur** | 4.07 cm |
| **Couleur texte** | `bg1` → Blanc (`#FFFFFF`) |
| **Remplissage** | `bg1` → Blanc (`#FFFFFF`) |
| **Forme** | Ellipse |
| **Texte par défaut** | "Insert image" |

---

## LAYOUT 18 : Blank page

### Arrière-plan
Hérite du masque (blanc)
---

## LAYOUT 19 : Contacts white

### Arrière-plan
Hérite du masque (blanc)

### Éléments (15 visibles)

#### Reserved text space 20

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 9.74 cm |
| **Position Y** | 7.03 cm |
| **Largeur** | 8.89 cm |
| **Hauteur** | 0.6 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 12.0 pt |
| **Texte par défaut** | "First Name LAST NAME" |

#### Reserved text space 32

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 9.74 cm |
| **Position Y** | 7.64 cm |
| **Largeur** | 8.89 cm |
| **Hauteur** | 0.6 cm |
| **Taille police** | 12.0 pt |
| **Texte par défaut** | "Level (Partner…)" |

#### Reserved text space 20

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 21.68 cm |
| **Position Y** | 7.03 cm |
| **Largeur** | 11.01 cm |
| **Hauteur** | 0.6 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 12.0 pt |
| **Couleur texte** | `tx1` → Noir (`#000000`) |
| **Remplissage** | `tx1` → Noir (`#000000`) |
| **Alignement** | Droite |
| **Texte par défaut** | "M 	+33 (0)6 00 00 00 00" |

#### Reserved text space 20

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 21.68 cm |
| **Position Y** | 7.64 cm |
| **Largeur** | 11.01 cm |
| **Hauteur** | 0.63 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 12.0 pt |
| **Couleur texte** | `tx1` → Noir (`#000000`) |
| **Remplissage** | `tx1` → Noir (`#000000`) |
| **Alignement** | Droite |
| **Texte par défaut** | "firstname.lastname@wavestone.com" |

#### Reserved text space 20

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 9.74 cm |
| **Position Y** | 8.92 cm |
| **Largeur** | 8.89 cm |
| **Hauteur** | 0.6 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 12.0 pt |
| **Texte par défaut** | "First Name LAST NAME" |

#### Reserved text space 32

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 9.74 cm |
| **Position Y** | 9.53 cm |
| **Largeur** | 8.89 cm |
| **Hauteur** | 0.6 cm |
| **Taille police** | 12.0 pt |
| **Texte par défaut** | "Level (Partner…)" |

#### Reserved text space 20

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 21.68 cm |
| **Position Y** | 8.92 cm |
| **Largeur** | 11.01 cm |
| **Hauteur** | 0.6 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 12.0 pt |
| **Couleur texte** | `tx1` → Noir (`#000000`) |
| **Remplissage** | `tx1` → Noir (`#000000`) |
| **Alignement** | Droite |
| **Texte par défaut** | "M 	+33 (0)6 00 00 00 00" |

#### Reserved text space 20

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 21.68 cm |
| **Position Y** | 9.53 cm |
| **Largeur** | 11.01 cm |
| **Hauteur** | 0.63 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 12.0 pt |
| **Couleur texte** | `tx1` → Noir (`#000000`) |
| **Remplissage** | `tx1` → Noir (`#000000`) |
| **Alignement** | Droite |
| **Texte par défaut** | "firstname.lastname@wavestone.com" |

#### Reserved text space 20

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 9.74 cm |
| **Position Y** | 10.82 cm |
| **Largeur** | 8.89 cm |
| **Hauteur** | 0.6 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 12.0 pt |
| **Texte par défaut** | "First Name LAST NAME" |

#### Reserved text space32

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 9.74 cm |
| **Position Y** | 11.42 cm |
| **Largeur** | 8.89 cm |
| **Hauteur** | 0.6 cm |
| **Taille police** | 12.0 pt |
| **Texte par défaut** | "Level (Partner…)" |

#### Reserved text space 20

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 21.68 cm |
| **Position Y** | 10.82 cm |
| **Largeur** | 11.01 cm |
| **Hauteur** | 0.6 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 12.0 pt |
| **Couleur texte** | `tx1` → Noir (`#000000`) |
| **Remplissage** | `tx1` → Noir (`#000000`) |
| **Alignement** | Droite |
| **Texte par défaut** | "M 	+33 (0)6 00 00 00 00" |

#### Reserved text space 20

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 21.68 cm |
| **Position Y** | 11.42 cm |
| **Largeur** | 11.01 cm |
| **Hauteur** | 0.63 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 12.0 pt |
| **Couleur texte** | `tx1` → Noir (`#000000`) |
| **Remplissage** | `tx1` → Noir (`#000000`) |
| **Alignement** | Droite |
| **Texte par défaut** | "firstname.lastname@wavestone.com" |

#### TextBox 1

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 26.98 cm |
| **Position Y** | 15.12 cm |
| **Largeur** | 5.7 cm |
| **Hauteur** | 1.3 cm |
| **Police** | Arial |
| **Taille police** | 11.0 pt |
| **Couleur texte** | `tx1` → Noir (`#000000`) |
| **Remplissage** | `bg1` → Blanc (`#FFFFFF`) |
| **Forme** | Rectangle |
| **Alignement** | Droite |
| **Texte par défaut** | "Wavestone.com  " |

#### White Wavestone logo

| Propriété | Valeur |
|-----------|--------|
| **Type** | Image |
| **Position X** | 25.71 cm |
| **Position Y** | 0.72 cm |
| **Largeur** | 7.62 cm |
| **Hauteur** | 1.9 cm |

#### Wavestone logo

| Propriété | Valeur |
|-----------|--------|
| **Type** | Image |
| **Position X** | 25.71 cm |
| **Position Y** | 0.72 cm |
| **Largeur** | 7.62 cm |
| **Hauteur** | 1.9 cm |

---

## LAYOUT 20 : Contacts blue

### Arrière-plan
Dégradé personnalisé

### Éléments (15 visibles)

#### Reserved text space 20

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 9.74 cm |
| **Position Y** | 7.03 cm |
| **Largeur** | 8.89 cm |
| **Hauteur** | 0.6 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 12.0 pt |
| **Couleur texte** | `bg1` → Blanc (`#FFFFFF`) |
| **Remplissage** | `bg1` → Blanc (`#FFFFFF`) |
| **Texte par défaut** | "First Name LAST NAME" |

#### Reserved text space 32

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 9.74 cm |
| **Position Y** | 7.64 cm |
| **Largeur** | 8.89 cm |
| **Hauteur** | 0.6 cm |
| **Taille police** | 12.0 pt |
| **Couleur texte** | `bg1` → Blanc (`#FFFFFF`) |
| **Remplissage** | `bg1` → Blanc (`#FFFFFF`) |
| **Texte par défaut** | "Level (Partner…)" |

#### Reserved text space 20

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 21.68 cm |
| **Position Y** | 7.03 cm |
| **Largeur** | 11.01 cm |
| **Hauteur** | 0.6 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 12.0 pt |
| **Couleur texte** | `bg1` → Blanc (`#FFFFFF`) |
| **Remplissage** | `bg1` → Blanc (`#FFFFFF`) |
| **Texte par défaut** | "M +33 (0)6 00 00 00 00" |

#### Reserved text space 20

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 21.68 cm |
| **Position Y** | 7.64 cm |
| **Largeur** | 11.01 cm |
| **Hauteur** | 0.6 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 12.0 pt |
| **Couleur texte** | `bg1` → Blanc (`#FFFFFF`) |
| **Remplissage** | `bg1` → Blanc (`#FFFFFF`) |
| **Texte par défaut** | "firstname.lastname@wavestone.com" |

#### Reserved text space 20

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 9.74 cm |
| **Position Y** | 8.9 cm |
| **Largeur** | 8.89 cm |
| **Hauteur** | 0.6 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 12.0 pt |
| **Couleur texte** | `bg1` → Blanc (`#FFFFFF`) |
| **Remplissage** | `bg1` → Blanc (`#FFFFFF`) |
| **Texte par défaut** | "First Name LAST NAME" |

#### Reserved text space 32

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 9.74 cm |
| **Position Y** | 9.51 cm |
| **Largeur** | 8.89 cm |
| **Hauteur** | 0.6 cm |
| **Taille police** | 12.0 pt |
| **Couleur texte** | `bg1` → Blanc (`#FFFFFF`) |
| **Remplissage** | `bg1` → Blanc (`#FFFFFF`) |
| **Texte par défaut** | "Level (Partner…)" |

#### Reserved text space 20

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 21.68 cm |
| **Position Y** | 8.9 cm |
| **Largeur** | 11.01 cm |
| **Hauteur** | 0.6 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 12.0 pt |
| **Couleur texte** | `bg1` → Blanc (`#FFFFFF`) |
| **Remplissage** | `bg1` → Blanc (`#FFFFFF`) |
| **Texte par défaut** | "M +33 (0)6 00 00 00 00" |

#### Reserved text space 20

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 21.68 cm |
| **Position Y** | 9.51 cm |
| **Largeur** | 11.01 cm |
| **Hauteur** | 0.6 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 12.0 pt |
| **Couleur texte** | `bg1` → Blanc (`#FFFFFF`) |
| **Remplissage** | `bg1` → Blanc (`#FFFFFF`) |
| **Texte par défaut** | "firstname.lastname@wavestone.com" |

#### Reserved text space 20

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 9.74 cm |
| **Position Y** | 10.82 cm |
| **Largeur** | 8.89 cm |
| **Hauteur** | 0.6 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 12.0 pt |
| **Couleur texte** | `bg1` → Blanc (`#FFFFFF`) |
| **Remplissage** | `bg1` → Blanc (`#FFFFFF`) |
| **Texte par défaut** | "First Name LAST NAME" |

#### Reserved text space 32

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 9.74 cm |
| **Position Y** | 11.43 cm |
| **Largeur** | 8.89 cm |
| **Hauteur** | 0.6 cm |
| **Taille police** | 12.0 pt |
| **Couleur texte** | `bg1` → Blanc (`#FFFFFF`) |
| **Remplissage** | `bg1` → Blanc (`#FFFFFF`) |
| **Texte par défaut** | "Level (Partner…)" |

#### Reserved text space 20

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 21.68 cm |
| **Position Y** | 10.82 cm |
| **Largeur** | 11.01 cm |
| **Hauteur** | 0.6 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 12.0 pt |
| **Couleur texte** | `bg1` → Blanc (`#FFFFFF`) |
| **Remplissage** | `bg1` → Blanc (`#FFFFFF`) |
| **Texte par défaut** | "M +33 (0)6 00 00 00 00" |

#### Reserved text space 20

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 21.68 cm |
| **Position Y** | 11.43 cm |
| **Largeur** | 11.01 cm |
| **Hauteur** | 0.6 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 12.0 pt |
| **Couleur texte** | `bg1` → Blanc (`#FFFFFF`) |
| **Remplissage** | `bg1` → Blanc (`#FFFFFF`) |
| **Texte par défaut** | "firstname.lastname@wavestone.com" |

#### TextBox 1

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 26.98 cm |
| **Position Y** | 15.12 cm |
| **Largeur** | 5.7 cm |
| **Hauteur** | 1.3 cm |
| **Police** | Arial |
| **Taille police** | 11.0 pt |
| **Couleur texte** | `bg1` → Blanc (`#FFFFFF`) |
| **Remplissage** | `bg1` → Blanc (`#FFFFFF`) |
| **Forme** | Rectangle |
| **Alignement** | Droite |
| **Texte par défaut** | "Wavestone.com  " |

#### Wavestone logo

| Propriété | Valeur |
|-----------|--------|
| **Type** | Image |
| **Position X** | 25.71 cm |
| **Position Y** | 0.72 cm |
| **Largeur** | 7.62 cm |
| **Hauteur** | 1.9 cm |

#### White Wavestone logo

| Propriété | Valeur |
|-----------|--------|
| **Type** | Image |
| **Position X** | 25.71 cm |
| **Position Y** | 0.72 cm |
| **Largeur** | 7.62 cm |
| **Hauteur** | 1.9 cm |

---

## LAYOUT 21 : End page white

### Arrière-plan
Hérite du masque (blanc)

### Éléments (4 visibles)

#### Graphic 2

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 0.0 cm |
| **Position Y** | 4.77 cm |
| **Largeur** | 33.87 cm |
| **Hauteur** | 6.06 cm |
| **Remplissage** | Aucun |

#### Graphic 1

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 11.04 cm |
| **Position Y** | 7.99 cm |
| **Largeur** | 22.83 cm |
| **Hauteur** | 6.3 cm |
| **Remplissage** | Aucun |

#### Wavestone logo

| Propriété | Valeur |
|-----------|--------|
| **Type** | Image |
| **Position X** | 13.12 cm |
| **Position Y** | 6.87 cm |
| **Largeur** | 7.61 cm |
| **Hauteur** | 5.31 cm |

#### Wavestone logo

| Propriété | Valeur |
|-----------|--------|
| **Type** | Image |
| **Position X** | 13.12 cm |
| **Position Y** | 6.87 cm |
| **Largeur** | 7.61 cm |
| **Hauteur** | 5.31 cm |

---

## LAYOUT 22 : End page blue

### Arrière-plan
Dégradé personnalisé

### Éléments (4 visibles)

#### Graphic 2

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 0.0 cm |
| **Position Y** | 4.77 cm |
| **Largeur** | 33.87 cm |
| **Hauteur** | 6.06 cm |
| **Remplissage** | Aucun |

#### Graphic 1

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 11.04 cm |
| **Position Y** | 7.99 cm |
| **Largeur** | 22.83 cm |
| **Hauteur** | 6.3 cm |
| **Remplissage** | Aucun |

#### Wavestone logo

| Propriété | Valeur |
|-----------|--------|
| **Type** | Image |
| **Position X** | 13.12 cm |
| **Position Y** | 6.87 cm |
| **Largeur** | 7.61 cm |
| **Hauteur** | 5.31 cm |

#### Wavestone logo

| Propriété | Valeur |
|-----------|--------|
| **Type** | Image |
| **Position X** | 13.12 cm |
| **Position Y** | 6.87 cm |
| **Largeur** | 7.61 cm |
| **Hauteur** | 5.31 cm |

---

## LAYOUT 23 : SP TOC

### Arrière-plan
Hérite du masque (blanc)

### Éléments (13 visibles)

#### Rectangle 51

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 0.97 cm |
| **Position Y** | 3.32 cm |
| **Largeur** | 2.2 cm |
| **Hauteur** | 1.53 cm |
| **Police** | Arial |
| **Taille police** | 16.0 pt |
| **Couleur texte** | `accent1` → Vert vif (`#04F06A`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle |
| **Alignement** | Justifié |
| **Texte par défaut** | "&lt;N&gt;" |

#### Rectangle 52

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 2.47 cm |
| **Position Y** | 3.32 cm |
| **Largeur** | 12.5 cm |
| **Hauteur** | 1.53 cm |
| **Police** | Tempus Sans ITC |
| **Taille police** | 16.0 pt |
| **Couleur texte** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle |
| **Alignement** | Justifié |
| **Texte par défaut** | "&lt;TEXT&gt;" |

#### Rectangle 53

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 16.69 cm |
| **Position Y** | 3.32 cm |
| **Largeur** | 1.43 cm |
| **Hauteur** | 1.53 cm |
| **Police** | Tempus Sans ITC |
| **Taille police** | 9.2 pt |
| **Couleur texte** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle |
| **Alignement** | Justifié |
| **Texte par défaut** | "Page &lt;P&gt;" |

#### Rectangle 55

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 0.97 cm |
| **Position Y** | 3.32 cm |
| **Largeur** | 2.2 cm |
| **Hauteur** | 1.53 cm |
| **Police** | Arial |
| **Taille police** | 16.0 pt |
| **Couleur texte** | `accent1` → Vert vif (`#04F06A`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle |
| **Alignement** | Justifié |
| **Texte par défaut** | "&lt;N&gt;" |

#### Rectangle 56

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 2.48 cm |
| **Position Y** | 3.32 cm |
| **Largeur** | 12.5 cm |
| **Hauteur** | 1.53 cm |
| **Police** | Tempus Sans ITC |
| **Taille police** | 16.0 pt |
| **Couleur texte** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle |
| **Alignement** | Justifié |
| **Texte par défaut** | "&lt;TEXT&gt;" |

#### Rectangle 57

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 16.69 cm |
| **Position Y** | 3.32 cm |
| **Largeur** | 1.43 cm |
| **Hauteur** | 1.53 cm |
| **Police** | Tempus Sans ITC |
| **Taille police** | 9.2 pt |
| **Couleur texte** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle |
| **Alignement** | Justifié |
| **Texte par défaut** | "Page &lt;P&gt;" |

#### Rectangle 59

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 0.97 cm |
| **Position Y** | 3.32 cm |
| **Largeur** | 2.2 cm |
| **Hauteur** | 1.53 cm |
| **Police** | Arial |
| **Taille police** | 14.0 pt |
| **Couleur texte** | `accent1` → Vert vif (`#04F06A`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle |
| **Alignement** | Justifié |
| **Texte par défaut** | "&lt;N&gt;" |

#### Rectangle 60

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 1.9 cm |
| **Position Y** | 3.32 cm |
| **Largeur** | 12.5 cm |
| **Hauteur** | 1.53 cm |
| **Police** | Tempus Sans ITC |
| **Taille police** | 14.0 pt |
| **Couleur texte** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle |
| **Alignement** | Justifié |
| **Texte par défaut** | "&lt;TEXT&gt;" |

#### Rectangle 61

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 14.85 cm |
| **Position Y** | 3.32 cm |
| **Largeur** | 1.43 cm |
| **Hauteur** | 1.53 cm |
| **Police** | Tempus Sans ITC |
| **Taille police** | 9.2 pt |
| **Couleur texte** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle |
| **Alignement** | Justifié |
| **Texte par défaut** | "Page &lt;P&gt;" |

#### Rectangle 63

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 2.07 cm |
| **Position Y** | 3.32 cm |
| **Largeur** | 2.2 cm |
| **Hauteur** | 1.53 cm |
| **Police** | Arial |
| **Taille police** | 14.0 pt |
| **Couleur texte** | `accent1` → Vert vif (`#04F06A`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle |
| **Alignement** | Justifié |
| **Texte par défaut** | "&lt;N&gt;" |

#### Rectangle 64

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 3.01 cm |
| **Position Y** | 3.32 cm |
| **Largeur** | 12.5 cm |
| **Hauteur** | 1.53 cm |
| **Police** | Tempus Sans ITC |
| **Taille police** | 14.0 pt |
| **Couleur texte** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle |
| **Alignement** | Justifié |
| **Texte par défaut** | "&lt;TEXT&gt;" |

#### Rectangle 65

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 15.98 cm |
| **Position Y** | 3.32 cm |
| **Largeur** | 1.43 cm |
| **Hauteur** | 1.53 cm |
| **Police** | Tempus Sans ITC |
| **Taille police** | 9.2 pt |
| **Couleur texte** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle |
| **Alignement** | Justifié |
| **Texte par défaut** | "Page &lt;P&gt;" |

#### Title 1

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder titre |
| **Position X** | 1.18 cm |
| **Position Y** | 1.12 cm |
| **Largeur** | 31.51 cm |
| **Hauteur** | 2.6 cm |
| **Taille police** | 24.0 pt |
| **Texte par défaut** | "AGENDA" |

---

## LAYOUT 24 : SP Divider

### Arrière-plan
Hérite du masque (blanc)

### Éléments (13 visibles)

#### Rectangle 51

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 0.97 cm |
| **Position Y** | 3.32 cm |
| **Largeur** | 2.2 cm |
| **Hauteur** | 1.53 cm |
| **Police** | Arial |
| **Taille police** | 16.0 pt |
| **Couleur texte** | `accent1` → Vert vif (`#04F06A`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle |
| **Alignement** | Justifié |
| **Texte par défaut** | "&lt;N&gt;" |

#### Rectangle 52

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 2.47 cm |
| **Position Y** | 3.32 cm |
| **Largeur** | 12.5 cm |
| **Hauteur** | 1.53 cm |
| **Police** | Tempus Sans ITC |
| **Taille police** | 16.0 pt |
| **Couleur texte** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle |
| **Alignement** | Justifié |
| **Texte par défaut** | "&lt;TEXT&gt;" |

#### Rectangle 53

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 16.69 cm |
| **Position Y** | 3.32 cm |
| **Largeur** | 1.43 cm |
| **Hauteur** | 1.53 cm |
| **Police** | Tempus Sans ITC |
| **Taille police** | 9.2 pt |
| **Couleur texte** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle |
| **Alignement** | Justifié |
| **Texte par défaut** | "Page &lt;P&gt;" |

#### Rectangle 55

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 0.97 cm |
| **Position Y** | 3.32 cm |
| **Largeur** | 2.2 cm |
| **Hauteur** | 1.53 cm |
| **Police** | Arial |
| **Taille police** | 16.0 pt |
| **Couleur texte** | `accent1` → Vert vif (`#04F06A`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle |
| **Alignement** | Justifié |
| **Texte par défaut** | "&lt;N&gt;" |

#### Rectangle 56

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 2.48 cm |
| **Position Y** | 3.32 cm |
| **Largeur** | 12.5 cm |
| **Hauteur** | 1.53 cm |
| **Police** | Tempus Sans ITC |
| **Taille police** | 16.0 pt |
| **Couleur texte** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle |
| **Alignement** | Justifié |
| **Texte par défaut** | "&lt;TEXT&gt;" |

#### Rectangle 57

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 16.69 cm |
| **Position Y** | 3.32 cm |
| **Largeur** | 1.43 cm |
| **Hauteur** | 1.53 cm |
| **Police** | Tempus Sans ITC |
| **Taille police** | 9.2 pt |
| **Couleur texte** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle |
| **Alignement** | Justifié |
| **Texte par défaut** | "Page &lt;P&gt;" |

#### Rectangle 59

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 2.07 cm |
| **Position Y** | 3.32 cm |
| **Largeur** | 2.2 cm |
| **Hauteur** | 1.53 cm |
| **Police** | Arial |
| **Taille police** | 14.0 pt |
| **Couleur texte** | `accent1` → Vert vif (`#04F06A`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle |
| **Alignement** | Justifié |
| **Texte par défaut** | "&lt;N&gt;" |

#### Rectangle 60

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 3.01 cm |
| **Position Y** | 3.32 cm |
| **Largeur** | 12.5 cm |
| **Hauteur** | 1.53 cm |
| **Police** | Tempus Sans ITC |
| **Taille police** | 14.0 pt |
| **Couleur texte** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle |
| **Alignement** | Justifié |
| **Texte par défaut** | "&lt;TEXT&gt;" |

#### Rectangle 61

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 15.99 cm |
| **Position Y** | 3.32 cm |
| **Largeur** | 1.43 cm |
| **Hauteur** | 1.53 cm |
| **Police** | Tempus Sans ITC |
| **Taille police** | 9.2 pt |
| **Couleur texte** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle |
| **Alignement** | Justifié |
| **Texte par défaut** | "Page &lt;P&gt;" |

#### Rectangle 63

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 2.07 cm |
| **Position Y** | 3.32 cm |
| **Largeur** | 2.2 cm |
| **Hauteur** | 1.53 cm |
| **Police** | Arial |
| **Taille police** | 14.0 pt |
| **Couleur texte** | `accent1` → Vert vif (`#04F06A`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle |
| **Alignement** | Justifié |
| **Texte par défaut** | "&lt;N&gt;" |

#### Rectangle 64

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 3.01 cm |
| **Position Y** | 3.32 cm |
| **Largeur** | 12.5 cm |
| **Hauteur** | 1.53 cm |
| **Police** | Tempus Sans ITC |
| **Taille police** | 14.0 pt |
| **Couleur texte** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle |
| **Alignement** | Justifié |
| **Texte par défaut** | "&lt;TEXT&gt;" |

#### Rectangle 65

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 15.98 cm |
| **Position Y** | 3.32 cm |
| **Largeur** | 1.43 cm |
| **Hauteur** | 1.53 cm |
| **Police** | Tempus Sans ITC |
| **Taille police** | 9.2 pt |
| **Couleur texte** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle |
| **Alignement** | Justifié |
| **Texte par défaut** | "Page &lt;P&gt;" |

#### Title 1

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder titre |
| **Position X** | 1.18 cm |
| **Position Y** | 1.12 cm |
| **Largeur** | 31.51 cm |
| **Hauteur** | 2.6 cm |
| **Taille police** | 24.0 pt |
| **Texte par défaut** | "AGENDA" |

---

## LAYOUT 25 : Text, Color &amp; Font guidelines

### Arrière-plan
Hérite du masque (blanc)

### Éléments (17 visibles)

#### Toptitle placeholder 1

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 1.18 cm |
| **Position Y** | 0.4 cm |
| **Largeur** | 31.51 cm |
| **Hauteur** | 0.72 cm |
| **Police** | Aptos (mineure) |
| **Taille police** | 10.0 pt |
| **Couleur texte** | `accent3` → Indigo foncé (`#250F6B`) |
| **Remplissage** | `accent3` → Indigo foncé (`#250F6B`) |
| **Forme** | Rectangle |
| **Texte par défaut** | "How to use the Wavestone ppt template" |

#### Rectangle 27

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 26.15 cm |
| **Position Y** | 1.15 cm |
| **Largeur** | 6.01 cm |
| **Hauteur** | 2.28 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 12.0 pt |
| **Couleur texte** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle coins arrondis |
| **Alignement** | Gauche |
| **Texte par défaut** | "Design Tip IV:    Do not forget to check the guides box, and do not add text out of them   (View &gt..." |

#### Title 1

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder titre |
| **Position X** | 1.18 cm |
| **Position Y** | 1.12 cm |
| **Largeur** | 6.78 cm |
| **Hauteur** | 2.6 cm |
| **Taille police** | 24.0 pt |
| **Texte par défaut** | "Text, Color &amp; Font guidelines" |

#### Copyright Wavestone and page 4

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 29.42 cm |
| **Position Y** | 18.27 cm |
| **Largeur** | 3.3 cm |
| **Hauteur** | 0.67 cm |
| **Police** | Aptos (mineure) |
| **Taille police** | 7.0 pt |
| **Couleur texte** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Remplissage** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Forme** | Rectangle |
| **Alignement** | Droite |
| **Texte par défaut** | "©  WAVESTONE  |  ‹N°›" |

#### ZoneTexte 16

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 1.18 cm |
| **Position Y** | 3.65 cm |
| **Largeur** | 18.08 cm |
| **Hauteur** | 0.72 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 12.0 pt |
| **Couleur texte** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle |
| **Alignement** | Gauche |
| **Texte par défaut** | "Colors of Wavestone  Powerpoint  Slide Master and associated hexadecimal &amp; RGB  color  codes " |

#### ZoneTexte 18

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 9.57 cm |
| **Position Y** | 4.34 cm |
| **Largeur** | 3.48 cm |
| **Hauteur** | 0.71 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 12.0 pt |
| **Couleur texte** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle |
| **Alignement** | Gauche |
| **Texte par défaut** | "BRAND COLORS" |

#### Ellipse 23

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 13.52 cm |
| **Position Y** | 6.28 cm |
| **Largeur** | 5.07 cm |
| **Hauteur** | 1.15 cm |
| **Police** | East Asian (majeure) |
| **Remplissage** | Aucun |
| **Forme** | Ellipse |
| **Alignement** | Gauche |

#### ZoneTexte 24

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 7.41 cm |
| **Position Y** | 8.63 cm |
| **Largeur** | 17.44 cm |
| **Hauteur** | 1.28 cm |
| **Taille police** | 12.0 pt |
| **Couleur texte** | `#FF2A49` |
| **Remplissage** | Aucun |
| **Forme** | Rectangle |
| **Alignement** | Centré |
| **Texte par défaut** | "F or accessibility reasons, do not combine energetic   and light green with light colors  ( i.e.  wh..." |

#### ZoneTexte 25

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 24.38 cm |
| **Position Y** | 4.34 cm |
| **Largeur** | 7.19 cm |
| **Hauteur** | 0.71 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 12.0 pt |
| **Couleur texte** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle |
| **Alignement** | Gauche |
| **Texte par défaut** | "ADDITIONAL FUNCTIONAL COLORS" |

#### ZoneTexte 28

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 1.18 cm |
| **Position Y** | 9.29 cm |
| **Largeur** | 31.51 cm |
| **Hauteur** | 0.71 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 12.0 pt |
| **Couleur texte** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle |
| **Alignement** | Gauche |
| **Texte par défaut** | "Text levels and bullet lists" |

#### Rectangle: Rounded Corners 10

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 8.03 cm |
| **Position Y** | 1.12 cm |
| **Largeur** | 3.66 cm |
| **Hauteur** | 2.28 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 12.0 pt |
| **Couleur texte** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle coins arrondis |
| **Alignement** | Gauche |
| **Texte par défaut** | "Shortcut:  to switch  text level,  Shift  + Alt + Right/Left arrow" |

#### Rectangle: Rounded Corners 27

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 11.9 cm |
| **Position Y** | 1.12 cm |
| **Largeur** | 4.0 cm |
| **Hauteur** | 2.28 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 12.0 pt |
| **Couleur texte** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle coins arrondis |
| **Alignement** | Gauche |
| **Texte par défaut** | "Design Tip I :   To add  bold  to your words, use the shortcut Ctrl + B" |

#### Rectangle 27

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 16.1 cm |
| **Position Y** | 1.12 cm |
| **Largeur** | 4.73 cm |
| **Hauteur** | 2.28 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 12.0 pt |
| **Couleur texte** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle coins arrondis |
| **Alignement** | Gauche |
| **Texte par défaut** | "Design Tip II:    Use Text 1 with Background 1 and Text 2 with Background 2" |

#### Rectangle 27

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 21.04 cm |
| **Position Y** | 1.12 cm |
| **Largeur** | 4.92 cm |
| **Hauteur** | 2.28 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 12.0 pt |
| **Couleur texte** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle coins arrondis |
| **Alignement** | Gauche |
| **Texte par défaut** | "Design Tip III:    Accent 1 and 2 are accentuation colors (≈ 5% maximum of the slide)" |

#### Accolade ouvrante 37

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Largeur** | 0.81 cm |
| **Hauteur** | 20.27 cm |
| **Remplissage** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Forme** | leftBrace |
| **Alignement** | Centré |

#### Accolade ouvrante 38

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 27.13 cm |
| **Position Y** | 1.21 cm |
| **Largeur** | 0.91 cm |
| **Hauteur** | 8.38 cm |
| **Remplissage** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Forme** | leftBrace |
| **Alignement** | Centré |

#### Freeform: Shape 11

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 27.73 cm |
| **Position Y** | 0.69 cm |
| **Largeur** | 8.75 cm |
| **Hauteur** | 1.77 cm |
| **Police** | East Asian (majeure) |
| **Couleur texte** | `bg1` → Blanc (`#FFFFFF`) |
| **Remplissage** | Aucun |
| **Alignement** | Centré |
| **Texte par défaut** | "To be deleted" |

---

## LAYOUT 26 : How to use of the additional functional colors 

### Arrière-plan
Hérite du masque (blanc)

### Éléments (15 visibles)

#### Title 1

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder titre |
| **Position X** | 1.18 cm |
| **Position Y** | 1.12 cm |
| **Largeur** | 31.5 cm |
| **Hauteur** | 2.6 cm |
| **Taille police** | 24.0 pt |
| **Texte par défaut** | "How to use of the additional functional colors " |

#### Toptitle placeholder 1

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 1.18 cm |
| **Position Y** | 0.4 cm |
| **Largeur** | 31.51 cm |
| **Hauteur** | 0.72 cm |
| **Police** | Aptos (mineure) |
| **Taille police** | 10.0 pt |
| **Couleur texte** | `accent3` → Indigo foncé (`#250F6B`) |
| **Remplissage** | `accent3` → Indigo foncé (`#250F6B`) |
| **Forme** | Rectangle |
| **Texte par défaut** | "How to use the Wavestone ppt template" |

#### Copyright Wavestone and page 4

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 29.42 cm |
| **Position Y** | 18.27 cm |
| **Largeur** | 3.3 cm |
| **Hauteur** | 0.67 cm |
| **Police** | Aptos (mineure) |
| **Taille police** | 7.0 pt |
| **Couleur texte** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Remplissage** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Forme** | Rectangle |
| **Alignement** | Droite |
| **Texte par défaut** | "©  WAVESTONE  |  ‹N°›" |

#### Rechteck 8

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 14.34 cm |
| **Position Y** | 8.22 cm |
| **Largeur** | 2.79 cm |
| **Hauteur** | 1.73 cm |
| **Police** | East Asian (majeure) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle coins arrondis |
| **Alignement** | Gauche |

#### Rectangle: Rounded Corners 17

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 24.34 cm |
| **Position Y** | 5.48 cm |
| **Largeur** | 3.2 cm |
| **Hauteur** | 0.8 cm |
| **Police** | Aptos SemiBold |
| **Taille police** | 10.0 pt |
| **Couleur texte** | `#000000` |
| **Remplissage** | Aucun |
| **Forme** | Rectangle coins arrondis |
| **Alignement** | Centré |
| **Texte par défaut** | "Completed" |

#### Rectangle: Rounded Corners 18

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 24.34 cm |
| **Position Y** | 7.24 cm |
| **Largeur** | 3.2 cm |
| **Hauteur** | 0.8 cm |
| **Police** | Aptos SemiBold |
| **Taille police** | 10.0 pt |
| **Couleur texte** | `#000000` |
| **Remplissage** | Aucun |
| **Forme** | Rectangle coins arrondis |
| **Alignement** | Centré |
| **Texte par défaut** | "Completed" |

#### Rectangle: Rounded Corners 19

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 24.34 cm |
| **Position Y** | 9.0 cm |
| **Largeur** | 3.2 cm |
| **Hauteur** | 0.8 cm |
| **Police** | Aptos SemiBold |
| **Taille police** | 10.0 pt |
| **Couleur texte** | `#000000` |
| **Remplissage** | Aucun |
| **Forme** | Rectangle coins arrondis |
| **Alignement** | Centré |
| **Texte par défaut** | "Completed" |

#### Rectangle: Rounded Corners 20

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 24.34 cm |
| **Position Y** | 10.76 cm |
| **Largeur** | 3.2 cm |
| **Hauteur** | 0.8 cm |
| **Police** | Aptos SemiBold |
| **Taille police** | 10.0 pt |
| **Couleur texte** | `tx1` → Noir (`#000000`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle coins arrondis |
| **Alignement** | Centré |
| **Texte par défaut** | "Ongoing" |

#### Rectangle: Rounded Corners 21

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 24.34 cm |
| **Position Y** | 12.51 cm |
| **Largeur** | 3.2 cm |
| **Hauteur** | 0.8 cm |
| **Police** | Aptos SemiBold |
| **Taille police** | 10.0 pt |
| **Couleur texte** | `tx1` → Noir (`#000000`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle coins arrondis |
| **Alignement** | Centré |
| **Texte par défaut** | "Issues" |

#### Rectangle: Rounded Corners 22

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 24.34 cm |
| **Position Y** | 14.27 cm |
| **Largeur** | 3.2 cm |
| **Hauteur** | 0.8 cm |
| **Police** | Aptos SemiBold |
| **Taille police** | 10.0 pt |
| **Couleur texte** | `#000000` |
| **Remplissage** | Aucun |
| **Forme** | Rectangle coins arrondis |
| **Alignement** | Centré |
| **Texte par défaut** | "Not Started" |

#### Rectangle: Rounded Corners 23

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 24.34 cm |
| **Position Y** | 16.03 cm |
| **Largeur** | 3.2 cm |
| **Hauteur** | 0.8 cm |
| **Police** | Aptos SemiBold |
| **Taille police** | 10.0 pt |
| **Couleur texte** | `tx1` → Noir (`#000000`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle coins arrondis |
| **Alignement** | Centré |
| **Texte par défaut** | "Ongoing" |

#### Oval 1 [4]

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 4.3 cm |
| **Position Y** | 2.51 cm |
| **Largeur** | 1.4 cm |
| **Hauteur** | 1.4 cm |
| **Remplissage** | Aucun |
| **Forme** | Ellipse |
| **Alignement** | Centré |

#### Oval 2 [4]

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 4.3 cm |
| **Position Y** | 4.3 cm |
| **Largeur** | 1.4 cm |
| **Hauteur** | 1.4 cm |
| **Remplissage** | Aucun |
| **Forme** | Ellipse |
| **Alignement** | Centré |

#### Oval 3 [4]

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 4.3 cm |
| **Position Y** | 6.09 cm |
| **Largeur** | 1.4 cm |
| **Hauteur** | 1.4 cm |
| **Remplissage** | Aucun |
| **Forme** | Ellipse |
| **Alignement** | Centré |

#### Freeform: Shape 11

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 27.73 cm |
| **Position Y** | 0.69 cm |
| **Largeur** | 8.75 cm |
| **Hauteur** | 1.77 cm |
| **Police** | East Asian (majeure) |
| **Couleur texte** | `bg1` → Blanc (`#FFFFFF`) |
| **Remplissage** | Aucun |
| **Alignement** | Centré |
| **Texte par défaut** | "To be deleted" |

### Éléments cachés (15)

- Oval 1 [0]
- Oval 2 [0]
- Oval 3 [0]
- Oval 1 [1]
- Oval 2 [1]
- Oval 3 [1]
- Oval 1 [2]
- Oval 2 [2]
- Oval 3 [2]
- Oval 1 [3]
- Oval 2 [3]
- Oval 3 [3]
- Oval 1 [5]
- Oval 2 [5]
- Oval 3 [5]

---

## LAYOUT 27 : Iconography guidelines

### Arrière-plan
Hérite du masque (blanc)

### Éléments (22 visibles)

#### Toptitle placeholder 1

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 1.18 cm |
| **Position Y** | 0.4 cm |
| **Largeur** | 31.51 cm |
| **Hauteur** | 0.72 cm |
| **Police** | Aptos (mineure) |
| **Taille police** | 10.0 pt |
| **Couleur texte** | `accent3` → Indigo foncé (`#250F6B`) |
| **Remplissage** | `accent3` → Indigo foncé (`#250F6B`) |
| **Forme** | Rectangle |
| **Texte par défaut** | "How to use the Wavestone ppt template" |

#### TextBox 26

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 1.18 cm |
| **Position Y** | 2.28 cm |
| **Largeur** | 31.51 cm |
| **Hauteur** | 1.37 cm |
| **Police** | Aptos |
| **Taille police** | 16.0 pt |
| **Couleur texte** | `tx1` → Noir (`#000000`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle |
| **Alignement** | Gauche |
| **Texte par défaut** | "With the rebranding of our corporate design, we will also define a new look and feel for our iconogr..." |

#### TextBox 1

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 1.18 cm |
| **Position Y** | 4.43 cm |
| **Largeur** | 15.08 cm |
| **Hauteur** | 3.88 cm |
| **Taille police** | 16.0 pt |
| **Couleur texte** | `accent3` → Indigo foncé (`#250F6B`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle |
| **Texte par défaut** | "1. People We are a people-centred company. So we should use lots of images of people.  The people we..." |

#### TextBox 34

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 19.72 cm |
| **Position Y** | 4.43 cm |
| **Largeur** | 12.97 cm |
| **Hauteur** | 3.68 cm |
| **Police** | Aptos |
| **Taille police** | 16.0 pt |
| **Couleur texte** | `accent3` → Indigo foncé (`#250F6B`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle |
| **Alignement** | Gauche |
| **Texte par défaut** | "2. Themes We express the global and holistic approach of our company by using bird's eye view images..." |

#### Wavestone copyright and page 4

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 29.42 cm |
| **Position Y** | 18.27 cm |
| **Largeur** | 3.3 cm |
| **Hauteur** | 0.67 cm |
| **Police** | Aptos (mineure) |
| **Taille police** | 7.0 pt |
| **Couleur texte** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Remplissage** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Forme** | Rectangle |
| **Alignement** | Droite |
| **Texte par défaut** | "©  WAVESTONE  |  ‹N°›" |

#### Title 1

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder titre |
| **Position X** | 1.18 cm |
| **Position Y** | 1.12 cm |
| **Largeur** | 31.51 cm |
| **Hauteur** | 0.96 cm |
| **Taille police** | 24.0 pt |
| **Texte par défaut** | "Iconography guidelines" |

#### Freeform: Shape 11

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 27.73 cm |
| **Position Y** | 0.69 cm |
| **Largeur** | 8.75 cm |
| **Hauteur** | 1.77 cm |
| **Police** | East Asian (majeure) |
| **Couleur texte** | `bg1` → Blanc (`#FFFFFF`) |
| **Remplissage** | Aucun |
| **Alignement** | Centré |
| **Texte par défaut** | "To be deleted" |

#### Graphic  23

| Propriété | Valeur |
|-----------|--------|
| **Type** | Image |
| **Position X** | 19.73 cm |
| **Position Y** | 8.97 cm |
| **Largeur** | 4.32 cm |
| **Hauteur** | 2.88 cm |

#### Graphic  14

| Propriété | Valeur |
|-----------|--------|
| **Type** | Image |
| **Position X** | 19.73 cm |
| **Position Y** | 11.64 cm |
| **Largeur** | 4.32 cm |
| **Hauteur** | 2.93 cm |

#### Graphic 6

| Propriété | Valeur |
|-----------|--------|
| **Type** | Image |
| **Position X** | 19.73 cm |
| **Position Y** | 14.45 cm |
| **Largeur** | 4.32 cm |
| **Hauteur** | 2.88 cm |

#### Graphic  8

| Propriété | Valeur |
|-----------|--------|
| **Type** | Image |
| **Position X** | 24.03 cm |
| **Position Y** | 8.97 cm |
| **Largeur** | 4.33 cm |
| **Hauteur** | 2.88 cm |

#### Graphic  12

| Propriété | Valeur |
|-----------|--------|
| **Type** | Image |
| **Position X** | 24.03 cm |
| **Position Y** | 11.64 cm |
| **Largeur** | 4.33 cm |
| **Hauteur** | 2.93 cm |

#### Graphic  4

| Propriété | Valeur |
|-----------|--------|
| **Type** | Image |
| **Position X** | 24.03 cm |
| **Position Y** | 14.45 cm |
| **Largeur** | 4.33 cm |
| **Hauteur** | 2.89 cm |

#### Graphic  9

| Propriété | Valeur |
|-----------|--------|
| **Type** | Image |
| **Position X** | 1.18 cm |
| **Position Y** | 8.97 cm |
| **Largeur** | 4.07 cm |
| **Hauteur** | 6.1 cm |

#### Graphic  13

| Propriété | Valeur |
|-----------|--------|
| **Type** | Image |
| **Position X** | 5.23 cm |
| **Position Y** | 8.97 cm |
| **Largeur** | 4.06 cm |
| **Hauteur** | 6.09 cm |

#### Graphic 28

| Propriété | Valeur |
|-----------|--------|
| **Type** | Image |
| **Position X** | 9.29 cm |
| **Position Y** | 8.99 cm |
| **Largeur** | 7.03 cm |
| **Hauteur** | 3.74 cm |

#### Graphic  30

| Propriété | Valeur |
|-----------|--------|
| **Type** | Image |
| **Position X** | 1.18 cm |
| **Position Y** | 14.94 cm |
| **Largeur** | 4.07 cm |
| **Hauteur** | 2.39 cm |

#### Image 6

| Propriété | Valeur |
|-----------|--------|
| **Type** | Image |
| **Position X** | 5.23 cm |
| **Position Y** | 14.93 cm |
| **Largeur** | 4.06 cm |
| **Hauteur** | 2.39 cm |

#### Image 4

| Propriété | Valeur |
|-----------|--------|
| **Type** | Image |
| **Position X** | 9.29 cm |
| **Position Y** | 12.71 cm |
| **Largeur** | 7.03 cm |
| **Hauteur** | 4.61 cm |

#### Graphic  16

| Propriété | Valeur |
|-----------|--------|
| **Type** | Image |
| **Position X** | 28.35 cm |
| **Position Y** | 8.97 cm |
| **Largeur** | 4.33 cm |
| **Hauteur** | 2.88 cm |

#### Graphic  10

| Propriété | Valeur |
|-----------|--------|
| **Type** | Image |
| **Position X** | 28.35 cm |
| **Position Y** | 11.64 cm |
| **Largeur** | 4.33 cm |
| **Hauteur** | 2.91 cm |

#### Graphic  18

| Propriété | Valeur |
|-----------|--------|
| **Type** | Image |
| **Position X** | 28.35 cm |
| **Position Y** | 14.45 cm |
| **Largeur** | 4.33 cm |
| **Hauteur** | 2.89 cm |

---

## LAYOUT 28 : Digital accessibility guidelines

### Arrière-plan
Hérite du masque (blanc)

### Éléments (26 visibles)

#### Toptitle placeholder 1

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder corps |
| **Position X** | 1.18 cm |
| **Position Y** | 0.4 cm |
| **Largeur** | 31.51 cm |
| **Hauteur** | 0.72 cm |
| **Police** | Aptos (mineure) |
| **Taille police** | 10.0 pt |
| **Couleur texte** | `accent3` → Indigo foncé (`#250F6B`) |
| **Remplissage** | `accent3` → Indigo foncé (`#250F6B`) |
| **Forme** | Rectangle |
| **Texte par défaut** | "How to use the Wavestone ppt template" |

#### TextBox 2

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 1.18 cm |
| **Position Y** | 3.73 cm |
| **Largeur** | 31.51 cm |
| **Hauteur** | 2.18 cm |
| **Police** | Aptos |
| **Taille police** | 16.0 pt |
| **Couleur texte** | `tx1` → Noir (`#000000`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle |
| **Alignement** | Gauche |
| **Texte par défaut** | "As part of its CSR* approach, Wavestone is committed to create an inclusive working environment, in ..." |

#### TextBox 3

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 1.18 cm |
| **Position Y** | 16.89 cm |
| **Largeur** | 31.51 cm |
| **Hauteur** | 0.44 cm |
| **Police** | Aptos |
| **Taille police** | 11.0 pt |
| **Couleur texte** | `tx1` → Noir (`#000000`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle |
| **Alignement** | Gauche |
| **Texte par défaut** | "*Corporate Social Responsibility " |

#### Rectangle 1: Rounded Corners 4

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 1.18 cm |
| **Position Y** | 6.06 cm |
| **Largeur** | 7.58 cm |
| **Hauteur** | 10.71 cm |
| **Police** | East Asian (majeure) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle coins arrondis |
| **Alignement** | Centré |

#### TextBox 3

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 2.29 cm |
| **Position Y** | 6.73 cm |
| **Largeur** | 4.26 cm |
| **Hauteur** | 0.68 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 16.0 pt |
| **Couleur texte** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle |
| **Texte par défaut** | "Slide Master*" |

#### TextBox 4

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 1.18 cm |
| **Position Y** | 7.9 cm |
| **Largeur** | 7.58 cm |
| **Hauteur** | 8.62 cm |
| **Police** | Arial |
| **Taille police** | 12.0 pt |
| **Couleur texte** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle |
| **Texte par défaut** | "Make maximum use of the elements provided by the Slide Master (title insert, shapes, fonts, colours)..." |

#### Rectangle 2: Rounded Corners 5

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 9.15 cm |
| **Position Y** | 6.06 cm |
| **Largeur** | 7.58 cm |
| **Hauteur** | 10.71 cm |
| **Police** | East Asian (majeure) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle coins arrondis |
| **Alignement** | Centré |

#### TextBox 5

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 10.41 cm |
| **Position Y** | 6.73 cm |
| **Largeur** | 4.17 cm |
| **Hauteur** | 0.68 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 16.0 pt |
| **Couleur texte** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle |
| **Texte par défaut** | "Visuals" |

#### TextBox 6

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 9.15 cm |
| **Position Y** | 8.08 cm |
| **Largeur** | 7.58 cm |
| **Hauteur** | 8.06 cm |
| **Police** | Arial |
| **Taille police** | 12.0 pt |
| **Couleur texte** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle |
| **Texte par défaut** | "Include an "Alt Text“* when a visual has a meaning, otherwise mark it as "decorative" *The Alt Text ..." |

#### Rectangle 3: Rounded Corners 7

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 17.13 cm |
| **Position Y** | 6.06 cm |
| **Largeur** | 7.58 cm |
| **Hauteur** | 10.71 cm |
| **Police** | East Asian (majeure) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle coins arrondis |
| **Alignement** | Centré |

#### TextBox 7

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 18.49 cm |
| **Position Y** | 6.73 cm |
| **Largeur** | 4.65 cm |
| **Hauteur** | 0.68 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 16.0 pt |
| **Couleur texte** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle |
| **Texte par défaut** | "Fonts and text" |

#### TextBox 8

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 17.13 cm |
| **Position Y** | 8.0 cm |
| **Largeur** | 7.58 cm |
| **Hauteur** | 4.81 cm |
| **Police** | Arial |
| **Taille police** | 12.0 pt |
| **Couleur texte** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle |
| **Texte par défaut** | "Stick to the fonts and colors suggested in the Slide Master Do not tone down text (e.g. image legend..." |

#### TextBox 9

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 18.49 cm |
| **Position Y** | 12.63 cm |
| **Largeur** | 3.71 cm |
| **Hauteur** | 0.7 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 16.0 pt |
| **Couleur texte** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Remplissage** | `accent6` → Gris très clair (`#F6F6F6`) |
| **Forme** | Rectangle |
| **Texte par défaut** | "Chart" |

#### TextBox 10

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 17.13 cm |
| **Position Y** | 13.98 cm |
| **Largeur** | 7.58 cm |
| **Hauteur** | 2.53 cm |
| **Police** | Arial |
| **Taille police** | 12.0 pt |
| **Couleur texte** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle |
| **Texte par défaut** | "Don't forget table and row/column titles Avoid merging cells" |

#### Rectangle 4: Rounded Corners 6

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 25.11 cm |
| **Position Y** | 6.06 cm |
| **Largeur** | 7.58 cm |
| **Hauteur** | 10.71 cm |
| **Police** | East Asian (majeure) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle coins arrondis |
| **Alignement** | Centré |

#### TextBox 11

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 26.69 cm |
| **Position Y** | 6.73 cm |
| **Largeur** | 4.28 cm |
| **Hauteur** | 0.68 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 16.0 pt |
| **Couleur texte** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle |
| **Texte par défaut** | "Content" |

#### TextBox 12

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 25.1 cm |
| **Position Y** | 8.22 cm |
| **Largeur** | 7.58 cm |
| **Hauteur** | 8.9 cm |
| **Police** | Arial |
| **Taille police** | 12.0 pt |
| **Couleur texte** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle |
| **Alignement** | Gauche |
| **Texte par défaut** | "Avoid abbreviations (explain them once on 1 st  use) Avoid overloaded slides (one strong idea per sl..." |

#### Rectangle 13

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 19.79 cm |
| **Position Y** | 1.12 cm |
| **Largeur** | 8.22 cm |
| **Hauteur** | 1.93 cm |
| **Police** | Aptos SemiBold (majeure) |
| **Taille police** | 12.0 pt |
| **Couleur texte** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Remplissage** | Aucun |
| **Forme** | Rectangle |
| **Alignement** | Gauche |
| **Texte par défaut** | "Accessibility Tip:  check  the accessibility  level of your presentation by going to  "Review“ then ..." |

#### Copyright and page 4

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 29.42 cm |
| **Position Y** | 18.27 cm |
| **Largeur** | 3.3 cm |
| **Hauteur** | 0.67 cm |
| **Police** | Aptos (mineure) |
| **Taille police** | 7.0 pt |
| **Couleur texte** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Remplissage** | `bg2` → Violet Wavestone (`#451DC7`) |
| **Forme** | Rectangle |
| **Alignement** | Droite |
| **Texte par défaut** | "©  WAVESTONE  |  ‹N°›" |

#### Title 1

| Propriété | Valeur |
|-----------|--------|
| **Type** | Placeholder titre |
| **Position X** | 1.18 cm |
| **Position Y** | 1.12 cm |
| **Largeur** | 15.65 cm |
| **Hauteur** | 2.6 cm |
| **Taille police** | 24.0 pt |
| **Texte par défaut** | "Digital accessibility guidelines" |

#### Freeform: Shape 11

| Propriété | Valeur |
|-----------|--------|
| **Type** | Forme |
| **Position X** | 27.73 cm |
| **Position Y** | 0.69 cm |
| **Largeur** | 8.75 cm |
| **Hauteur** | 1.77 cm |
| **Police** | East Asian (majeure) |
| **Couleur texte** | `bg1` → Blanc (`#FFFFFF`) |
| **Remplissage** | Aucun |
| **Alignement** | Centré |
| **Texte par défaut** | "To be deleted" |

#### Arrow 1

| Propriété | Valeur |
|-----------|--------|
| **Type** | Image |
| **Position X** | 1.5 cm |
| **Position Y** | 6.79 cm |
| **Largeur** | 0.57 cm |
| **Hauteur** | 0.55 cm |

#### Arrow 2

| Propriété | Valeur |
|-----------|--------|
| **Type** | Image |
| **Position X** | 9.62 cm |
| **Position Y** | 6.79 cm |
| **Largeur** | 0.57 cm |
| **Hauteur** | 0.55 cm |

#### Arrow 3

| Propriété | Valeur |
|-----------|--------|
| **Type** | Image |
| **Position X** | 17.65 cm |
| **Position Y** | 6.79 cm |
| **Largeur** | 0.57 cm |
| **Hauteur** | 0.55 cm |

#### Arrow 4

| Propriété | Valeur |
|-----------|--------|
| **Type** | Image |
| **Position X** | 17.65 cm |
| **Position Y** | 12.71 cm |
| **Largeur** | 0.57 cm |
| **Hauteur** | 0.55 cm |

#### Arrow 5

| Propriété | Valeur |
|-----------|--------|
| **Type** | Image |
| **Position X** | 25.82 cm |
| **Position Y** | 6.79 cm |
| **Largeur** | 0.57 cm |
| **Hauteur** | 0.55 cm |

---

# PARTIE 4 : RESSOURCES MÉDIA

---

## 4.1 LOGOS WAVESTONE

| Fichier | Format | Usage |
|---------|--------|-------|
| `image1.svg` | SVG vectoriel | Logo violet principal |
| `image2.svg` | SVG vectoriel | Logo blanc |
| `image3.svg` | SVG vectoriel | Logo bleu |
| `image4.svg` | SVG vectoriel | Logo alternatif |

## 4.2 IMAGES INTÉGRÉES

| Type | Quantité | Formats |
|------|----------|---------|
| PNG | 8 fichiers | Icônes, éléments graphiques |
| JPEG | 13 fichiers | Photos, visuels de couverture |
| SVG | 4 fichiers | Logos vectoriels |

---

# PARTIE 5 : POLICES EMBARQUÉES

---

## 5.1 FICHIERS DE POLICES

Le thème embarque **19 fichiers de polices** pour garantir la cohérence visuelle :

| Police | Fichiers |
|--------|----------|
| Aptos | Regular, Light, SemiBold |
| Poppins | Regular, Light, SemiBold |
| Tempus Sans ITC | Regular |
| Avenir Next LT Pro | Regular |
| Courier New | Regular |

---

# PARTIE 6 : DIMENSIONS ET MARGES

---

## 6.1 DIMENSIONS DE LA DIAPOSITIVE

| Propriété | Valeur |
|-----------|--------|
| **Format** | 16:9 |
| **Largeur** | 33,87 cm (12 192 000 EMU) |
| **Hauteur** | 19,05 cm (6 858 000 EMU) |

## 6.2 ZONES DE TRAVAIL

| Zone | X | Y | Largeur | Hauteur |
|------|---|---|---------|---------|
| **Titre** | 1,18 cm | 1,12 cm | 31,51 cm | 2,60 cm |
| **Contenu** | 1,18 cm | 3,73 cm | 31,51 cm | 13,60 cm |
| **Notes** | 1,18 cm | 17,36 cm | 31,51 cm | 0,71 cm |
| **Copyright** | 29,42 cm | 18,27 cm | 3,30 cm | 0,67 cm |

## 6.3 MARGES DE SÉCURITÉ

| Côté | Marge |
|------|-------|
| Gauche | 1,18 cm |
| Droite | 1,18 cm |
| Haut | 0,40 cm (top title) / 1,12 cm (titre) |
| Bas | 0,78 cm |

---

# PARTIE 7 : CODES COULEUR DE RÉFÉRENCE RAPIDE

---

## 7.1 COULEURS PRINCIPALES

```
Violet Wavestone    #451DC7  (bg2, tx2, lt2)
Noir                #000000  (dk1, tx1)
Blanc               #FFFFFF  (lt1, bg1)
```

## 7.2 ACCENTS

```
Vert vif            #04F06A  (accent1) - Succès, highlights
Vert menthe         #CAFEE0  (accent2) - Fonds légers
Indigo foncé        #250F6B  (accent3) - Fonds de slides
Bleu acier          #4682B4  (accent4) - Graphiques
Violet électrique   #8F00FF  (accent5) - Accents dynamiques
Gris très clair     #F6F6F6  (accent6) - Fonds neutres
```

## 7.3 COULEURS FONCTIONNELLES

```
Rouge erreur        #FF2A49  - Alertes, erreurs
Jaune attention     #FFCA4A  - En cours, warning
Vert succès         #04F06A  - Terminé, OK
```

---

*Document généré automatiquement par analyse XML du fichier Thème.thmx*