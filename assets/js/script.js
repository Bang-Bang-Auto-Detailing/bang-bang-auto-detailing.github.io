function toHash(str) {
  var hash = 5381, i = str.length;
  while (i) {
    hash = hash * 33 ^ str.charCodeAt(--i)
  }
  return hash >>> 0
}

(function (global) {
  //const cacheKey = global.cacheKey;
  const isOffline = 'onLine' in navigator && navigator.onLine === false;
  const hasServiceWorkerSupport = 'serviceWorker' in navigator;
  if (isOffline) {
    console.log('offline mode');
  }
  if (!hasServiceWorkerSupport) {
    console.log('service worker is not supported');
  }
  if (hasServiceWorkerSupport && !isOffline) {
    window.addEventListener('load', function () {
      const serviceWorkerPath = '/runtime-service-worker.js?v=3';
      navigator.serviceWorker
        .register(serviceWorkerPath, { scope: './' })
        .then(
          function (registration) {
            // Registration was successful
            console.log(
              'ServiceWorker registration successful with scope: ',
              registration.scope
            );
          },
          function (err) {
            // registration failed :(
            console.log('ServiceWorker registration failed: ', err);
          }
        )
        .catch(function (err) {
          console.log(err);
        });
    });
    // helper function to refresh the page
    var refreshPage = (function () {
      var refreshing;
      return function () {
        if (refreshing) return;
        // prevent multiple refreshes
        var refreshkey = 'refreshed' + location.href;
        var prevRefresh = localStorage.getItem(refreshkey);
        if (prevRefresh) {
          localStorage.removeItem(refreshkey);
          if (Date.now() - prevRefresh < 30000) {
            return; // dont go into a refresh loop
          }
        }
        refreshing = true;
        localStorage.setItem(refreshkey, Date.now());
        console.log('refereshing page');
        window.location.reload();
      };
    })();
    function messageServiceWorker(data) {
      return new Promise(function (resolve, reject) {
        if (navigator.serviceWorker.controller) {
          var worker = navigator.serviceWorker.controller;
          var messageChannel = new MessageChannel();
          messageChannel.port1.onmessage = replyHandler;
          worker.postMessage(data, [messageChannel.port2]);
          function replyHandler(event) {
            resolve(event.data);
          }
        } else {
          resolve();
        }
      });
    }
  }
})(window);
