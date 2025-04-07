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

window.SystemID = 'US_DIRECT_PRODUCTION';
if (!window.dmAPI) {
  window.dmAPI = {
    registerExternalRuntimeComponent: function () {
    },
    getCurrentDeviceType: function () {
      return window._currentDevice;
    },
    runOnReady: (ns, fn) => {
      const safeFn = dmAPI.toSafeFn(fn);
      ns = ns || 'global_' + Math.random().toString(36).slice(2, 11);
      const eventName = 'afterAjax.' + ns;
      if (document.readyState === 'complete') {
        $.DM.events.off(eventName).on(eventName, safeFn);
        setTimeout(function () {
          safeFn({
            isAjax: false,
          });
        }, 0);
      } else {
        window?.waitForDeferred?.('dmAjax', () => {
          $.DM.events.off(eventName).on(eventName, safeFn);
          safeFn({
            isAjax: false,
          });
        });
      }
    },
    toSafeFn: (fn) => {
      if (fn?.safe) {
        return fn;
      }
      const safeFn = function (...args) {
        try {
          return fn?.apply(null, args);
        } catch (e) {
          console.log('function failed ' + e.message);
        }
      };
      safeFn.safe = true;
      return safeFn;
    }
  };
}
if (!window.requestIdleCallback) {
  window.requestIdleCallback = function (fn) {
    setTimeout(fn, 0);
  }
}
