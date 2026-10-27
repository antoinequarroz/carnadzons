(() => {
  const menu = document.querySelector('.site-menu');
  if (!menu) return;
  const summary = menu.querySelector('summary');
  const close = (restoreFocus = false) => {
    menu.open = false;
    summary.setAttribute('aria-expanded', 'false');
    if (restoreFocus) summary.focus({preventScroll:true});
  };
  menu.addEventListener('toggle', () => summary.setAttribute('aria-expanded', String(menu.open)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.open) { event.preventDefault(); close(true); }
  });
  document.addEventListener('click', event => {
    if (menu.open && !menu.contains(event.target)) close();
  });
  menu.addEventListener('click', event => {
    if (event.target.closest('a')) close();
  });
  menu.addEventListener('focusout', event => {
    if (event.relatedTarget && !menu.contains(event.relatedTarget)) close();
  });
  window.addEventListener('pageshow', () => close());
})();
