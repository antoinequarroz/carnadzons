(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const journey=$('.journey'), stage=$('.journey-stage'), entry=$('.entry');
  if(!journey || !stage) return;
  const world=$('.entry-world'), portal=$('.portal'), title=$('.entry-name');
  const venue=$('.entry-venue'), cue=$('.scroll-invitation'), caption=$('.journey-caption');
  const skip=$('.skip-journey'), arrival=$('.arrival'), arrivalCopy=$('.arrival-content');
  const progressLine=$('.page-progress'), reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const papyri=[$('#papyrus-left'),$('#papyrus-right')], sun=$('#winged-sun');
  const sections=[...document.querySelectorAll('.home15-section')];
  const arts=[...document.querySelectorAll('[data-scroll-art]')];
  const navLinks=[...document.querySelectorAll('.primary-navigation a, .menu-primary a')];
  const doors=['left','right'].map(side=>({side,panel:$(`.door-${side} .door-panel`),line:$(`.door-${side} .door-line`),handle:$(`.door-${side} .door-handle`),date:$(`.door-${side} .door-date`),clip:$(`.date-clip-polygon-${side}`)}));
  const clamp=x=>Math.max(0,Math.min(1,x));
  const easeOut=x=>1-Math.pow(1-clamp(x),3);
  const easeInOut=x=>{const t=clamp(x);return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;};
  let viewportW=0,viewportH=0,heroAnchorY=0,base=1,endScale=1,distance=1,journeyTop=0,pageHeight=1;
  let queued=false,previous=-1,current=0,target=0,lastTime=0,lastY=scrollY,ready=false,active='';
  let sectionBounds=[],artBounds=[],initialAnchorAllowed=true;
  function project(side,u,y,angle){
    const q=280/(280+Math.sin(angle)*u);
    return [(side==='left'?205:395)+(side==='left'?1:-1)*u*Math.cos(angle)*q,255+(y-255)*q];
  }
  function path(side,points,angle,close=false){return points.map(([u,y],i)=>`${i?'L':'M'}${project(side,u,y,angle).join(',')}`).join('')+(close?'Z':'');}
  function renderEntrance(p){
    if(Math.abs(p-previous)<.00001)return;
    previous=p;
    const zoom=easeInOut((p-.12)/.82),scale=Math.exp(Math.log(endScale)*zoom);
    const centerY=heroAnchorY+base*25;
    // Project the original vector at its final size to retain sharp engraving.
    portal.setAttribute('transform',`translate(${viewportW/2} ${centerY}) scale(${base*scale}) translate(-300 -255)`);
    const fade=1-easeOut(p/.2);
    title.style.opacity=fade;title.style.transform=`translateY(${-18*(1-fade)}px)`;venue.style.opacity=fade;
    const ui=1-easeOut(p/.25);
    cue.style.opacity=ui;caption.style.opacity=ui;skip.style.opacity=ui;skip.style.visibility=p>.25?'hidden':'visible';
    const angle=easeInOut((p-.31)/.53)*Math.PI*.58;
    for(const d of doors){
      const polygon=[[0,150],[95,150],[95,360],[0,360]].map(([u,y])=>project(d.side,u,y,angle).join(',')).join(' ');
      d.panel.setAttribute('points',polygon);d.clip.setAttribute('points',polygon);
      const q=280/(280+Math.sin(angle)*47.5),horizontal=Math.cos(angle)*q*q,anchor=d.side==='left'?252.5:347.5;
      const [x,y]=project(d.side,47.5,255,angle);
      d.date.setAttribute('transform',`matrix(${horizontal} 0 0 ${q} ${x-horizontal*anchor} ${y-q*255})`);
      d.date.style.visibility=angle<Math.PI/2?'visible':'hidden';
      d.line.setAttribute('d',path(d.side,[[7,160],[87,160],[87,350],[7,350]],angle,true));
      d.handle.setAttribute('d',path(d.side,[[85,246],[85,264]],angle));
    }
    const drift=easeOut(p/.5);
    papyri[0].setAttribute('transform',`translate(${-12*drift} ${4*drift}) rotate(${-3*drift} 100 360)`);
    papyri[1].setAttribute('transform',`translate(${600+12*drift} ${4*drift}) scale(-1 1) rotate(${-3*drift} 100 360)`);
    sun.setAttribute('transform',`translate(0 ${-18*drift})`);
    const reveal=easeOut((p-.58)/.28);
    arrivalCopy.style.opacity=reveal;
    arrivalCopy.style.transform=`translate3d(0,${18*(1-reveal)}px,0)`;
    arrival.style.visibility=p>.3?'visible':'hidden';arrival.inert=p<.86;
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
    viewportW=stage.clientWidth;viewportH=stage.clientHeight;
    const phone=viewportW<=600;
    const logoW=phone?Math.min(viewportW*1.08,viewportH*.61,480):Math.min(viewportW*(viewportW<=1000?.68:.49),viewportH*.72,650);
    heroAnchorY=viewportH*(viewportH<550?.43:.35);base=logoW/600;
    world.setAttribute('viewBox',`0 0 ${viewportW} ${viewportH}`);
    title.style.top=`${heroAnchorY+base*164+22}px`;
    const centerY=heroAnchorY+base*25;
    endScale=Math.max(viewportW/(190*base),2*Math.max(centerY,viewportH-centerY)/(210*base))*1.15;
    journeyTop=journey.getBoundingClientRect().top+scrollY;distance=Math.max(1,journey.offsetHeight-viewportH);
    sectionBounds=sections.map(element=>({element,id:element.id,top:element.getBoundingClientRect().top+scrollY,height:element.offsetHeight}));
    arts.forEach(art=>art.style.transform='none');
    artBounds=arts.map(element=>({element,kind:element.dataset.scrollArt,top:element.getBoundingClientRect().top+scrollY,height:element.offsetHeight}));
    pageHeight=Math.max(1,document.documentElement.scrollHeight-innerHeight);
    current=target=clamp((scrollY-journeyTop)/distance);previous=-1;lastTime=0;ready=true;
    if(reduced.matches){entry.style.visibility='hidden';arrival.inert=false;arrival.style.visibility='visible';arrivalCopy.style.opacity=1;arrivalCopy.style.transform='none';arts.forEach(art=>art.style.transform='none');}
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
