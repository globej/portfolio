/**
 * Service worker : le site reste consultable hors ligne.
 * Bumper CACHE à chaque modification de index.html, css/*.css ou js/*.js.
 */
const CACHE = 'portfolio-v16';

const SHELL_CRITICAL = [
  './',
  'index.html',
  'realisations.html',
  'engagement.html',
  'css/styles.css?v=13',
  'js/app.js?v=9'
];

self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(SHELL_CRITICAL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys()
      .then((cles) => Promise.all(
        cles.filter((cle) => cle !== CACHE).map((cle) => caches.delete(cle))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (evt) => {
  const requete = evt.request;

  if (requete.method !== 'GET') return;
  if (new URL(requete.url).origin !== self.location.origin) return;

  /* Navigation : réseau d'abord, la page en cache sert de filet.
     On garde chaque page sous sa propre URL, sinon la dernière navigation
     écrase l'index. */
  if (requete.mode === 'navigate') {
    evt.respondWith(
      fetch(requete)
        .then((reponse) => {
          const copie = reponse.clone();
          caches.open(CACHE).then((cache) => cache.put(requete, copie));
          return reponse;
        })
        .catch(() =>
          caches.match(requete).then(
            (r) => r || caches.match('index.html').then((i) => i || caches.match('./'))
          )
        )
    );
    return;
  }

  /* Ressources du shell : cache d'abord, mise à jour en arrière-plan */
  evt.respondWith(
    caches.match(requete).then((enCache) => {
      const reseau = fetch(requete)
        .then((reponse) => {
          if (reponse && reponse.status === 200 && reponse.type === 'basic') {
            const copie = reponse.clone();
            caches.open(CACHE).then((cache) => cache.put(requete, copie));
          }
          return reponse;
        })
        .catch(() => enCache);

      return enCache || reseau;
    })
  );
});
