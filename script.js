// Loads shared core logic without changing HTML across all pages.
(function () {
  function start() {
    if (!window.SiteCore || typeof window.SiteCore.init !== 'function') return;
    window.SiteCore.init({
      random: {
        objectsUrl: 'data/objects.json',
        basePrefix: '',
        type: null
      }
    });
  }

  if (window.SiteCore) {
    start();
    return;
  }

  const s = document.createElement('script');
  s.src = 'assets/js/site-core.js';
  s.onload = start;
  document.head.appendChild(s);
})();
