(() => {
  const portal = document.querySelector('.page-transition');
  if (!portal) return;
  const root = document.documentElement;
  root.removeAttribute('data-temple-entry');
  const leaves = [...portal.querySelectorAll('.temple-leaf')];
  const key = 'carnadzons:temple-navigation';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const routes = new Set(['/', '/entree-egypte', '/histoire', '/edition', '/carna_enfant', '/faqs', '/contact', '/char', '/comite']);
  const canonicalPath = path => path.replace(/\/index\.html$/, '/').replace(/\.html$/, '').replace(/\/$/, '') || '/';
  const open = ['rotateY(-102deg)', 'rotateY(102deg)'];
  let animations = [];
  let navigating = false;
  let navigationIssued = false;
  let safetyTimer;
  const styles = getComputedStyle(root);
  const ease = styles.getPropertyValue('--ease-in-out').trim() || 'cubic-bezier(.77,0,.175,1)';
  const duration = name => parseFloat(styles.getPropertyValue(name));
  const reset = () => {
    clearTimeout(safetyTimer);
    delete root.dataset.templeTransition;
    animations.forEach(animation => animation.cancel());
    animations = [];
    navigating = false;
    navigationIssued = false;
    document.body.removeAttribute('aria-busy');
  };
  const clearMarker = () => { try { sessionStorage.removeItem(key); } catch {} };
  const animateDoors = async closing => {
    animations.forEach(animation => animation.cancel());
    animations = leaves.map((leaf, index) => leaf.animate([
      {transform:closing ? open[index] : 'rotateY(0deg)'},
      {transform:closing ? 'rotateY(0deg)' : open[index]}
    ], {duration:duration(closing ? '--temple-close-duration' : '--temple-open-duration'),easing:ease,fill:'forwards'}));
    await Promise.all(animations.map(animation => animation.finished.catch(() => {})));
  };
  const reveal = async () => {
    if (root.dataset.templeTransition !== 'closed') return;
    if (reduced.matches) { reset(); return; }
    // The homepage has measured its scene markers before the doors reveal it.
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    if (root.dataset.templeTransition !== 'closed') return;
    if (reduced.matches) { reset(); return; }
    root.dataset.templeTransition = 'revealing';
    safetyTimer = setTimeout(reset, 1800);
    try { await animateDoors(false); } finally { if (!navigating) reset(); }
  };
  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('a[href]');
    if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
    const destination = new URL(link.href, location.href);
    if (!/^https?:$/.test(destination.protocol) || destination.origin !== location.origin || !routes.has(canonicalPath(destination.pathname))) return;
    // Local chapter links and repeated links keep native anchor/scroll behavior.
    if (canonicalPath(destination.pathname) === canonicalPath(location.pathname) && destination.search === location.search) return;
    // Keyboard navigation and reduced motion remain immediate.
    if (event.detail === 0 || reduced.matches || !leaves.every(leaf => leaf.animate)) return;
    if (navigating) { event.preventDefault(); return; }
    try {
      sessionStorage.setItem(key, JSON.stringify({href:destination.href,expires:Date.now()+10000}));
    } catch { return; }
    event.preventDefault();
    navigating = true;
    root.dataset.templeTransition = 'leaving';
    document.body.setAttribute('aria-busy', 'true');
    const navigate = () => {
      if (!navigating || navigationIssued) return;
      navigationIssued = true;
      root.dataset.templeTransition = 'closed';
      // The old document may be restored from the browser's back/forward cache.
      safetyTimer = setTimeout(() => { clearMarker(); reset(); }, 6000);
      try { location.assign(destination.href); } catch { clearMarker(); reset(); }
    };
    // Animation failure cannot prevent a real navigation.
    safetyTimer = setTimeout(navigate, 800);
    animateDoors(true).then(navigate, navigate);
  });
  addEventListener('pagehide', () => {
    if (!navigationIssued) clearMarker();
    reset();
  });
  addEventListener('pageshow', event => { if (event.persisted) reset(); });
  reduced.addEventListener('change', () => { if (reduced.matches && !navigating) reset(); });
  reveal();
})();
