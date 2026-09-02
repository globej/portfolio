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
     domaines[] (pour filtres futurs), vedette (bool, apparaît sur la home),
     ordre (nombre, tri du plus grand au plus petit), statut ('brouillon' ou null). */

  const PROJETS = [
    {
      id: 'recettes',
      ordre: 2024,
      vedette: true,
      titre: 'Recettes, planning et batch cooking',
      resume:
        "Application de cuisine qui fonctionne entièrement hors ligne : recettes, planning " +
        "hebdomadaire, liste de courses agrégée par rayon, et ordonnancement d'une session de " +
        "batch cooking sur les contraintes réelles de four, de plaques et de place au frigo.",
      role: 'Conception et développement',
      periode: "2024 à aujourd'hui",
      stack: 'JS natif, IndexedDB, service worker, OAuth2',
      dependances: '0, aucune étape de build',
      detail:
        "Les données vivent sur l'appareil. La synchronisation vers Google Drive est optionnelle " +
        "et réconcilie les deux côtés au lieu d'écraser. Rien de tiers ne se charge avant le " +
        "consentement : polices auto-hébergées, aucun SDK au démarrage.",
      lien: { href: 'https://nutrievidence.fr/recettes/', libelle: "Voir l'application" },
      domaines: ['metier', 'vitrine']
    },
    {
      id: 'brouillon-1',
      ordre: 0,
      vedette: true,
      statut: 'brouillon',
      titre: '[Nom du projet]',
      resume:
        "[Deux phrases : le problème concret du client, et ce que l'application fait pour le " +
        "résoudre. Pas d'adjectif, un chiffre si possible.]",
      role: '[votre rôle]',
      periode: '[année]',
      stack: '[technologies]',
      resultat: '[mesure vérifiable]'
    },
    {
      id: 'brouillon-2',
      ordre: -1,
      vedette: false,
      statut: 'brouillon',
      titre: '[Nom du projet]',
      resume:
        "[Choisir un projet qui montre une compétence absente de la fiche précédente : " +
        "volumétrie, temps réel, reprise d'un système existant.]",
      role: '[votre rôle]',
      periode: '[année]',
      stack: '[technologies]',
      resultat: '[mesure vérifiable]'
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
      const brouillon = projet.statut === 'brouillon';
      const parties = [];

      parties.push('<article class="fiche' + (brouillon ? ' fiche--brouillon' : '') + '">');
      if (brouillon) parties.push('<p class="fiche__statut">Fiche à compléter</p>');
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
