const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const header=document.querySelector('header'),heroArt=document.querySelector('.hero-art'),templeArt=document.querySelector('.temple-art'),descent=document.querySelector('.descent'),progress=document.querySelector('.progress div');
const expedition=document.querySelector('.expedition'),stage=document.querySelector('.journey-stage'),track=document.querySelector('.world-track'),heroCopy=document.querySelector('.hero-copy'),heroBottom=document.querySelector('.hero-bottom'),passageCopy=document.querySelector('.passage-copy'),fall=document.querySelector('.continuous-fall'),leftRock=document.querySelector('.foreground-left'),rightRock=document.querySelector('.foreground-right'),leftWall=document.querySelector('.shaft-left'),rightWall=document.querySelector('.shaft-right'),leftPillar=document.querySelector('.pillar-left'),rightPillar=document.querySelector('.pillar-right');
let paused=reduced.matches,party=false,raf=0,sceneHeight=innerHeight,templeStart=0,expeditionStart=0,totalScroll=1;
const motion=document.querySelector('#motion');
const shaftArt=document.querySelector('.shaft-back'),rail=document.querySelector('.chapter-rail'),railLinks=[...rail.querySelectorAll('a')],atmosphere=document.querySelector('.atmosphere');
let visualScroll=scrollY,lastFrame=0;
const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
function measure(){sceneHeight=stage.clientHeight||innerHeight;templeStart=descent.offsetTop;expeditionStart=expedition.offsetTop;totalScroll=Math.max(1,document.documentElement.scrollHeight-innerHeight);visualScroll=scrollY;renderScene(visualScroll);}
function setPaused(value){paused=value;document.body.classList.toggle('paused',value);document.body.classList.toggle('reduced-scene',reduced.matches);motion.setAttribute('aria-pressed',String(value));motion.setAttribute('aria-label',value?'Reprendre les animations':'Mettre les animations en pause');motion.textContent=value?'▷':'Ⅱ';measure();}
motion.addEventListener('click',()=>setPaused(!paused));reduced.addEventListener('change',()=>setPaused(reduced.matches));
const menu=document.querySelector('.menu-toggle');menu.addEventListener('click',()=>{const open=header.classList.toggle('menu-open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Fermer le menu':'Ouvrir le menu');menu.textContent=open?'×':'☰';});document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>{header.classList.remove('menu-open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Ouvrir le menu');menu.textContent='☰';}));
function renderScene(visualY){
 const y=visualY,h=sceneHeight,local=Math.max(0,y-expeditionStart),journey=clamp(local/Math.max(h,templeStart)),camera=journey*h*2;
 header.classList.toggle('scrolled',local>h*.45);progress.style.transform=`scaleX(${clamp(y/totalScroll)})`;
 const chapter=local<sceneHeight*.6?0:local<templeStart-sceneHeight*.25?1:2;
 const hideRail=local>templeStart+sceneHeight*1.65||reduced.matches;rail.classList.toggle('rail-hidden',hideRail);rail.inert=hideRail;rail.setAttribute('aria-hidden',String(hideRail));railLinks.forEach((link,i)=>{if(i===chapter)link.setAttribute('aria-current','step');else link.removeAttribute('aria-current');});
 if(reduced.matches)return;
 track.style.transform=`translate3d(0,${-camera}px,0)`;
 const fade=1-clamp((local/h-.12)/.55);heroCopy.style.opacity=fade;heroBottom.style.opacity=1-clamp(local/(h*.3));heroCopy.style.transform=`translate3d(0,${-clamp(local/h,0,1)*65}px,0)`;
 const tunnel=clamp((local/h-.45)/.4)*(1-clamp((local-templeStart+h*.35)/(h*.35)));passageCopy.style.opacity=tunnel;
 atmosphere.style.opacity=clamp((local/sceneHeight-.25)/.6)*(1-clamp((local-templeStart-sceneHeight)/sceneHeight));
 const extra=paused?0:journey;const templeProgress=clamp((local-templeStart)/h,0,2);
 heroArt.style.transform=`translate3d(0,${extra*h*.14}px,0) scale(1.04)`;
 leftRock.style.transform=`translate3d(${-extra*120}px,${-extra*h*.45}px,0) scale(${1+extra*.22})`;
 rightRock.style.transform=`translate3d(${extra*150}px,${-extra*h*.6}px,0) scale(${1+extra*.28})`;
 leftWall.style.transform=`translate3d(${-extra*35}px,${-extra*h*.08}px,0)`;
 rightWall.style.transform=`translate3d(${extra*45}px,${-extra*h*.13}px,0) scaleX(-1)`;
 shaftArt.style.transform=`translate3d(0,${h*.2-extra*28}px,0) scale(${1.03+extra*.035})`;
 fall.style.transform=`translate3d(0,${-extra*30}px,0)`;
 templeArt.style.transform=`translate3d(0,${-templeProgress*(paused?0:20)}px,0) scale(1.045)`;
 leftPillar.style.transform=`translate3d(${-extra*12}px,${-(extra*35+templeProgress*50)}px,0)`;
 rightPillar.style.transform=`translate3d(${extra*12}px,${-(extra*50+templeProgress*70)}px,0) scaleX(-1)`;
}
function animateScene(now){
 const dt=lastFrame?Math.min(50,now-lastFrame):16;lastFrame=now;
 const target=scrollY;visualScroll=(paused||reduced.matches)?target:visualScroll+(target-visualScroll)*(1-Math.exp(-dt/75));
 if(Math.abs(target-visualScroll)<.15)visualScroll=target;
 renderScene(visualScroll);
 if(visualScroll!==target)raf=requestAnimationFrame(animateScene);else{raf=0;lastFrame=0;}
}
window.addEventListener('scroll',()=>{if(!raf)raf=requestAnimationFrame(animateScene);},{passive:true});window.addEventListener('resize',measure);document.fonts.ready.then(measure);window.addEventListener('load',measure);setPaused(paused);
const eventDate=new Date('2027-01-30T00:00:00+01:00');function countdown(){let diff=Math.max(0,eventDate-Date.now());document.querySelector('#days').textContent=Math.floor(diff/86400000);document.querySelector('#hours').textContent=String(Math.floor(diff/3600000)%24).padStart(2,'0');document.querySelector('#minutes').textContent=String(Math.floor(diff/60000)%60).padStart(2,'0');if(diff===0){document.querySelector('.countdown').setAttribute('aria-label','Le rendez-vous est arrivé');}}countdown();setInterval(countdown,30000);
const ideas=['Pharaon disco : couronne dorée, lunettes et paillettes.','Cléopâtre de minuit : bleu profond, or et regard de reine.','Momie chic : bandelettes, touche fluo et baskets confortables.','Gardien du temple : col large, motifs géométriques et allure royale.','Scarabée cosmique : reflets métallisés et ailes imaginaires.','Explorateur du Nil : chapeau, carte au trésor et curiosité.'];let idea=0;document.querySelector('#inspire').addEventListener('click',()=>{document.querySelector('#costume-idea').textContent=ideas[idea++%ideas.length];});
const canvas=document.querySelector('#confetti'),ctx=canvas.getContext('2d');let w,h,particles=[],confettiRaf=0,lastParticleFrame=0;
function resize(){w=canvas.width=canvas.clientWidth;h=canvas.height=canvas.clientHeight;particles=Array.from({length:60},()=>({x:Math.random()*w,y:Math.random()*h,r:Math.random()*3+2,v:Math.random()*1.3+.5,phase:Math.random()*6.28,color:['#ffd58c','#7ce8e3','#e6a1ed','#ffb391'][Math.floor(Math.random()*4)]}));}resize();window.addEventListener('resize',resize);
function refreshParticles(){const active=party&&!paused&&!reduced.matches&&scrollY<h&&!document.hidden;if(active&&!confettiRaf)confettiRaf=requestAnimationFrame(confetti);else if(!active){cancelAnimationFrame(confettiRaf);confettiRaf=0;lastParticleFrame=0;ctx.clearRect(0,0,w,h);}}
function confetti(now){confettiRaf=0;if(!party||paused||reduced.matches||scrollY>=h||document.hidden){refreshParticles();return;}const speed=lastParticleFrame?Math.min(2,(now-lastParticleFrame)/16.67):1;lastParticleFrame=now;ctx.clearRect(0,0,w,h);particles.forEach(p=>{p.y+=p.v*speed;p.x+=Math.sin(p.y*.007+p.phase)*.4*speed;if(p.y>h){p.y=-10;p.x=Math.random()*w;}ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.y*.01+p.phase);ctx.fillStyle=p.color;ctx.fillRect(-p.r/2,-p.r,p.r,p.r*2);ctx.restore();});confettiRaf=requestAnimationFrame(confetti);}
const partyButton=document.querySelector('#party');partyButton.addEventListener('click',()=>{party=!party;document.body.classList.toggle('party',party);partyButton.setAttribute('aria-pressed',String(party));partyButton.innerHTML=party?'<span aria-hidden="true">✧</span> Le temple s’éveille !':'<span aria-hidden="true">✧</span> Réveiller le temple';if(party&&reduced.matches)document.querySelector('.hero-tagline').textContent='Le temple est prêt. Il ne manque plus que vous.';refreshParticles();});
motion.addEventListener('click',refreshParticles);reduced.addEventListener('change',refreshParticles);window.addEventListener('scroll',refreshParticles,{passive:true});document.addEventListener('visibilitychange',refreshParticles);
