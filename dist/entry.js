(() => {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const entry = $('.entry'), world = $('.entry-world'), portal = $('.portal');
  const name = $('.entry-name'), footer = $('.entry-footer'), content = $('#content');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const doors = ['left', 'right'].map((side) => ({
    panel: $(`.door-${side} .door-panel`), line: $(`.door-${side} .door-line`), handle: $(`.door-${side} .door-handle`), side
  }));
  let initialCancelled = false;
  let raf = 0, started = 0, elapsed = 0, running = false, width = 0, height = 0, base = 1, endScale = 1, progress = 0;
  const clamp = (x) => Math.max(0, Math.min(1, x));
  const smooth = (x) => { const t = clamp(x); return t * t * (3 - 2 * t); };
  function geometry() {
    width = entry.clientWidth; height = entry.clientHeight;
    const logoWidth = width <= 650 ? Math.min(width * .9, height * .72, 440) : Math.min(width * .47, height * .76, 580);
    base = logoWidth / 600;
    name.style.top = `${height * .42 + base * 164 + 18}px`;
    world.setAttribute('viewBox', `0 0 ${width} ${height}`);
    const cy = height * .42 + logoWidth * (25 / 600);
    endScale = Math.max(width / (150 * base), 2 * Math.max(cy, height - cy) / (210 * base)) * 1.12;
    render(progress);
  }
  function doorPoint(side, u, y, angle) {
    const depth = Math.sin(angle) * u, perspective = 280 / (280 + depth);
    return [(side === 'left' ? 225 : 375) + (side === 'left' ? 1 : -1) * u * Math.cos(angle) * perspective, 255 + (y - 255) * perspective];
  }
  function line(side, coords, angle, close = false) {
    return coords.map(([u,y],i) => `${i ? 'L' : 'M'}${doorPoint(side,u,y,angle).join(',')}`).join('') + (close ? 'Z' : '');
  }
  function render(p) {
    progress = p;
    // One vector camera and one shared doorway center; no raster upscaling.
    const approach = smooth((p - .13) / .87), scale = Math.exp(Math.log(endScale) * approach);
    const cx = width / 2, cy = height * .42 + base * 25;
    portal.setAttribute('transform', `translate(${cx} ${cy}) scale(${base * scale}) translate(-300 -255)`);
    const fade = 1 - smooth(p / .22);
    name.style.opacity = fade;
    name.style.transform = `translateY(${-16 * (1 - fade)}px)`;
    footer.style.opacity = fade;
    const angle = smooth((p - .43) / .35) * Math.PI * .58;
    for (const d of doors) {
      d.panel.setAttribute('points', [[0,150],[75,150],[75,360],[0,360]].map(([u,y]) => doorPoint(d.side,u,y,angle).join(',')).join(' '));
      d.line.setAttribute('d', line(d.side,[[7,160],[67,160],[67,350],[7,350]], angle, true));
      d.handle.setAttribute('d', line(d.side,[[65,246],[65,264]], angle));
    }
  }
  function finish() {
    initialCancelled = true;
    cancelAnimationFrame(raf); running = false; elapsed = 0;
    entry.hidden = true; content.inert = false; document.body.classList.remove('entering');
  }
  function tick(now) {
    if (!running) return;
    if (!started) started = now;
    elapsed = now - started;
    render(clamp((elapsed - 1700) / 4300));
    if (elapsed >= 6000) finish(); else raf = requestAnimationFrame(tick);
  }
  function play() {
    initialCancelled = true;
    cancelAnimationFrame(raf);
    if (reduced.matches) { finish(); return; }
    window.scrollTo({top:0, behavior:'instant'});
    started = 0; elapsed = 0; progress = 0; running = true;
    entry.hidden = false; content.inert = true; document.body.classList.add('entering');
    geometry(); raf = requestAnimationFrame(tick);
  }
  $('.skip-entry').addEventListener('click', finish);
  $('.replay').addEventListener('click', play);
  for (const link of document.querySelectorAll('a[href="#infos"]')) link.addEventListener('click', finish);
  reduced.addEventListener('change', () => { if (reduced.matches) finish(); });
  document.addEventListener('visibilitychange', () => {
    if (!running) return;
    if (document.hidden) cancelAnimationFrame(raf);
    else { started = performance.now() - elapsed; raf = requestAnimationFrame(tick); }
  });
  addEventListener('resize', () => { if (!entry.hidden) geometry(); }, {passive:true});
  // QA can freeze an exact frame on the local or prototype route.
  const frame = new URLSearchParams(location.search).get('frame');
  geometry();
  if (frame !== null && Number.isFinite(Number(frame))) {
    content.inert = true; render(clamp(Number(frame)));
  } else {
    Promise.race([document.fonts.ready, new Promise(resolve => setTimeout(resolve, 1200))]).then(() => { if (!initialCancelled) play(); });
  }
})();
