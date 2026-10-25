const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const header=document.querySelector('header'),descent=document.querySelector('.descent'),progress=document.querySelector('.progress div');
const expedition=document.querySelector('.expedition'),stage=document.querySelector('.world-stage'),camera=document.querySelector('.world-camera'),worldImage=document.querySelector('.world-illustration'),shade=document.querySelector('.world-shade'),heroCopy=document.querySelector('.hero-copy'),heroBottom=document.querySelector('.hero-bottom'),passage=document.querySelector('.passage'),passageCopy=document.querySelector('.passage-copy'),panels=[...document.querySelectorAll('.story-panel')],nearLeft=document.querySelector('.near-left'),nearRight=document.querySelector('.near-right'),atmosphere=document.querySelector('.atmosphere'),rail=document.querySelector('.chapter-rail'),railLinks=[...rail.querySelectorAll('a')];
const motion=document.querySelector('#motion'),clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
let paused=reduced.matches,party=false,raf=0,lastFrame=0,visualScroll=scrollY,sceneHeight=innerHeight,artWidth=innerWidth,worldHeight=innerWidth*3,viewportWidth=innerWidth,expeditionStart=0,totalScroll=1,stops=[],chapter=-1,railHidden=null,initialHashHandled=false;
function pageTop(element){return element.getBoundingClientRect().top+scrollY;}
function measure(){
 sceneHeight=stage.clientHeight||innerHeight;viewportWidth=stage.clientWidth||innerWidth;expeditionStart=pageTop(expedition);
 artWidth=Math.max(viewportWidth,sceneHeight*1.18);worldHeight=artWidth*3;camera.style.width=`${artWidth}px`;camera.style.height=`${worldHeight}px`;
 const centerAt=el=>Math.max(0,pageTop(el)-expeditionStart+el.offsetHeight*.5-sceneHeight*.5);
 const maxCamera=Math.max(0,worldHeight-sceneHeight);
 stops=[{x:0,y:0,pan:.59},{x:centerAt(passage),y:Math.min(maxCamera,worldHeight*.255),pan:.72},{x:centerAt(panels[0]),y:Math.min(maxCamera,worldHeight*.65),pan:.57},{x:centerAt(panels[1]),y:maxCamera,pan:.54}];
 totalScroll=Math.max(1,document.documentElement.scrollHeight-innerHeight);visualScroll=scrollY;renderScene(visualScroll);
}
function interpolate(x,key){for(let i=1;i<stops.length;i++){if(x<=stops[i].x){const a=stops[i-1],b=stops[i],t=clamp((x-a.x)/Math.max(1,b.x-a.x));return a[key]+(b[key]-a[key])*t;}}return stops.at(-1)?.[key]||0;}
function setPaused(value){paused=value;document.body.classList.toggle('paused',value);motion.setAttribute('aria-pressed',String(value));motion.setAttribute('aria-label',value?'Reprendre les animations':'Mettre les animations en pause');motion.textContent=value?'▷':'Ⅱ';window.WorldFx?.setPaused(value);renderScene(scrollY);}
function renderScene(y){
 if(!stops.length)return;
 const local=Math.max(0,y-expeditionStart),actual=scrollY-expeditionStart,h=sceneHeight;
 header.classList.toggle('scrolled',actual>h*.45);progress.style.transform=`scaleX(${clamp(scrollY/totalScroll)})`;
 const nextChapter=local<stops[1].x*.6?0:local<(stops[1].x+stops[2].x)*.5?1:2;
 if(nextChapter!==chapter){chapter=nextChapter;railLinks.forEach((a,i)=>{if(i===chapter)a.setAttribute('aria-current','step');else a.removeAttribute('aria-current');});}
 const hide=actual>stops.at(-1).x+h*.65;
 if(hide!==railHidden){railHidden=hide;rail.classList.toggle('rail-hidden',hide);rail.inert=hide;rail.setAttribute('aria-hidden',String(hide));}
 const cameraY=interpolate(local,'y'),pan=interpolate(local,'pan');
 const cameraX=clamp(viewportWidth*.5-artWidth*pan,viewportWidth-artWidth,0);
 camera.style.transform=`translate3d(${cameraX}px,${-cameraY}px,0)`;
 window.WorldFx?.setView({width:viewportWidth,height:h,artWidth,artHeight:worldHeight,x:cameraX,y:-cameraY});
 shade.style.opacity=clamp(local/Math.max(1,stops[1].x),0,.95);
 const fade=1-clamp((actual/h-.08)/.48);heroCopy.style.opacity=fade;heroBottom.style.opacity=1-clamp(actual/(h*.28));
 heroCopy.style.transform=reduced.matches?'none':`translate3d(0,${-clamp(actual/h)*35}px,0)`;
 // Native document scrolling moves text; the background follows the same measured landmarks.
 passageCopy.style.opacity=1;
 const nearProgress=clamp(local/(h*.8)),nearExtra=(paused||reduced.matches)?0:nearProgress;
 nearLeft.style.transform=`translate3d(${-nearExtra*70}px,${-nearExtra*h*.28}px,0)`;nearRight.style.transform=`translate3d(${nearExtra*80}px,${-nearExtra*h*.34}px,0)`;
 nearLeft.style.opacity=nearRight.style.opacity=String((1-nearProgress)*.8);
 atmosphere.style.opacity=clamp(local/h*.8)*(1-clamp((local-stops.at(-1).x)/h));
}
function animateScene(now){const dt=lastFrame?Math.min(50,now-lastFrame):16;lastFrame=now;const target=scrollY;visualScroll=(paused||reduced.matches)?target:visualScroll+(target-visualScroll)*(1-Math.exp(-dt/55));if(Math.abs(target-visualScroll)<.15)visualScroll=target;renderScene(visualScroll);if(visualScroll!==target)raf=requestAnimationFrame(animateScene);else{raf=0;lastFrame=0;}}
function schedule(){if(!raf)raf=requestAnimationFrame(animateScene);}
window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',measure);motion.addEventListener('click',()=>setPaused(!paused));reduced.addEventListener('change',()=>{setPaused(reduced.matches);measure();});
const menu=document.querySelector('.menu-toggle');
function closeMenu(){header.classList.remove('menu-open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Ouvrir le menu');menu.textContent='☰';}
menu.addEventListener('click',()=>{const open=header.classList.toggle('menu-open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Fermer le menu':'Ouvrir le menu');menu.textContent=open?'×':'☰';});
const hashStops={'#accueil':0,'#surface':0,'#passage':1,'#theme':2,'#programme':3};
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',event=>{closeMenu();const hash=a.getAttribute('href');if(hash in hashStops){event.preventDefault();history.replaceState(null,'',hash);window.scrollTo({top:expeditionStart+stops[hashStops[hash]].x,behavior:reduced.matches?'instant':'smooth'});}}));
function ready(){measure();if(!initialHashHandled){initialHashHandled=true;if(location.hash in hashStops){window.scrollTo({top:expeditionStart+stops[hashStops[location.hash]].x,behavior:'instant'});visualScroll=scrollY;renderScene(visualScroll);}}}
worldImage.addEventListener('load',measure);document.fonts.ready.then(ready);window.addEventListener('load',measure);measure();setPaused(paused);
const eventDate=new Date('2027-01-30T00:00:00+01:00');function countdown(){let diff=Math.max(0,eventDate-Date.now());document.querySelector('#days').textContent=Math.floor(diff/86400000);document.querySelector('#hours').textContent=String(Math.floor(diff/3600000)%24).padStart(2,'0');document.querySelector('#minutes').textContent=String(Math.floor(diff/60000)%60).padStart(2,'0');if(diff===0){document.querySelector('.countdown').setAttribute('aria-label','Le rendez-vous est arrivé');}}countdown();setInterval(countdown,30000);
const ideas=['Pharaon disco : couronne dorée, lunettes et paillettes.','Cléopâtre de minuit : bleu profond, or et regard de reine.','Momie chic : bandelettes, touche fluo et baskets confortables.','Gardien du temple : col large, motifs géométriques et allure royale.','Scarabée cosmique : reflets métallisés et ailes imaginaires.','Explorateur du Nil : chapeau, carte au trésor et curiosité.'];let idea=0;document.querySelector('#inspire').addEventListener('click',()=>{document.querySelector('#costume-idea').textContent=ideas[idea++%ideas.length];});
const canvas=document.querySelector('#confetti'),ctx=canvas.getContext('2d');let w,h,particles=[],confettiRaf=0,lastParticleFrame=0;
function resize(){w=canvas.width=canvas.clientWidth;h=canvas.height=canvas.clientHeight;particles=Array.from({length:60},()=>({x:Math.random()*w,y:Math.random()*h,r:Math.random()*3+2,v:Math.random()*1.3+.5,phase:Math.random()*6.28,color:['#ffd58c','#7ce8e3','#e6a1ed','#ffb391'][Math.floor(Math.random()*4)]}));}resize();window.addEventListener('resize',resize);
function refreshParticles(){const active=party&&!paused&&!reduced.matches&&scrollY<h&&!document.hidden;if(active&&!confettiRaf)confettiRaf=requestAnimationFrame(confetti);else if(!active){cancelAnimationFrame(confettiRaf);confettiRaf=0;lastParticleFrame=0;ctx.clearRect(0,0,w,h);}}
function confetti(now){confettiRaf=0;if(!party||paused||reduced.matches||scrollY>=h||document.hidden){refreshParticles();return;}const speed=lastParticleFrame?Math.min(2,(now-lastParticleFrame)/16.67):1;lastParticleFrame=now;ctx.clearRect(0,0,w,h);particles.forEach(p=>{p.y+=p.v*speed;p.x+=Math.sin(p.y*.007+p.phase)*.4*speed;if(p.y>h){p.y=-10;p.x=Math.random()*w;}ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.y*.01+p.phase);ctx.fillStyle=p.color;ctx.fillRect(-p.r/2,-p.r,p.r,p.r*2);ctx.restore();});confettiRaf=requestAnimationFrame(confetti);}
const partyButton=document.querySelector('#party');partyButton.addEventListener('click',()=>{party=!party;document.body.classList.toggle('party',party);partyButton.setAttribute('aria-pressed',String(party));partyButton.innerHTML=party?'<span aria-hidden="true">✧</span> Le temple s’éveille !':'<span aria-hidden="true">✧</span> Réveiller le temple';if(party&&reduced.matches)document.querySelector('.hero-tagline').textContent='Le temple est prêt. Il ne manque plus que vous.';refreshParticles();});
motion.addEventListener('click',refreshParticles);reduced.addEventListener('change',refreshParticles);window.addEventListener('scroll',refreshParticles,{passive:true});document.addEventListener('visibilitychange',refreshParticles);
