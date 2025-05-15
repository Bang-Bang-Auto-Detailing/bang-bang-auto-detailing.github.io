function toHash(str) {
  var hash = 5381, i = str.length;
  while (i) {
    hash = hash * 33 ^ str.charCodeAt(--i)
  }
  return hash >>> 0
}

(function (global) {
  const lightbox = new PhotoSwipeLightbox({
    gallery: '#group_vod',
    children: 'a',
    pswpModule: PhotoSwipe
  });

  lightbox.init();

  const overlay = document.getElementById('flex-popup-overlay');
  const popup = document.getElementById('flex-runtime-popup-container');

  document.getElementById('message_us')?.addEventListener('click', e => {
    e.stopPropagation();
    overlay.classList.add('show');
    popup.classList.add('show');
  });
  document.getElementById('1355381865')?.addEventListener('click', e => {
    e.stopPropagation();
    overlay.classList.remove('show');
    popup.classList.remove('show');
    [...document.getElementById('widget_nmk').querySelectorAll("input[type=text],input[type=tel]")].map(i => i.value = '')
  });

  const accordion = document.getElementById('widget_7d7');

  if (accordion) {
    [...accordion.querySelectorAll('li')].map(i => i.addEventListener('click', e => {
        const vertical = e.currentTarget.querySelector('.vertical');
        vertical.classList.toggle('eyQoqK');
        vertical.classList.toggle('kEBKQa');
        const horizontal = e.currentTarget.querySelector('.horizontal');
        horizontal.classList.toggle('jxwvWq');
        horizontal.classList.toggle('eODSZX');
        const content = e.currentTarget.querySelector('.item-content');
        content.classList.toggle('dygwmn');
        content.classList.toggle('cCuScM');
    }));
  }

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

/* usage: window.getDeferred(<deferred name>).resolve() or window.getDeferred(<deferred name>).promise.then(...)*/
function Def() {
  this.promise = new Promise((function (a, b) {
    this.resolve = a, this.reject = b
  }).bind(this))
}
const defs = {};
window.getDeferred = function (a) {
  return null == defs[a] && (defs[a] = new Def), defs[a]
}
window.waitForDeferred = function (b, a, c) {
  let d = window?.getDeferred?.(b);
  d
    ? d.promise.then(a)
    : c && ["complete", "interactive"].includes(document.readyState)
      ? setTimeout(a, 1)
      : c
        ? document.addEventListener("DOMContentLoaded", a)
        : console.error(`Deferred  does not exist`);
};
