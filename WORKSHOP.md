## Register a Service Worker

The first step to adding offline support is to register a Service Worker. Eventually we will tell this service worker to watch network requests and respond with data in a cache instead of going to the network.

Before we can do that we want to make sure the browser supports the Service Worker API and then register the Service Worker.

In `app/index.html` add the following script just above the closing `body` tag.

```
<script>
  if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then((registration) => {
        console.info('Service Worker Registered');
      })
      .catch((err) => {
        console.error(err);
      });

    navigator.serviceWorker.ready
      .then((registration) => {
         console.info('Service Worker Ready');
      })
      .catch((err) => {
        console.error(err);
      });
  }
</script>
```


## Listen for Fetch Events

By default service workers only activate on the second page load. We can jump start this process. Add this code to `app/sw.js`.

```
self.addEventListener('install', function(event) {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});
```

If you open the Chrome Inspector and go to the applications tab, you can check on the status of your service worker

Read more about `clients`.claim and `skipWaiting` at [MDN/ServiceWorkerGlobalScope.skipWaiting](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/skipWaiting).


```
self.addEventListener('install', evt => {
  evt.waitUntil(cache
    caches.open('airhorner').then(cache => {
      return cache.addAll([
        `/`,
        `/index.html`,
        `/styles/main.css`,
        `/scripts/main.min.js`,
        `/sounds/airhorn.mp3`
      ])
      .then(() => self.skipWaiting());
    })
  )
});

self.addEventListener('activate',  evt => {
  evt.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
```


## App Manifest

We need an app manifest to tell our browser that this is a progressive web app that can be added to your home screen and run in full screen mode. Create a new file `app/manifest.json` and paste in the following code:

```
{
  "name": "The Air Horner",
  "short_name": "Air Horner",
  "icons": [{
        "src": "images/touch/Airhorner_128.png",
        "type": "image/png",
        "sizes": "128x128"
      }, {
        "src": "images/touch/Airhorner_152.png",
        "type": "image/png",
        "sizes": "152x152"
      }, {
        "src": "images/touch/Airhorner_144.png",
        "type": "image/png",
        "sizes": "144x144"
      }, {
        "src": "images/touch/Airhorner_192.png",
        "type": "image/png",
        "sizes": "192x192"
      },
      {
        "src": "images/touch/Airhorner_256.png",
        "type": "image/png",
        "sizes": "256x256"
      },
      {
        "src": "images/touch/Airhorner_512.png",
        "type": "image/png",
        "sizes": "512x512"
      }],
  "start_url": "/?homescreen=1",
  "scope": "/",
  "display": "standalone",
  "background_color": "#2196F3",
  "theme_color": "#2196F3"
}
```


