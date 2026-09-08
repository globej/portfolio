/**
 * App : comportements de la page.
 * Le contenu reste complet sans JavaScript, tout ici est une amélioration.
 */
const App = (() => {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const $$ = (sel) => Array.prototype.slice.call(document.querySelectorAll(sel));

  const mouvementReduit = () =>
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const LIBELLES = {
    metier: "l'application métier",
    vitrine: 'le site vitrine',
    ecommerce: "l'e-commerce",
    mobile: 'le mobile',
    ia: 'un projet où intervient une IA'
  };

  /* Réalisations : source unique, consommée par la home et par realisations.html
     Ajouter un projet ici, il apparaît partout où il doit apparaître.
     Champs : id, titre, resume, role, periode, stack, dependances (ou resultat),
     detail (paragraphe libre affiché après le relevé), lien {href, libelle},
     domaines[] (alimente le filtre de realisations.html), vedette (bool, apparaît
     sur la home), ordre (nombre, tri du plus grand au plus petit). */

  const PROJETS = [
    {
      id: 'faitou',
      ordre: 110,
      vedette: true,
      titre: 'Faitou, carnet de recettes et batch cooking',
      resume:
        "Application de cuisine qui fonctionne entièrement hors ligne : recettes, planning " +
        "hebdomadaire, liste de courses agrégée par rayon, et ordonnancement d'une session de " +
        "batch cooking sur les contraintes réelles de four, de plaques et de place au frigo.",
      role: 'Conception et développement',
      periode: "2024 à aujourd'hui",
      stack: 'JS natif, IndexedDB, service worker, Supabase (Postgres, RLS, Realtime)',
      dependances: '1 SDK auto-hébergé, aucune étape de build',
      detail:
        "L'ordonnanceur sépare le temps de travail actif du temps de cuisson pour combler les " +
        "attentes, puis répartit les plats entre frigo et congélateur. Les données vivent sur " +
        "l'appareil, le compte et la synchronisation restent optionnels, et la politique de " +
        "sécurité interdit tout script écrit dans la page.",
      lien: { href: 'https://faitou.fr/', libelle: "Voir l'application" },
      domaines: ['metier', 'mobile']
    },
    {
      id: 'dataclean-x',
      ordre: 100,
      vedette: true,
      titre: 'DataClean-X, mise en conformité Factur-X de catalogues',
      resume:
        "Les catalogues produits arrivent en CSV ou en Excel, avec des unités, des prix et des " +
        "taux de TVA écrits de vingt façons. L'application les rattache aux champs Factur-X, " +
        "les normalise, signale les lignes invalides et les réexporte.",
      role: 'Conception et développement',
      periode: '2026',
      stack: 'Next.js 15, Supabase, Stripe, AG Grid',
      resultat: 'API REST publique, 5 000 lignes par requête, 60 requêtes par minute et par clé',
      detail:
        "Les modèles de correspondance de colonnes se réutilisent d'un fichier à l'autre. La " +
        "correction des lignes en erreur peut passer par un modèle de langage hébergé en " +
        "Europe, en option. La purge des données de fichiers est planifiée côté base.",
      domaines: ['metier', 'ecommerce', 'ia']
    },
    {
      id: 'sobre',
      ordre: 90,
      vedette: true,
      titre: 'Sobre, lanceur Android',
      resume:
        "Lanceur Android orienté texte qui pose une friction volontaire devant les applications " +
        "qu'on ouvre par réflexe : quota de session à choisir, intention à écrire avant " +
        "l'ouverture, pause respiratoire quand le quota est épuisé.",
      role: 'Conception et développement',
      periode: '2026, en cours',
      stack: 'Kotlin, Jetpack Compose, Hilt, Room, DataStore',
      resultat: "Tout reste sur l'appareil, aucun SDK de mesure",
      detail:
        "Le blocage de sites lit la barre d'adresse du navigateur par le service " +
        "d'accessibilité : pas de VPN, pas de proxy DNS, aucun serveur. Les statistiques de " +
        "temps d'écran sont factuelles, sans objectif imposé ni jugement.",
      domaines: ['mobile']
    },
    {
      id: 'nutrievidence',
      ordre: 80,
      vedette: false,
      titre: 'Nutrievidence, application bilingue',
      resume:
        "Application web en français et en anglais, adossée à une base Postgres où chaque table " +
        "porte ses propres règles d'accès. Le schéma vit dans des migrations versionnées, " +
        "rejouables à l'identique en local et en production.",
      role: 'Conception et développement',
      periode: '2026, en cours',
      stack: 'Next.js (App Router), Supabase, next-intl, Vercel',
      resultat: 'Environnement de développement complet en une commande',
      domaines: ['metier', 'vitrine']
    },
    {
      id: 'moniteur-laitier',
      ordre: 70,
      vedette: false,
      titre: 'Moniteur du marché laitier européen',
      resume:
        "Tableau de bord qui rassemble au même endroit les prix des produits laitiers, le prix " +
        "du lait cru payé aux producteurs, les volumes de collecte, les contrats à terme et " +
        "l'actualité de la filière.",
      role: 'Conception et développement',
      periode: '2026',
      stack: 'Node.js, Express, Chart.js',
      resultat: 'Sept sources agrégées, prix ramenés à une unité commune',
      detail:
        "Les sources publiques n'autorisent pas l'appel direct depuis le navigateur et ne " +
        "garantissent aucune disponibilité. Un cache à durée de vie, écrit sur disque, sert la " +
        "dernière version connue en la signalant comme périmée, plutôt qu'une page vide quand " +
        "une source tombe.",
      domaines: ['metier']
    },
    {
      id: 'serviprospect',
      ordre: 60,
      vedette: false,
      titre: "ServiProspect, recherche d'entreprises",
      resume:
        "Outil de prospection qui interroge la base SIRENE par l'API publique de l'État : " +
        "recherche libre, filtres par code NAF, commune, département, effectif et forme " +
        "juridique, puis export de la sélection.",
      role: 'Conception et développement',
      periode: '2026',
      stack: "JS natif, API Recherche d'entreprises",
      dependances: '3 fichiers, aucune étape de build',
      detail:
        "Deux aides de saisie évitent d'avoir à connaître la nomenclature : la recherche d'un " +
        "code NAF à partir de mots d'activité, et l'autocomplétion des codes postaux. L'export " +
        "sort en CSV ou dans un format directement importable dans Notion.",
      domaines: ['metier']
    },
    {
      id: 'servibeurre',
      ordre: 50,
      vedette: false,
      titre: 'Servibeurre, site vitrine',
      resume:
        "Site d'un négoce de beurre : présentation, fiche produit, fil d'actualités et " +
        "formulaire de contact. Pages statiques, en-têtes de sécurité posés au niveau du " +
        "serveur, mise en ligne comprise.",
      role: 'Conception, développement et mise en ligne',
      periode: '2025 à 2026',
      stack: 'HTML, CSS, JS, esbuild, PHP pour le formulaire',
      resultat: 'Plan de site, robots.txt et balises de partage en place',
      lien: { href: 'https://servibeurre.fr/', libelle: 'Voir le site' },
      domaines: ['vitrine']
    },
    {
      id: 'marie-nawrot',
      ordre: 40,
      vedette: false,
      titre: 'Marie Nawrot, assistante virtuelle',
      resume:
        "Site vitrine de douze pages pour une assistante indépendante spécialisée dans " +
        "l'immobilier. Quatre offres, un questionnaire qui oriente vers la bonne, un " +
        "calculateur de temps et de coût, un comparateur d'abonnements.",
      role: 'Direction artistique et développement',
      periode: '2026',
      stack: 'HTML, CSS, JS natif, données structurées JSON-LD',
      dependances: '0, aucune étape de build',
      detail:
        "Bascule clair et sombre mémorisée, sans éclair de couleur au chargement. La " +
        "préférence de mouvement réduit neutralise l'ensemble des animations, bandeau " +
        "défilant et révélations au défilement compris.",
      domaines: ['vitrine']
    },
    {
      id: 'concretedev',
      ordre: 30,
      vedette: false,
      titre: 'ConcreteDev, site vitrine et études de cas',
      resume:
        "Site de treize pages avec six études de cas, ciblage géographique, balisage structuré " +
        "complet et formulaire sans serveur applicatif. Livré comme une trame documentée dont " +
        "les contenus de projets restent à remplacer par des cas réels.",
      role: 'Conception et développement',
      periode: '2026',
      stack: 'HTML, CSS, JS natif, polices auto-hébergées',
      dependances: '0, aucune étape de build',
      domaines: ['vitrine']
    },
    {
      id: 'degusto',
      ordre: 20,
      vedette: false,
      titre: 'Dégusto, carnet de dégustation',
      resume:
        "Carnet de dégustation installable, utilisable hors ligne. L'intérêt n'est pas le " +
        "formulaire mais son moteur : les catégories, les types de champs et l'affichage des " +
        "fiches sont décrits par des schémas, pas écrits un par un.",
      role: 'Conception et développement',
      periode: '2026',
      stack: 'Modules ES natifs, IndexedDB, service worker, OAuth2',
      dependances: '0, aucune étape de build',
      detail:
        "Ajouter une catégorie revient à décrire ses champs, sans écrire de vue. Les photos " +
        "sont redimensionnées dans le navigateur, et la sauvegarde va dans l'espace applicatif " +
        "privé du compte Drive de la personne, jamais sur un serveur intermédiaire.",
      domaines: ['mobile', 'metier']
    },
    {
      id: 'library-save-merger',
      ordre: 10,
      vedette: false,
      titre: 'Fusion de sauvegardes JW Library',
      resume:
        "Deux appareils, deux sauvegardes, des notes et des surlignages qui divergent. L'outil " +
        "ouvre les deux archives, fusionne les bases SQLite qu'elles contiennent et laisse " +
        "choisir la résolution pour chaque type de conflit, au lieu de garder la plus récente " +
        "et de perdre le reste.",
      role: 'Conception et développement',
      periode: '2026',
      stack: 'JS natif, JSZip, sql.js en WebAssembly',
      dependances: "0, aucun fichier n'est envoyé à un serveur",
      detail:
        "Tout le traitement a lieu dans le navigateur : décompression de l'archive, lecture de " +
        "la base, fusion signet par signet et note par note, puis recompression. Interface en " +
        "français et en anglais.",
      domaines: ['metier']
    }
  ];

  /* Rendu des fiches, mêmes classes que le HTML statique de secours ---------- */

  function rendreFiches(cible, projets) {
    if (!cible) return;

    const echapper = (s) => {
      const div = document.createElement('div');
      div.textContent = s == null ? '' : String(s);
      return div.innerHTML;
    };

    const releve = (projet) => {
      const paires = [
        ['Rôle', projet.role],
        ['Période', projet.periode],
        ['Stack', projet.stack]
      ];
      if (projet.dependances) paires.push(['Dépendances', projet.dependances]);
      else if (projet.resultat) paires.push(['Résultat', projet.resultat]);
      return (
        '<dl class="fiche__releve">' +
        paires
          .map(
            (p) =>
              '<div><dt>' + echapper(p[0]) + '</dt><dd>' + echapper(p[1] || '') + '</dd></div>'
          )
          .join('') +
        '</dl>'
      );
    };

    const fiche = (projet) => {
      const parties = [];

      parties.push(
        '<article class="fiche" data-domaines="' +
          echapper((projet.domaines || []).join(' ')) +
          '">'
      );
      parties.push('<h3 class="fiche__titre">' + echapper(projet.titre) + '</h3>');
      parties.push('<p class="fiche__resume">' + echapper(projet.resume) + '</p>');
      parties.push(releve(projet));
      if (projet.detail) parties.push('<p>' + echapper(projet.detail) + '</p>');
      if (projet.lien && projet.lien.href) {
        parties.push(
          '<p><a class="lien-externe" href="' +
            echapper(projet.lien.href) +
            '" rel="noopener">' +
            echapper(projet.lien.libelle || 'Voir') +
            '</a></p>'
        );
      }
      parties.push('</article>');
      return parties.join('');
    };

    cible.innerHTML = projets.map(fiche).join('');
  }

  function injecterFiches() {
    const vedettes = $('fiches-vedettes');
    if (vedettes) {
      rendreFiches(
        vedettes,
        PROJETS.filter((p) => p.vedette).sort((a, b) => (b.ordre || 0) - (a.ordre || 0)).slice(0, 3)
      );
    }

    const toutes = $('fiches-toutes');
    if (toutes) {
      rendreFiches(
        toutes,
        PROJETS.slice().sort((a, b) => (b.ordre || 0) - (a.ordre || 0))
      );
    }
  }

  /* Filtre des fiches par domaine (page Réalisations) ----------------------- */

  function filtrerFiches() {
    const groupe = $('filtre-fiches');
    const liste = $('fiches-toutes');
    const decompte = $('decompte-fiches');
    if (!groupe || !liste || !decompte) return;

    const segments = $$('#filtre-fiches .segment');
    const fiches = $$('#fiches-toutes .fiche');
    const total = fiches.length;
    if (!total) return;

    groupe.hidden = false;

    /* Message d'état vide : posé une fois, montré seulement quand rien ne reste */
    const vide = document.createElement('p');
    vide.className = 'fiche__statut';
    vide.hidden = true;
    liste.appendChild(vide);

    const appliquer = (domaine) => {
      let retenus = 0;

      fiches.forEach((fiche) => {
        const domaines = (fiche.dataset.domaines || '').split(' ');
        const dedans = domaine === 'tous' || domaines.indexOf(domaine) !== -1;
        fiche.hidden = !dedans;
        if (dedans) retenus += 1;
      });

      segments.forEach((segment) => {
        segment.setAttribute('aria-pressed', String(segment.dataset.domaine === domaine));
      });

      vide.hidden = retenus !== 0;
      if (retenus === 0) {
        vide.textContent =
          'Aucune réalisation ne concerne ' + LIBELLES[domaine] +
          '. Choisissez Tous pour revenir à la liste.';
      }

      if (domaine === 'tous') {
        decompte.textContent = total + ' réalisations, tous domaines confondus.';
      } else if (retenus === 0) {
        decompte.textContent = 'Aucune réalisation ne concerne ce domaine.';
      } else if (retenus === 1) {
        decompte.textContent = '1 réalisation sur ' + total + ' concerne ' + LIBELLES[domaine] + '.';
      } else {
        decompte.textContent =
          retenus + ' réalisations sur ' + total + ' concernent ' + LIBELLES[domaine] + '.';
      }
    };

    segments.forEach((segment) => {
      segment.addEventListener('click', () => appliquer(segment.dataset.domaine));
    });

    appliquer('tous');
  }

  /* Thème : clair par défaut, sombre au choix, mémorisé par appareil -------- */

  const CLE_THEME = 'portfolio-theme';
  const COULEUR_BARRE = { clair: '#EEF1EF', sombre: '#0B1418' };

  function basculerTheme() {
    const bouton = $('bascule-theme');
    const libelle = $('bascule-libelle');
    const meta = $('couleur-theme');
    if (!bouton) return;

    const themeCourant = () =>
      document.documentElement.dataset.theme === 'sombre' ? 'sombre' : 'clair';

    const appliquer = (theme, memoriser) => {
      if (theme === 'sombre') {
        document.documentElement.dataset.theme = 'sombre';
      } else {
        delete document.documentElement.dataset.theme;
      }

      bouton.setAttribute('aria-pressed', String(theme === 'sombre'));

      /* Le libellé annonce l'action, pas l'état */
      if (libelle) {
        libelle.textContent =
          theme === 'sombre' ? 'Passer en thème clair' : 'Passer en thème sombre';
      }

      if (meta) meta.setAttribute('content', COULEUR_BARRE[theme]);

      if (memoriser) {
        try { localStorage.setItem(CLE_THEME, theme); } catch (e) {}
      }
    };

    appliquer(themeCourant(), false);

    bouton.addEventListener('click', () => {
      appliquer(themeCourant() === 'sombre' ? 'clair' : 'sombre', true);
    });
  }

  /* Liste de contrôle : filtre par domaine ---------------------------------- */

  function filtrerControles() {
    const groupe = $('filtre');
    const liste = $('controles');
    const decompte = $('decompte');
    if (!groupe || !liste || !decompte) return;

    const segments = $$('#filtre .segment');
    const points = Array.prototype.slice.call(liste.children);
    const total = points.length;

    const appliquer = (domaine) => {
      let retenus = 0;

      points.forEach((point) => {
        const domaines = (point.dataset.domaines || '').split(' ');
        const dedans = domaine === 'tous' || domaines.indexOf(domaine) !== -1;
        point.dataset.hors = dedans ? 'non' : 'oui';
        if (dedans) retenus += 1;
      });

      segments.forEach((segment) => {
        segment.setAttribute('aria-pressed', String(segment.dataset.domaine === domaine));
      });

      if (domaine === 'tous') {
        decompte.textContent = total + ' points, tous domaines confondus.';
      } else if (retenus === 0) {
        decompte.textContent = 'Aucun point ne concerne ce domaine.';
      } else {
        decompte.textContent =
          retenus + ' points sur ' + total + ' concernent ' + LIBELLES[domaine] + '.';
      }
    };

    segments.forEach((segment) => {
      segment.addEventListener('click', () => appliquer(segment.dataset.domaine));
    });

    appliquer('tous');
  }

  /* Reflet spéculaire sur le verre ------------------------------------------ */

  function refletSpeculaire() {
    if (mouvementReduit()) return;
    if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return;

    const pieces = $$('.verre');
    let enAttente = false;

    pieces.forEach((piece) => {
      piece.addEventListener('pointermove', (evt) => {
        if (enAttente) return;
        enAttente = true;

        window.requestAnimationFrame(() => {
          const boite = piece.getBoundingClientRect();
          const x = ((evt.clientX - boite.left) / boite.width) * 100;
          const y = ((evt.clientY - boite.top) / boite.height) * 100;
          piece.style.setProperty('--sx', x.toFixed(1) + '%');
          piece.style.setProperty('--sy', y.toFixed(1) + '%');
          enAttente = false;
        });
      });
    });
  }

  /* Capsule : contraction au défilement, bouton de retour ------------------- */

  function suivreDefilement() {
    const capsule = $('capsule');
    const retour = $('retour');
    let enAttente = false;

    const rendre = () => {
      const y = window.pageYOffset || document.documentElement.scrollTop;
      if (capsule) capsule.dataset.compact = y > 48 ? 'true' : 'false';
      if (retour) retour.hidden = y < 900;
      enAttente = false;
    };

    window.addEventListener('scroll', () => {
      if (enAttente) return;
      enAttente = true;
      window.requestAnimationFrame(rendre);
    }, { passive: true });

    rendre();

    if (retour) {
      retour.addEventListener('click', () => {
        const doux = mouvementReduit() ? 'auto' : 'smooth';
        window.scrollTo({ top: 0, behavior: doux });
        const premier = document.querySelector('.capsule__nom');
        if (premier) premier.focus({ preventScroll: true });
      });
    }
  }

  /* Section courante dans la capsule ---------------------------------------- */

  function suivreSections() {
    const liens = $$('.capsule__liens a[href^="#"]');
    if (!liens.length || !('IntersectionObserver' in window)) return;

    const parId = {};
    const cibles = [];

    liens.forEach((lien) => {
      const section = document.getElementById(lien.hash.slice(1));
      if (!section) return;
      parId[section.id] = lien;
      cibles.push(section);
    });

    /* On garde la liste des sections traversées : en haut de page, aucune n'est courante */
    const traversees = new Set();

    const observateur = new IntersectionObserver((entrees) => {
      entrees.forEach((entree) => {
        if (entree.isIntersecting) traversees.add(entree.target.id);
        else traversees.delete(entree.target.id);
      });

      liens.forEach((l) => l.removeAttribute('aria-current'));

      const courante = cibles.filter((cible) => traversees.has(cible.id))[0];
      if (courante) parId[courante.id].setAttribute('aria-current', 'true');
    }, { rootMargin: '-40% 0px -55% 0px' });

    cibles.forEach((cible) => observateur.observe(cible));
  }

  /* Copie de l'adresse ------------------------------------------------------ */

  function copierAdresse() {
    const bouton = $('copier-email');
    const statut = $('statut-copie');
    if (!bouton || !statut) return;

    const secours = (texte) => {
      const champ = document.createElement('textarea');
      champ.value = texte;
      champ.setAttribute('readonly', '');
      champ.style.position = 'fixed';
      champ.style.opacity = '0';
      document.body.appendChild(champ);
      champ.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(champ);
      return ok;
    };

    const annoncer = (texte) => {
      statut.textContent = texte;
      window.setTimeout(() => { statut.textContent = ''; }, 4000);
    };

    bouton.addEventListener('click', () => {
      const adresse = bouton.dataset.email || '';
      const reussi = () => annoncer('Adresse copiée.');
      const echoue = () => annoncer("Copie impossible, sélectionnez l'adresse et copiez-la à la main.");

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(adresse).then(reussi, () => {
          if (secours(adresse)) reussi(); else echoue();
        });
        return;
      }

      if (secours(adresse)) reussi(); else echoue();
    });
  }

  /* Divers ------------------------------------------------------------------ */

  function afficherAnnee() {
    const champ = $('pied-annee');
    if (champ) champ.textContent = String(new Date().getFullYear()) + '.';
  }

  function enregistrerServiceWorker() {
    if (location.protocol === 'file:') return;
    if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }

  function init() {
    basculerTheme();
    injecterFiches();
    filtrerFiches();
    filtrerControles();
    refletSpeculaire();
    suivreDefilement();
    suivreSections();
    copierAdresse();
    afficherAnnee();
    enregistrerServiceWorker();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { init };
})();
