# ✈️ Portfolio — IHM Aviation Générale

---

## 📦 Stack technique

| Élément       | Version  |
|---------------|----------|
| HTML          | 5        |
| CSS           | 3        |
| JavaScript    | ES6+     |

---

## 🗂️ Structure du projet
```
FlightManager/
├── index.html
├── assets/
│   ├── icons/
│   ├── images/
│   └── fonts/
└── src/
│   ├── html/
│       ├── atc.html
│       ├── atis.html
│       ├── fpl.html
│       ├── calc.html
│       ├── pta.html
│       └── aide.html
├── css/
│   ├── style.css
│   └── positionnement.css
├── js/
│   ├── utils.js
│   ├── atc.js
│   ├── atis.js
│   ├── fpl.js
│   ├── calc.js
│   ├── pta.js
│   └── aide.js
└── procedures/
│    ├── avions/
│    │   └── <type_avion>/
│    │       ├── checklist.pdf
│    │       ├── manuel.pdf
│    │       └── pannes.pdf
│    └── aeroports/
│    └── <code_OACI>/
│    ├── VAC.pdf
│    └── approches.pdf
```

## 🖥️ Interface & Fonctionnalités

### 📡 Déposer un plan de vol internationnal

Copie de l'interface d'IVAO : https://wiki.ivao.aero/fr/home/devops/websites/flightplansystem.
**Objectfs**
L'utilisateur à seulement besoin d'entrer : 
- L'identification de l'avion
- Le régime de vol
- le type de vol
- le nombre d'appareil
- le type d'avion
- l'aérodrome de départ
- l'aérodrome d'arrivée
- l'aérodrome de déroutement
- l'heure de départ
- la vitesse
- l'altitude

Pour qu'il obtienne des champs déjà prérempli :
- Catégorie de turbulence (prérempli)
- Equipement (prérempli)
- Transpondeur (prérempli)
- Quantité de carburant nécéssaire (prérempli)
- Quantité de carburant total (prérempli)

Cela permettra aussi à l'utilisateur d'obtenir, les procédures, performances, devis de masse et centrage propre à son appareil mais également les informations métérologiques de son aérodrome de départ, d'arrivée et de déroutement.

---

### 🎙️ ATC — Contrôle du trafic aérien

Zones de texte pour noter les instructions du contrôleur, organisées par phase :

| Phase           | 
|-----------------|
| Mise en route   | 
| Taxi            |
| Décollage       |
| En vol          |
| Approche        |
| Finale          |
| Retour parking  |

Tableau des **fréquences de radiocommunication** intégré.

---

### 🌤️ ATIS — Informations météorologiques

Connexion via **API météo** à partir d'un code OACI saisi par l'utilisateur (ex : `LFRS`).

Informations affichées pour chaque aéroport :

- Piste en service
- QNH
- Vent (direction / vitesse)
- Nuages (couverture + altitude)

| Mode          | Nombre d'aéroports       |
|---------------|--------------------------|
| Tour de Piste | 1                        |
| Autres modes  | Départ + Route + Arrivée |

---

### 🗺️ Plan de vol

Tableau de navigation avec saisie par ligne :

| Colonne                | Description                        |
|------------------------|------------------------------------|
| Nom du point           | Balise, VOR, waypoint...           |
| Altitude cible         | Montée, descente, pallier ...      |
| Azimut, dérive comprise| Cap avec l'effet du vent           |
| Temps avec vent        | Le temps pour atteindre ce point   |
| La distance            | La distance pour atteindre ce point|
| Le temps cumulé        | Le cumul des TAV précédents        |
| La distance cumulée    | Le cumul des distances précédentes |
| Les observations       | Détail du report, fréquence ...    |

> Le calcul intègre la force et la direction du vent saisi dans l'ATIS.

*Intégrer un chronomètre et minuteur*

---

### 🧮 Outils de calcul

Calculateurs présentés sous forme de tableau :

- Pente de montée / descente (TOC / TOD)
- Consommation carburant
- Temps de vol
- Conversions
- *(extensible)*

---

### 📋 Procédures

Deux modes d'accès :

**Par avion** — sélection du type → affichage de :
- Checklist
- Manuel de vol
- Actions en cas de défaillance / panne
- Performances

**Par aéroport** — saisie du code OACI → affichage des documents depuis :
- Carte VAC
- Cartes d'approche

---

### 📖 Aide — Mémos

Affichage de fiches mémos :

- Phraséologies radio
- Conduites à tenir
- Règles de l'air (VFR / IFR)
- Types et catégorisation des nuages
- Classes d'espaces aériens
- *(extensible)*

---

## 👤 Auteur

**Enzo Saulas**