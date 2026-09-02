# AGENTS.md : Guide de navigation IA

> **Règle d'or : lis ce fichier EN PREMIER quand tu ouvres ce dépôt.**
> Il économise ~80 % des tokens d'exploration. Tout est déjà cartographié.

---

## 1. Ne JAMAIS lire en entier ces fichiers

Utilise `Grep` (jamais `Read` sans `offset`/`limit`) :

| Fichier | Taille | Contenu | À la place |
| --- | --- | --- | --- |
| `js/basics_recipes.js` | 3 636 lignes | Données pures (100+ recettes) | `Grep -n "\"nom-recette\""` |
| `js/batch_recipes.js` | 2 993 lignes | Données pures (40 recettes batch) | `Grep -n` |
| `css/styles.css` | 8 047 lignes | Tout le design system | `Grep -n "\.selector"` puis `Read offset:N limit:40` |
| `data/nutrition-fr.json` | ~120 Ko | Table nutritionnelle | `Grep -n "\"aliment\""` |
| `data/recipe-images-mapping.json` | binaire | Base64 d'images | **jamais** |
| `js/*.js.bak` | résidus | Sauvegardes obsolètes | **ignorer complètement** |

---

## 2. Carte module → fichier

Chaque fichier `js/*.js` expose exactement **un global en IIFE** (`const X = (() => {...})()`).
Pour trouver l'impl de `Recipes.save(...)`, ouvre directement `js/recipes.js` : pas de `grep`.

| Global | Fichier | Rôle |
| --- | --- | --- |
| `App` | `js/app.js` | Bootstrap, orchestration, écouteurs globaux |
| `Router` | `js/router.js` | Routage hash-based |
| `Utils` | `js/utils.js` | Helpers, icônes SVG inline, constantes |
| `Consent` | `js/consent.js` | Consentement RGPD, bannière bloquante (localStorage, per-device) |
| `Analytics` | `js/analytics.js` | Google Analytics 4 sous Consent Mode v2, événements d'usage |
| `Recipes` | `js/recipes.js` | CRUD recettes, recherche, filtres |
| `Menu` | `js/menu.js` | Planning hebdo |
| `Shopping` | `js/shopping.js` | Agrégation liste de courses |
| `Batch` | `js/batch.js` | État session batch cooking |
| `BatchEngine` | `js/batch-engine.js` | Ordonnancement four/plaques + frigo/congélo |
| `Nutrition` | `js/nutrition.js` | Calcul valeurs nutritionnelles |
| `PizzaEngine` | `js/pizza-engine.js` | Formulation pâte à pizza |
| `BreadEngine` | `js/bread-engine.js` | Formulation pains + timeline |
| `FoodDB` | `js/food-db.js` | Aliments de référence (aliases + macros) |
| `Rayons` | `js/rayons.js` | Mapping ingrédient → rayon |
| `DB` | `js/db.js` | IndexedDB bas niveau |
| `Storage` | `js/storage.js` | IndexedDB haut niveau + import/export JSON |
| `PhotoStorage` | `js/photo-storage.js` | Compression Canvas + persistance blobs |
| `Auth` | `js/auth.js` | GIS OAuth2, refresh silencieux |
| `Sync` | `js/sync.js` | Merge bidirectionnel Google Drive AppData |
| `Share` | `js/share.js` | URLs de partage compressées (is.gd) |
| `Settings` | `js/settings.js` | État paramètres utilisateur |
| `Install` | `js/install.js` | Bannière d'installation PWA |
| `UI` | `js/ui.js` | Coordination du rendu, éléments transverses |
| `BASICS_RECIPES` | `js/basics_recipes.js` | Constante (pas de méthodes) |
| `BATCH_RECIPES` | `js/batch_recipes.js` | Constante |
| `GOOGLE_CONFIG` / `FIREBASE_CONFIG` | `js/firebase-config.js` | Client ID OAuth2 |

Les `js/ui-*.js` (ci-dessous) **n'exposent pas de global** : ce sont des extensions qui se greffent sur `UI` :

| Fichier | Vue |
| --- | --- |
| `js/ui-components.js` | Composants réutilisables (modales, chips, cards…) |
| `js/ui-recipes.js` | Fiche recette + formulaire |
| `js/ui-recipe-browse.js` | Liste : barre de recherche collante, feuille de filtres, puces actives, rendu progressif |
| `js/ui-cook.js` | Mode cuisine pas à pas |
| `js/ui-planner.js` | Planning |
| `js/ui-shopping.js` | Liste de courses |
| `js/ui-batch.js` | Batch cooking (composition + exécution) |
| `js/ui-foods.js` | Base d'aliments |
| `js/ui-settings.js` | Paramètres + Drive |
| `js/ui-pages.js` | Pages statiques (mentions légales, politique de confidentialité) |

---

## 3. « Je veux modifier X, je vais où ? »

| Intention | Fichier(s) cible |
| --- | --- |
| Ajouter/modifier une recette de base | `js/basics_recipes.js` |
| Ajouter une recette batch cooking | `js/batch_recipes.js` (avec bloc `batch: {...}`, cf. README) |
| Modifier la fiche ou le formulaire recette | `js/ui-recipes.js` |
| Modifier la liste, la recherche ou les filtres | `js/ui-recipe-browse.js` (état des filtres : `Router.state.listFilters`, moteur : `Recipes.filter`) |
| Modifier le planning (rendu) | `js/ui-planner.js` (logique : `js/menu.js`) |
| Modifier la liste de courses (rendu) | `js/ui-shopping.js` (agrégation : `js/shopping.js`) |
| Modifier l'ordonnancement batch | `js/batch-engine.js` |
| Modifier l'UI batch (composition/exécution) | `js/ui-batch.js` |
| Modifier le calcul nutritionnel | `js/nutrition.js` (données : `js/food-db.js`) |
| Ajouter/modifier un rayon | `js/rayons.js` |
| Modifier la sync Drive | `js/sync.js` (auth : `js/auth.js`) |
| Ajouter un onglet | `js/router.js` + nouveau `js/ui-*.js` + `<script>` dans `index.html` |
| Style d'un composant | `Grep` sélecteur dans `css/styles.css` |

---

## 4. Règles OBLIGATOIRES à chaque modification

1. **Bumper `CACHE` dans `sw.js`** (voir la valeur en tête de `sw.js`) à **chaque** changement de `js/*.js`, `css/styles.css` ou `index.html`. Sinon les users voient l'ancienne version en cache SW.
2. **Bumper `?v=N`** dans `index.html` sur la ligne `<script src="js/xxx.js?v=N">` du fichier touché (busting cache navigateur).
3. **Nouveau fichier JS** :
   - ajouter à `SHELL_CRITICAL` dans `sw.js` (obligatoire : un fichier absent de cette liste ne sera pas précaché et l'app cassera hors ligne). `SHELL_OPTIONAL` accueille les icônes, les polices `fonts/*.woff2` et les `data/*.json`, dont l'échec est toléré (un 404 de police ne doit pas faire échouer l'install du SW),
   - ajouter `<script src>` dans `index.html` **dans le bon ordre** (voir §5),
   - ajouter à la table du §2 ci-dessus.
4. **Ne jamais** remettre `"id": "./"` dans `manifest.json` : collision PWA avec l'app Dégusto qui partage l'origine `nutrievidence.fr`.
5. **`sw.js` est servi réseau-d'abord** : pas besoin de purger le cache pour tester une nouvelle version.

---

## 5. Ordre de chargement des scripts (`index.html`)

Dépendances → dépendants. Toujours `utils` en premier, `app` en dernier :

```
utils → consent → analytics → rayons → basics_recipes → batch_recipes → firebase-config
  → auth → db → photo-storage → storage → settings → image-loader → sync
  → food-db → nutrition → recipes → menu → shopping → share
  → pizza-engine → bread-engine → batch-engine → batch
  → ui → ui-recipes → ui-recipe-browse → ui-planner → ui-cook → ui-batch → ui-shopping → ui-settings → ui-foods → ui-components → ui-pages
  → install → router → app
```

---

## 6. Commandes de recherche efficaces

```bash
# Trouver une recette
Grep -n "\"tarte-aux-pommes\"" js/basics_recipes.js

# Trouver un aliment nutritionnel
Grep -n "\"pomme\"" data/nutrition-fr.json

# Trouver un style CSS puis lire un extrait ciblé
Grep -n "\.recipe-card" css/styles.css
Read css/styles.css offset:1234 limit:40

# Lister les fonctions d'un module
Grep -n "function |=> {" js/recipes.js
```

---

## 7. Déploiement

- **Prod** = `https://nutrievidence.fr/recettes/` : déploiement **FTP manuel** vers OVH.
- `git push` ne déploie **rien**. Ne jamais promettre à l'utilisateur qu'une modif est en ligne après un commit.

---

## 7 bis. Points sensibles à ne pas casser

- **Rien de non essentiel avant consentement.** Polices auto-hébergées dans `fonts/`, SDK Firebase supprimé, Google Identity chargé à la demande par `Auth.preloadGIS()` / `_waitForGIS()` (`js/auth.js`), gtag.js injecté seulement après acceptation. Toute nouvelle ressource tierce doit passer par `Consent`.
- **`Analytics.pageView` normalise le hash en liste blanche** (`sanitizePath`) : le hash peut contenir une recette compressée (`#partage=…`) ou un terme de recherche (`?q=…`). Ne jamais envoyer un hash brut.
- **Le consentement ne passe PAS par `Settings`** : la clé `settings` est répliquée sur Drive. Utiliser `data-action="toggle-consent"`, jamais `toggle-setting`.
- **`Recipes.create(data, { track })`** : les appelants en boucle (`importRecipes`, `duplicate`) passent `track: false` et posent leur propre événement.
- **L'identifiant GA4** se renseigne dans `MEASUREMENT_ID`, en tête de `js/analytics.js`. Vide = mesure inactive, le reste fonctionne.

---

## 8. Ce fichier lui-même

Si tu ajoutes/supprimes/renommes un fichier `js/*.js`, **mets à jour la table du §2 et l'ordre du §5**. Si tu ajoutes une intention récurrente, ajoute une ligne au §3.
