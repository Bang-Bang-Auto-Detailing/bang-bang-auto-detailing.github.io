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

  const drawer = document.getElementById('hamburger-drawer');
  const drawerIsOpen = () => drawer.hasAttribute('open');

  Array.from(document.getElementsByClassName('hamburgerButton')).map(e => e.addEventListener('click', () => {
    if (drawerIsOpen()) {
      drawer
        .removeAttribute('style');
      drawer
        .removeAttribute('open');
    }
    else {
      drawer
        .setAttribute('style', 'height: calc(100% + 0px)');
      drawer
        .setAttribute('open', '');
    }
  }));


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

  const accordion_sub  = document.getElementById('9978dd62');

  if (accordion_sub) {
    const accordion_sub_li = [...accordion_sub.querySelectorAll('li')];
    accordion_sub_li.map(i => i.addEventListener('click', e => {
        const allSiblings = accordion_sub_li.filter(sibling => sibling !== e.currentTarget);
        allSiblings.map(s => {
          const item = s.querySelector('.accordion-item');
          item.classList.remove('kbVQzr');
          item.classList.add('dygwmn');
        });

        const items = e.currentTarget.querySelector('.accordion-item');
        items.classList.toggle('dygwmn');
        items.classList.toggle('kbVQzr');
    }));
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
