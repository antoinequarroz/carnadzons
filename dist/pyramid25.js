(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const journey=$('.journey'), stage=$('.journey-stage'), entry=$('.entry');
  if(!journey || !stage) return;
  const world=$('.pyramid25-world'), title=$('.entry-name');
  const venue=$('.entry-venue'), cue=$('.scroll-invitation'), caption=$('.journey-caption');
  const skip=$('.skip-journey'), arrival=$('.arrival'), arrivalCopy=$('.arrival-content');
  const progressLine=$('.page-progress'), reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const sections=[...document.querySelectorAll('.home15-section')];
  const arts=[...document.querySelectorAll('[data-scroll-art]')];
  const navLinks=[...document.querySelectorAll('.primary-navigation a, .menu-primary a')];
  const mattes=[...document.querySelectorAll('.pyramid25-mattes span')];
  const dunes=[$('#pyramid-dunes-back'),$('#pyramid-dunes-front')];
  const halo=$('#pyramid-background');
  const doors=[$('.pyramid25-door-left'),$('.pyramid25-door-right')];
  const clamp=x=>Math.max(0,Math.min(1,x));
  const easeOut=x=>1-Math.pow(1-clamp(x),3);
  const easeInOut=x=>{const t=clamp(x);return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;};
  let viewportW=0,viewportH=0,heroAnchorY=0,base=1,endScale=1,distance=1,journeyTop=0,pageHeight=1;
  let queued=false,previous=-1,current=0,target=0,lastTime=0,lastY=scrollY,ready=false,active='';
  let sectionBounds=[],artBounds=[],initialAnchorAllowed=true;
  function renderEntrance(p){
    if(Math.abs(p-previous)<.00001)return;
    previous=p;
    const zoom=easeInOut((p-.03)/.92),scale=base*Math.exp(Math.log(endScale/base)*zoom);
    const anchorY=heroAnchorY+(viewportH*.5-heroAnchorY)*zoom;
    world.style.transform=`translate3d(${viewportW/2-720*scale}px,${anchorY-722.5*scale}px,0) scale(${scale})`;
    const doorLeft=viewportW/2-112*scale,doorRight=viewportW/2+112*scale;
    const doorTop=anchorY-157.5*scale,doorBottom=anchorY+157.5*scale;
    mattes[0].style.transform=`translate3d(0,${doorTop-viewportH}px,0)`;
    mattes[1].style.transform=`translate3d(0,${doorBottom}px,0)`;
    mattes[2].style.transform=`translate3d(${doorLeft-viewportW}px,0,0)`;
    mattes[3].style.transform=`translate3d(${doorRight}px,0,0)`;
    const fade=1-easeOut(p/.25);
    title.style.opacity=fade;title.style.transform=`translate3d(0,${-46*(1-fade)}px,0)`;venue.style.opacity=fade;
    const ui=1-easeOut(p/.24);
    cue.style.opacity=ui;caption.style.opacity=ui;skip.style.opacity=ui;skip.style.visibility=p>.25?'hidden':'visible';
    const angle=easeInOut((p-.16)/.43)*103;
    doors[0].style.transform=`perspective(440px) rotateY(${angle}deg)`;
    doors[1].style.transform=`perspective(440px) rotateY(${-angle}deg)`;
    const drift=easeOut(p/.62);
    dunes[0].setAttribute('transform',`translate(${-12*drift} ${3*drift})`);
    dunes[1].setAttribute('transform',`translate(${15*drift} ${8*drift})`);
    halo.setAttribute('transform',`translate(0 ${-12*drift})`);
    const reveal=easeOut((p-.55)/.32);
    arrivalCopy.style.opacity=reveal;
    arrivalCopy.style.transform=`translate3d(0,${18*(1-reveal)}px,0)`;
    arrival.style.visibility=p>.24?'visible':'hidden';arrival.inert=p<.86;
    entry.style.visibility=p>=.999?'hidden':'visible';
  }
  function renderContents(y){
    let next='accueil';
    for(const box of sectionBounds){if(y+viewportH*.35>=box.top && ['nous','theme','char','comite','faq'].includes(box.id))next=box.id;}
    if(next!==active){
      active=next;
      navLinks.forEach(link=>{if(link.hash===`#${next}`)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
    }
    if(!reduced.matches)for(const box of artBounds){
      if(y+viewportH<box.top-60 || y>box.top+box.height+60)continue;
      const p=clamp((y+viewportH-box.top)/(viewportH+box.height))-.5;
      box.element.style.transform=box.kind==='poster'?`translate3d(0,${Math.round(p*32)}px,0)`:`translate3d(${Math.round(p*38)}px,0,0)`;
    }
  }
  function paint(time){
    queued=false;
    const y=scrollY;lastY=y;target=clamp((y-journeyTop)/distance);
    const dt=lastTime?Math.min(64,Math.max(1,time-lastTime)):16;lastTime=time;
    if(!reduced.matches){
      if(y<=journeyTop || y>=journeyTop+distance+viewportH*.15)current=target;
      else current+=(target-current)*(1-Math.exp(-dt/55));
      if(Math.abs(target-current)<.0001)current=target;
      renderEntrance(current);
    }
    renderContents(y);progressLine.style.transform=`scaleX(${clamp(y/pageHeight)})`;
    if(!reduced.matches && Math.abs(target-current)>.0001)schedule();else lastTime=0;
  }
  function schedule(){if(!queued){queued=true;requestAnimationFrame(paint);}}
  function measure(){
    document.body.classList.toggle('reduced-motion',reduced.matches);
    viewportW=stage.clientWidth;viewportH=reduced.matches?innerHeight:stage.clientHeight;
    const phone=viewportW<=600,short=viewportH<550;
    const apexY=short?114:Math.max(phone?132:118,viewportH*.13);
    const floorY=viewportH*(phone?.88:.90);
    base=Math.max(.12,(floorY-apexY)/720);
    heroAnchorY=floorY-157.5*base;
    title.style.top=`${apexY+(phone?20:24)}px`;
    // Traverse the smaller interior opening, not only the outer jamb.
    endScale=Math.max(viewportW/160,viewportH/243)*1.18;
    journeyTop=journey.getBoundingClientRect().top+scrollY;distance=Math.max(1,journey.offsetHeight-viewportH);
    sectionBounds=sections.map(element=>({element,id:element.id,top:element.getBoundingClientRect().top+scrollY,height:element.offsetHeight}));
    arts.forEach(art=>art.style.transform='none');
    artBounds=arts.map(element=>({element,kind:element.dataset.scrollArt,top:element.getBoundingClientRect().top+scrollY,height:element.offsetHeight}));
    pageHeight=Math.max(1,document.documentElement.scrollHeight-innerHeight);
    current=target=clamp((scrollY-journeyTop)/distance);previous=-1;lastTime=0;ready=true;
    if(reduced.matches){previous=-1;renderEntrance(0);entry.style.visibility='visible';arrival.inert=false;arrival.style.visibility='visible';arrivalCopy.style.opacity=1;arrivalCopy.style.transform='none';arts.forEach(art=>art.style.transform='none');}
    document.body.classList.add('pyramid25-ready');
    schedule();
  }
  function resize(){
    if(!ready){measure();return;}
    if(stage.clientWidth===viewportW && stage.clientHeight===viewportH){pageHeight=Math.max(1,document.documentElement.scrollHeight-innerHeight);schedule();return;}
    const inEntry=lastY>=journeyTop && lastY<journeyTop+distance;
    const fraction=current;
    const inHandoff=!inEntry && lastY>=journeyTop+distance && lastY<journeyTop+distance+viewportH;
    const handoffFraction=(lastY-journeyTop-distance)/Math.max(1,viewportH);
    let anchor;
    if(!inEntry && !inHandoff)for(const box of sectionBounds){if(lastY+viewportH*.25>=box.top)anchor={id:box.id,fraction:(lastY-box.top)/Math.max(1,box.height)};}
    measure();
    if(inEntry)window.scrollTo({top:journeyTop+fraction*distance,behavior:'instant'});
    else if(inHandoff)window.scrollTo({top:journeyTop+distance+handoffFraction*viewportH,behavior:'instant'});
    else if(anchor){const box=sectionBounds.find(box=>box.id===anchor.id);if(box)window.scrollTo({top:box.top+anchor.fraction*box.height,behavior:'instant'});}
    current=target=clamp((scrollY-journeyTop)/distance);previous=-1;schedule();
  }
  function alignHash(){
    if(!location.hash)return;
    const target=document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if(target){target.scrollIntoView({block:'start',behavior:'instant'});current=clamp((scrollY-journeyTop)/distance);previous=-1;schedule();}
  }
  addEventListener('scroll',schedule,{passive:true});addEventListener('resize',resize,{passive:true});
  addEventListener('pageshow',()=>{measure();});
  document.addEventListener('toggle',event=>{if(event.target.matches('.home15-faq-list details'))measure();},true);
  reduced.addEventListener('change',measure);
  for(const type of ['pointerdown','wheel','touchstart','keydown'])addEventListener(type,()=>{initialAnchorAllowed=false;},{once:true,passive:true});
  document.fonts.ready.then(()=>{measure();if(initialAnchorAllowed)alignHash();});
  measure();requestAnimationFrame(alignHash);
})();
