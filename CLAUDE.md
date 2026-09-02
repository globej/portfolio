# CLAUDE.md

@AGENTS.md
@AGENTS-design.md


## Contrat (non-négociable)

| Règle | Détail |
|---|---|
| Périmètre | Ne modifie que les fichiers dans `/src/` et `/tests/`, sauf demande explicite |
| Tests | Lance `<commande de test>` avant de considérer une tâche terminée |
| Build | `<commande de build>` |
| Style | Suit les conventions déjà présentes dans le fichier édité, ne les réinvente pas |
| Commits | Ne commit/push jamais sans confirmation explicite |

## Discipline de contexte

- **Explore via sub-agents.** Pour toute recherche dans la codebase (comprendre une fonctionnalité, localiser du code, faire un état des lieux), utilise un sub-agent plutôt que de lire massivement des fichiers dans la session principale. Il rapporte un résumé, pas le contenu brut.
- **Charge le minimum nécessaire.** Lis un fichier précis plutôt qu'un dossier entier. Ne relis pas un fichier déjà vu dans la session sauf s'il a pu changer.
- **Une question isolée → `/btw`.** Si la réponse n'a pas besoin de rester en mémoire pour la suite, ne la fais pas entrer dans l'historique de conversation.
- **Une tâche = une session.** Pour un nouveau sujet sans rapport avec la conversation en cours, ouvre une nouvelle session plutôt que de continuer sur un contexte déjà chargé.
- **Compaction.** Lors d'un `/compact`, préserve toujours : la liste des fichiers modifiés, les commandes de test à relancer, et les décisions d'architecture prises. Résume le reste.

## Comportement attendu

- Avant de coder : si la tâche touche une zone du projet non couverte par ce fichier, vérifie s'il existe une règle plus spécifique dans `.claude/rules/` pour ce chemin.
- Préfère des changements petits et vérifiables à un gros diff monolithique.
- En cas d'ambiguïté sur une décision d'architecture, demande plutôt que de supposer.
- N'installe pas de nouvelle dépendance sans le signaler explicitement.

## Style d'écriture

- **Jamais de mention "généré par IA", "généré par Claude" ou équivalent** dans le code, les commentaires, les commits, les README ou tout contenu produit.
- **Jamais de tiret cadratin `—` ni demi-cadratin `–`** dans les textes visibles, les commentaires, ni les messages de commit. Utiliser `,` `:` `(...)` ou une phrase courte. S'applique aux HTML, JS, CSS, MD et à tout message de commit ou de PR.

## Ce qui ne va PAS ici

- Les secrets, clés API, tokens → `.env` (jamais commité)
- Les explications longues ou le contexte historique d'une décision → fichier dédié dans `docs/`, référencé au besoin via `@docs/xxx.md`
- Les règles valables seulement pour une partie du repo → `.claude/rules/<nom>.md` avec un frontmatter `paths:` pour qu'elles ne chargent que si pertinent