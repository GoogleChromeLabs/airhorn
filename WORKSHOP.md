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

Last step to get started: You to open the application tab in the chrome inspector and select `Service Worker`. There you'll need to click the checkbox for `update on reload` which foces the browser to update the service worker when we make changes and reload. If you don't do this, you won't see any changes without clearing your cache manually.


## Listen for Fetch Events

Let's combine a service worker with the the `fetch` api to listen for all network requests and log the request before responding with the original network request. in `app/sw.js` add the following:

```
self.addEventListener('fetch', evt => {
  console.log(evt.request);

  evt.respondWith(fetch(evt.request));
});
```

When you refresh the page, check your console and see all the requests. You've inserted middleware into all network requests for assets, data, and even html. That means you can insert a client-side proxy which can modify all network request responses.

You can read more about `fetch` at [MDN/Using Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)


## Prefetch and Cache Assets and HTML

So let's use the the Service Worker to prefetch any assets we specify. Add the following to `app/sw.js`:

```
self.addEventListener('install', evt => {
  evt.waitUntil(
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
  );
});

```
This adds an event listener which will cache a collection of assets when the Service Worker installs. Notice that we're caching `index.html` and `/`. That allows us to cache markup, which we've never been able to do on the web before.

Finally, replace the `fetch` event listener with some code that will attempt to respond with the cache before hitting the network:

```
self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(response => {
      return response || fetch(evt.request);
    })
  );
});
```
If the network is bad or the user is offline, you'll still be able to load the page because the html and all the assets and data are stored in the cache.



## Jump Start Service Worker

By default service workers only activate on the second page load. We can jump start this process. Add this code to `app/sw.js`.

```
self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});
```

This is the last bit of code we need to make the whole thing work offline. In the Chrome Inspector goto `application->service worker` and click `offline`. Now you're simulating being disconnected from the network. Refresh the page and you'll still see your airhorn. That's pretty cool!

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

self.addEventListener('fetch', evt => {
  console.log(evt.request);

  evt.respondWith(
    caches.match(evt.request).then(response => {
      return response || fetch(evt.request);
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


