(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const journey = $('.journey'), stage = $('.journey-stage'), entry = $('.entry');
  const world = $('.entry-world'), portal = $('.portal'), title = $('.entry-name');
  const venue = $('.entry-venue'), cue = $('.scroll-invitation'), caption = $('.journey-caption');
  const skip = $('.skip-journey'), arrival = $('.arrival'), progressLine = $('.page-progress');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const papyri = [$('#papyrus-left'), $('#papyrus-right')], sun = $('#winged-sun');
  const spirit = $('.spirit'), mascot = $('.mascot-art'), medallion = $('#medallion');
  const programme = $('.programme'), orbit = $('.orbit-ticks');
  const doors = ['left','right'].map(side => ({side,panel:$(`.door-${side} .door-panel`),line:$(`.door-${side} .door-line`),handle:$(`.door-${side} .door-handle`)}));
  const clamp = x => Math.max(0, Math.min(1,x));
  // Explicit cubic easing over scroll distance, with no clock or trailing inertia.
  const easeOut = x => 1 - Math.pow(1-clamp(x),3);
  const easeInOut = x => {const t=clamp(x);return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;};
  let viewportW=0, viewportH=0, base=1, endScale=1, distance=1, journeyTop=0;
  let spiritTop=0, spiritHeight=1, programmeTop=0, programmeHeight=1, pageHeight=1;
  let queued=false, previous=-1, isComplete=false;
  function project(side,u,y,angle){
    const perspective=280/(280+Math.sin(angle)*u);
    return [(side==='left'?225:375)+(side==='left'?1:-1)*u*Math.cos(angle)*perspective,255+(y-255)*perspective];
  }
  function path(side,points,angle,close=false){return points.map(([u,y],i)=>`${i?'L':'M'}${project(side,u,y,angle).join(',')}`).join('')+(close?'Z':'');}
  function renderEntrance(p){
    if(Math.abs(p-previous)<.00002)return;
    previous=p;
    const zoom=easeInOut((p-.12)/.88), scale=Math.exp(Math.log(endScale)*zoom);
    const centerY=viewportH*.35+base*25;
    // Repaint this small native SVG to keep the enlarged lines sharp at every zoom.
    portal.setAttribute('transform',`translate(${viewportW/2} ${centerY}) scale(${base*scale}) translate(-300 -255)`);
    const fade=1-easeOut(p/.2);
    title.style.opacity=fade; title.style.transform=`translateY(${-18*(1-fade)}px)`;
    venue.style.opacity=fade;
    const ui=1-easeOut(p/.25);
    cue.style.opacity=ui; caption.style.opacity=ui; skip.style.opacity=ui;
    skip.style.visibility=p>.25?'hidden':'visible';
    const opening=easeInOut((p-.39)/.4), angle=opening*Math.PI*.58;
    for(const d of doors){
      d.panel.setAttribute('points',[[0,150],[75,150],[75,360],[0,360]].map(([u,y])=>project(d.side,u,y,angle).join(',')).join(' '));
      d.line.setAttribute('d',path(d.side,[[7,160],[67,160],[67,350],[7,350]],angle,true));
      d.handle.setAttribute('d',path(d.side,[[65,246],[65,264]],angle));
    }
    const drift=easeOut(p/.5);
    papyri[0].setAttribute('transform',`translate(${-12*drift} ${4*drift}) rotate(${-3*drift} 100 360)`);
    papyri[1].setAttribute('transform',`translate(${600+12*drift} ${4*drift}) scale(-1 1) rotate(${-3*drift} 100 360)`);
    sun.setAttribute('transform',`translate(0 ${-18*drift})`);
    entry.style.visibility=p>=.999?'hidden':'visible';
    const complete=p>.96;
    arrival.inert=!complete;isComplete=complete;
    arrival.style.visibility=p>.37?'visible':'hidden';
  }
  function paint(){
    queued=false;
    const y=scrollY;
    if(!reduced.matches){
      renderEntrance(clamp((y-journeyTop)/distance));
      const sp=clamp((y+viewportH-spiritTop)/(spiritHeight+viewportH));
      mascot.style.transform=`translateY(${(sp-.5)*-40}px)`;
      medallion.setAttribute('transform',`rotate(${(sp-.5)*22} 300 335)`);
      const pp=clamp((y+viewportH-programmeTop)/(programmeHeight+viewportH));
      orbit.setAttribute('transform',`rotate(${pp*45} 250 250)`);
    }
    progressLine.style.transform=`scaleX(${clamp(y/pageHeight)})`;
  }
  function schedule(){if(!queued){queued=true;requestAnimationFrame(paint);}}
  function measure(){
    document.body.classList.toggle('reduced-motion',reduced.matches);
    viewportW=stage.clientWidth;viewportH=stage.clientHeight;
    const logoW=viewportW<=600?Math.min(viewportW*.94,viewportH*.55,440):Math.min(viewportW*.46,viewportH*.67,550);
    base=logoW/600; world.setAttribute('viewBox',`0 0 ${viewportW} ${viewportH}`);
    title.style.top=`${viewportH*.35+base*164+22}px`;
    const centerY=viewportH*.35+base*25;
    endScale=Math.max(viewportW/(150*base),2*Math.max(centerY,viewportH-centerY)/(210*base))*1.15;
    journeyTop=journey.getBoundingClientRect().top+scrollY;
    distance=Math.max(1,journey.offsetHeight-viewportH);
    spiritTop=spirit.getBoundingClientRect().top+scrollY;spiritHeight=spirit.offsetHeight;
    programmeTop=programme.getBoundingClientRect().top+scrollY;programmeHeight=programme.offsetHeight;
    pageHeight=Math.max(1,document.documentElement.scrollHeight-innerHeight);
    previous=-1;
    if(reduced.matches){arrival.inert=false;arrival.style.visibility='visible';entry.style.visibility='hidden';mascot.style.transform='none';medallion.removeAttribute('transform');orbit.removeAttribute('transform');}
    paint();
  }
  arrival.inert=true;
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',measure,{passive:true});
  addEventListener('pageshow',measure);
  reduced.addEventListener('change',measure);
  document.fonts.ready.then(measure);
  measure();
})();
