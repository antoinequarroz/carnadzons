// Runs before the body is painted. A fresh direct visit has no curtain.
(() => {
  const root = document.documentElement;
  const key = 'carnadzons:temple-navigation';
  try {
    const raw = sessionStorage.getItem(key);
    sessionStorage.removeItem(key);
    if (!raw || matchMedia('(prefers-reduced-motion: reduce)').matches || !Element.prototype.animate) return;
    const next = JSON.parse(raw);
    if (next.href !== location.href || next.expires < Date.now()) return;
    root.dataset.templeTransition = 'closed';
    root.setAttribute('data-temple-entry', '');
    // Also releases the page if the deferred controller fails to load.
    window.setTimeout(() => {
      if (root.hasAttribute('data-temple-entry')) {
        delete root.dataset.templeTransition;
        root.removeAttribute('data-temple-entry');
      }
    }, 1800);
  } catch { /* Storage can be unavailable in privacy modes. */ }
})();
