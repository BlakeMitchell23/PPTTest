# Wavestone PowerPoint Generator

Application web qui genere des presentations PowerPoint professionnelles au format Wavestone. L'utilisateur entre une description de sa presentation et l'application genere un fichier .pptx complet, respectant la charte graphique Wavestone.

## Fonctionnalites

- **Generation IA** : Utilise Claude pour creer un contenu structure et professionnel
- **Charte Wavestone** : Respect integral des couleurs, typographies et layouts Wavestone
- **Types de decks** : Formation, Proposition commerciale, Rapport de projet, Autre
- **Multilingue** : Francais et Anglais
- **Types de slides varies** : Titre, Section, Contenu, Comparaison, Process, Table, Liste

## Installation

### Prerequisites

- Node.js 18+
- Cle API Anthropic (Claude)

### Setup

1. Cloner le repository :
```bash
git clone <repository-url>
cd wavestone-pptx-generator
```

2. Installer les dependances :
```bash
npm install
```

3. Configurer les variables d'environnement :
```bash
cp .env.example .env
# Editer .env et ajouter votre cle API Anthropic
```

4. Lancer le serveur :
```bash
npm start
```

5. Ouvrir http://localhost:3000 dans votre navigateur

## Utilisation

1. **Decrire votre presentation** : Entrez une description detaillee incluant le sujet, l'audience et les objectifs
2. **Configurer les options** : Nombre de slides, langue, type de deck
3. **Generer** : Cliquez sur "Generer la presentation"
4. **Telecharger** : Le fichier .pptx sera automatiquement telecharge

### Exemples de prompts

**Formation** :
```
Formation sur l'utilisation de Microsoft Teams pour une equipe commerciale de 15 personnes.
L'objectif est de les rendre autonomes sur les fonctionnalites de collaboration, le partage
de fichiers et la gestion des reunions en ligne.
```

**Proposition commerciale** :
```
Proposition pour accompagner une banque regionale dans la mise en place d'un outil CRM Salesforce.
Le client a 200 conseillers et souhaite ameliorer le suivi de la relation client.
```

## Architecture

```
wavestone-pptx-generator/
├── frontend/
│   ├── index.html      # Interface utilisateur
│   ├── styles.css      # Styles (charte Wavestone)
│   └── app.js          # Logique frontend
├── backend/
│   ├── server.js       # Serveur Express
│   ├── config/
│   │   ├── colors.js   # Palette Wavestone
│   │   └── typography.js
│   └── generator/
│       ├── contentGenerator.js  # Integration Claude
│       ├── pptxBuilder.js       # Construction PPTX
│       └── templates/           # Templates de slides
├── output/             # Fichiers generes
├── package.json
└── README.md
```

## Charte graphique

### Couleurs principales

| Couleur | Hex | Usage |
|---------|-----|-------|
| Bleu Wavestone | #451DC7 | Titres, fonds de section |
| Vert energique | #04F06A | Accents, lignes decoratives |
| Vert clair | #CAFEE0 | Encadres, callouts |
| Violet | #250F6B | Texte sur fond vert clair |

### Regles d'accessibilite

- **INTERDIT** : Texte blanc sur fond vert
- **AUTORISE** : Texte noir sur vert, texte blanc sur bleu

### Typographie

- Police : Aptos (fallback: system fonts)
- Titres : 24pt, bold, bleu
- Corps : 14pt, noir

## API

### POST /api/generate

Genere une presentation PowerPoint.

**Request Body** :
```json
{
  "prompt": "Description de la presentation",
  "slideCount": 15,
  "language": "fr",
  "deckType": "formation"
}
```

**Response** : Fichier .pptx binaire

### POST /api/preview

Previsualise le contenu genere (JSON).

### GET /api/health

Verification de l'etat du serveur.

## Developpement

```bash
# Lancer en mode developpement
npm run dev

# Structure du contenu genere
{
  "deck_title": "...",
  "deck_subtitle": "...",
  "sections": [
    {
      "section_number": 1,
      "section_title": "...",
      "slides": [
        {
          "title": "Message principal",
          "type": "content|comparison|process|table|list",
          "content": { ... }
        }
      ]
    }
  ]
}
```

## Licence

MIT
