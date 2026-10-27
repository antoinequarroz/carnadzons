import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist');
const pages = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, 'site-pages.json'), 'utf8'));
const version = 'portes-pages-14';
const transitionMarkup = fs.readFileSync(path.join(import.meta.dirname, 'temple-transition.html'), 'utf8').trim();
const transitionHead = `<link rel="stylesheet" href="/page-transition.css?v=${version}"><script src="/page-transition-boot.js?v=${version}"></script><script src="/page-transition.js?v=${version}" defer></script>`;
let home = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const brand = home.match(/<a class="brand"[\s\S]*?<\/a>/)[0];
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"','&quot;').replaceAll('<', '&lt;');
const groups = [
 ['Édition 2027', [['La soirée', '/#soiree'],['Date et lieu','/#infos'],['Le programme','/#programme'],['Le char','/char/']]],
 ['Le carnaval', [['Notre histoire','/histoire/'],['Les dernières éditions','/edition/'],['Le carnaval des enfants','/carna_enfant/'],['Le comité','/comite/']]],
 ['Pour te renseigner', [['Questions pratiques','/faqs/'],['Contact','/contact/'],['Instagram','https://www.instagram.com/carnadzons/']]]
];
function links(group, slug, isHome) {
 return group[1].map(([label,url])=> {
  const href = isHome && url.startsWith('/#') ? url.slice(1) : url;
  const current = slug && url === `/${slug}/` ? ' aria-current="page"' : '';
  const external = url.startsWith('https:') ? ' target="_blank" rel="noreferrer"' : '';
  return `<a href="${href}"${current}${external}>${label}</a>`;
 }).join('');
}
function navigation(slug='', isHome=false) {
 return `<details class="site-menu"><summary aria-controls="site-menu-panel" aria-expanded="false"><span class="menu-open-label">Menu</span><span class="menu-close-label">Fermer</span><span class="menu-symbol" aria-hidden="true"></span></summary><div class="menu-panel" id="site-menu-panel"><nav class="menu-nav" aria-label="Toutes les pages du site"><div><p class="menu-heading">Accueil</p><a href="${isHome?'#accueil':'/'}"${isHome?' aria-current="page"':''}>Les portes du temple</a></div>${groups.map(group=>`<div><p class="menu-heading">${group[0]}</p>${links(group,slug,isHome)}</div>`).join('')}</nav><p class="menu-edition-note">30 janvier 2027 · Salle de gym de Saint-Martin<br>Une nuit en Égypte</p></div></details>`;
}
function header(slug='', isHome=false) {
 const hash = isHome ? '' : '/';
 const logo = brand.replace('href="#accueil"',`href="${isHome?'#accueil':'/'}"`);
 return `<header class="site-header">${logo}<div class="header-actions"><nav aria-label="Navigation principale"><a href="${hash}#soiree">La soirée</a><a href="${hash}#infos">Infos pratiques</a><a class="nav-date" href="${hash}#infos"><span class="header-date-full">30 janvier 2027</span><span class="header-date-short">30.01.2027</span><span aria-hidden="true">↗</span></a></nav>${navigation(slug,isHome)}</div></header>`;
}
function footer(slug='', isHome=false) {
 return `<footer class="site-footer"><a href="${isHome?'#accueil':'/'}" class="footer-brand">Carna’dzons</a><div class="footer-pages">${groups.map(group=>`<div><p class="menu-heading">${group[0]}</p>${links(group,slug,isHome)}</div>`).join('')}</div><div class="footer-bottom"><span>Saint-Martin · Valais · 2027</span><a href="mailto:contact@carnadzons.ch">contact@carnadzons.ch</a><a class="back-top" href="${isHome?'#accueil':'/'}">Retour au temple <span aria-hidden="true">↑</span></a></div></footer>`;
}
home = home.replace(/<header class="site-header">[\s\S]*?<\/header>/,header('',true));
home = home.replace(/<footer class="site-footer">[\s\S]*?<\/footer>/,footer('',true));
home = home.replace(/<link rel="stylesheet" href="\/?pages.css[^\"]*">/g,'').replace(/<script src="\/?navigation.js[^\"]*" defer><\/script>/g,'');
home = home.replace(/<link rel="stylesheet" href="\/?page-transition.css[^\"]*">/g,'').replace(/<script src="\/?page-transition(?:-boot)?.js[^\"]*"(?: defer)?><\/script>/g,'');
home = home.replace(/<!-- temple-navigation:start -->[\s\S]*?<!-- temple-navigation:end -->/g,'');
home = home.replace('<body>', `<body>${transitionMarkup}`);
home = home.replace('</head>',`<link rel="stylesheet" href="pages.css?v=${version}"><script src="navigation.js?v=${version}" defer></script>${transitionHead}</head>`);
fs.writeFileSync(path.join(dist,'index.html'),home);
fs.writeFileSync(path.join(dist,'entree-egypte.html'),home);
for (const page of pages) {
 const {slug,title,kicker,description} = page;
 // The same clean paths work on static hosts and the local HTTP server.
 const body = page.body.replace(/href="\/(histoire|edition|carna_enfant|faqs|contact|char|comite)"/g,'href="/$1/"');
 const head = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#0D1215"><meta name="description" content="${escape(description)}"><title>${escape(title)} — Carna’dzons</title><link rel="preload" as="font" href="/assets/fonts-v8/cleopatra.ttf" type="font/ttf" crossorigin><link rel="preload" as="font" href="/assets/fonts-v8/onest-latin.woff2" type="font/woff2" crossorigin><link rel="stylesheet" href="/assets/fonts-v8/fonts.css"><link rel="stylesheet" href="/egypt.css?v=portes-mobile-12"><link rel="stylesheet" href="/pages.css?v=${version}"><script src="/navigation.js?v=${version}" defer></script>${transitionHead}</head>`;
 const html = `${head}<body class="interior-page">${transitionMarkup}<a class="skip-link" href="#contenu">Aller au contenu</a>${header(slug)}<main class="page-main" id="contenu"><nav class="breadcrumb" aria-label="Fil d’Ariane"><a href="/">Le temple</a><span aria-hidden="true">/</span><span aria-current="page">${escape(title)}</span></nav><div class="page-intro"><p class="section-kicker">${escape(kicker)}</p><h1>${escape(title)}</h1><p class="page-description">${escape(description)}</p></div><div class="page-body">${body}</div><div class="page-return"><a class="text-link" href="/">Retour au temple <span aria-hidden="true">↗</span></a><a class="text-link" href="/#infos">30 janvier 2027 · Saint-Martin <span aria-hidden="true">↗</span></a></div></main>${footer(slug)}</body></html>`;
 fs.mkdirSync(path.join(dist,slug),{recursive:true});
 fs.writeFileSync(path.join(dist,slug,'index.html'),html);
}
console.log(`Updated shared navigation and ${pages.length} pages; homepage scenes preserved.`);
