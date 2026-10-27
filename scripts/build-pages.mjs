import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..'),dist=path.join(root,'dist');
const pages=JSON.parse(fs.readFileSync(path.join(import.meta.dirname,'site-pages.json'),'utf8'));
const faqItems=JSON.parse(fs.readFileSync(path.join(import.meta.dirname,'faq-content.json'),'utf8'));
const version='enfants-24';
const carvingSource=fs.readFileSync(path.join(dist,'assets/engraved-stone.svg'),'utf8');
const carvingGroup=carvingSource.match(/<g\b[^>]*id="incisions"[\s\S]*<\/g>(?=\s*<\/defs>)/)?.[0];
if(!carvingGroup)throw new Error('The engraved background must contain the incisions group.');
const transitionMarkup=fs.readFileSync(path.join(import.meta.dirname,'temple-transition.html'),'utf8').trim();
const transitionHead=`<link rel="stylesheet" href="/page-transition.css?v=${version}"><script src="/page-transition-boot.js?v=${version}"></script><script src="/page-transition.js?v=${version}" defer></script>`;
const shellHead=`<link rel="stylesheet" href="/pages.css?v=${version}"><link rel="stylesheet" href="/site-shell.css?v=${version}"><script src="/navigation.js?v=${version}" defer></script>${transitionHead}`;
const escape=value=>value.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
const faqMarkup=()=>faqItems.map(item=>`<details id="faq-${escape(item.id)}"${item.open?' open':''}><summary>${escape(item.question)}</summary><div class="prose">${item.answer}</div></details>`).join('\n');
const primary=[['Accueil','/#accueil'],['Qui sommes-nous','/#nous'],['Thème','/#theme'],['Char','/#char'],['Comité','/#comite'],['FAQ','/#faq'],['Contact','/contact/']];
const secondary=[['Notre histoire','/histoire/'],['Les dernières éditions','/edition/'],['Le carnaval des enfants','/carna_enfant/'],['Le comité en détail','/comite/'],['Questions pratiques','/faqs/']];
const groups=[['Édition 2027',[['Le thème','/#theme'],['Les guggens invitées','/#guggens'],['Date et lieu','/#infos'],['Les sorties du char','/char/']]],['Le carnaval',secondary.slice(0,4)],['Informations',[['Questions pratiques','/faqs/'],['Contact','/contact/'],['Instagram','https://www.instagram.com/carnadzons/']]]];
function links(items,slug,isHome){return items.map(([label,url])=>{const href=isHome&&url.startsWith('/#')?url.slice(1):url;const current=slug&&url===`/${slug}/`?' aria-current="page"':'';const external=url.startsWith('https:')?' target="_blank" rel="noreferrer"':'';return `<a href="${href}"${current}${external}>${label}</a>`;}).join('');}
function menu(slug='',isHome=false){return `<details class="site-menu"><summary aria-controls="site-menu-panel" aria-expanded="false"><span class="menu-open-label">Menu</span><span class="menu-close-label">Fermer</span><span class="menu-symbol" aria-hidden="true"></span></summary><div class="menu-panel" id="site-menu-panel"><nav class="menu-nav" aria-label="Navigation mobile"><div class="menu-primary">${links(primary,slug,isHome)}</div><div class="menu-secondary"><p class="menu-heading">Pour en savoir plus</p>${links(secondary,slug,isHome)}</div></nav><p class="menu-edition-note">30 janvier 2027 · Salle de gym de Saint-Martin<br>Le Carna’dzons vous emmène en Égypte</p></div></details>`;}
function header(slug='',isHome=false){return `<header class="site-header"><a class="brand" href="${isHome?'#accueil':'/'}" aria-label="Carna’dzons, accueil"><span>Carna’dzons</span></a><div class="header-actions"><nav class="primary-navigation" aria-label="Navigation principale">${links(primary,slug,isHome)}</nav>${menu(slug,isHome)}</div></header>`;}
function footer(slug='',isHome=false){const bottom=`<div class="footer-bottom"><span>Saint-Martin · Valais · 2027</span><a href="mailto:contact@carnadzons.ch">contact@carnadzons.ch</a><a class="back-top" href="${isHome?'#accueil':'/'}">Retour au temple <span aria-hidden="true">↑</span></a></div>`;if(isHome)return `<footer class="site-footer home15-footer">${bottom}</footer>`;return `<footer class="site-footer"><a href="/" class="footer-brand">Carna’dzons</a><div class="footer-pages">${groups.map(([heading,items])=>`<div><p class="menu-heading">${heading}</p>${links(items,slug,isHome)}</div>`).join('')}</div>${bottom}</footer>`;}
let home=fs.readFileSync(path.join(dist,'index.html'),'utf8');
home=home.replace(/<g\b[^>]*id="incisions"[\s\S]*?<\/g>\s*(?=<clipPath id="date-clip-left")/,`${carvingGroup}\n`);
home=home.replace(/<header class="site-header">[\s\S]*?<\/header>/,header('',true));
home=home.replace(/<footer class="site-footer[^\"]*">[\s\S]*?<\/footer>/,footer('',true));
const homeContent=fs.readFileSync(path.join(import.meta.dirname,'home-sections.html'),'utf8').replace('<!-- faq-items -->',faqMarkup());
home=home.replace(/<div class="home15-content">[\s\S]*?<\/div><\/main>/,`<div class="home15-content">${homeContent}</div></main>`);
home=home.replace(/<link rel="stylesheet" href="\/?(?:pages|site-shell|home15|about19|guggens17|page-transition).css[^\"]*">/g,'').replace(/<script src="\/?(?:navigation|page-transition(?:-boot)?).js[^\"]*"(?: defer)?><\/script>/g,'');
home=home.replace(/<!-- temple-navigation:start -->[\s\S]*?<!-- temple-navigation:end -->/g,'');
home=home.replace(/(<body\b[^>]*>)/,`$1${transitionMarkup}`);
home=home.replace(/<link rel="preload" as="font" href="assets\/fonts-v8\/onest-latin.woff2" type="font\/woff2" crossorigin>/,'<link rel="preload" as="font" href="/assets/fonts-v15/manrope-variable.ttf" type="font/ttf" crossorigin>');
home=home.replace(/(scroll-scenes\.css|egypt\.js)\?v=[^\"]+/g,`$1?v=${version}`);
home=home.replace('</head>',`${shellHead}<link rel="stylesheet" href="/home15.css?v=${version}"><link rel="stylesheet" href="/guggens17.css?v=${version}"><link rel="stylesheet" href="/about19.css?v=${version}"></head>`);
fs.writeFileSync(path.join(dist,'index.html'),home);fs.writeFileSync(path.join(dist,'entree-egypte.html'),home);
for(const page of pages){
 const {slug,title,kicker,description}=page;
 const body=page.body.replace('<!-- faq-items -->',faqMarkup()).replace(/href="\/(histoire|edition|carna_enfant|faqs|contact|char|comite)"/g,'href="/$1/"');
 const head=`<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#0D1215"><meta name="description" content="${escape(description)}"><title>${escape(title)} — Carna’dzons</title><link rel="preload" as="font" href="/assets/fonts-v8/cleopatra.ttf" type="font/ttf" crossorigin><link rel="preload" as="font" href="/assets/fonts-v15/manrope-variable.ttf" type="font/ttf" crossorigin><link rel="stylesheet" href="/assets/fonts-v8/fonts.css"><link rel="stylesheet" href="/egypt.css?v=portes-mobile-12">${shellHead}${slug==='histoire'?`<link rel="stylesheet" href="/history22.css?v=${version}">`:''}${slug==='edition'?`<link rel="stylesheet" href="/editions23.css?v=${version}">`:''}${slug==='carna_enfant'?`<link rel="stylesheet" href="/children24.css?v=${version}">`:''}</head>`;
 const html=`${head}<body class="interior-page${slug==='histoire'?' history22-page':''}${slug==='edition'?' edition23-page':''}${slug==='carna_enfant'?' kids24-page':''}">${transitionMarkup}<a class="skip-link" href="#contenu">Aller au contenu</a>${header(slug)}<main class="page-main" id="contenu"><nav class="breadcrumb" aria-label="Fil d’Ariane"><a href="/">Le temple</a><span aria-hidden="true">/</span><span aria-current="page">${escape(title)}</span></nav><div class="page-intro"><p class="section-kicker">${escape(kicker)}</p><h1>${escape(title)}</h1><p class="page-description">${escape(description)}</p></div><div class="page-body">${body}</div><div class="page-return"><a class="text-link" href="/">Retour au temple <span aria-hidden="true">↗</span></a><a class="text-link" href="/#infos">${slug==='carna_enfant'?'La soirée du Carna’dzons':'30 janvier 2027 · Saint-Martin'} <span aria-hidden="true">↗</span></a></div></main>${footer(slug)}</body></html>`;
 fs.mkdirSync(path.join(dist,slug),{recursive:true});fs.writeFileSync(path.join(dist,slug,'index.html'),html);
}
console.log(`Updated homepage content, shared navigation and ${pages.length} pages.`);
