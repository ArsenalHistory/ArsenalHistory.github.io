importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js');

workbox.routing.registerRoute(
  /\.(?:js|css)$/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'static-resources',
  }),
);

// Cache the Google Fonts stylesheets with a stale while revalidate strategy.
workbox.routing.registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'google-fonts-stylesheets',
  }),
);

// Cache the Google Fonts webfont files with a cache first strategy for 1 year.
workbox.routing.registerRoute(
  /^https:\/\/fonts\.gstatic\.com/,
  workbox.strategies.cacheFirst({
    cacheName: 'google-fonts-webfonts',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 30,
      }),
    ],
  }),
);

const postHandler = workbox.strategies.cacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new workbox.expiration.Plugin({
      maxEntries: 300,
    })
  ]
});

workbox.routing.registerRoute(/.*/, args => {
  return postHandler.handle(args).then(response => {
    if (response.status === 404) {
      return caches.match('pages/404.html');
    }
    return response;
  })
  .catch(function() {
    return caches.match('pages/offline.html');
  });
});

self.addEventListener('message', event => {
  console.log(event);
});