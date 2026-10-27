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
  const sequence=$('.scroll-sequence'), sequenceStage=$('.sequence-stage');
  const panels=[...document.querySelectorAll('.scroll-panel')];
  const markers=[...document.querySelectorAll('.scene-marker')];
  const sceneLinks=[...document.querySelectorAll('.scene-navigation a')];
  const irisWorld=$('.iris-world'), irisRings=[...document.querySelectorAll('.iris-ring')];
  const leftGate=$('.gate-left'), rightGate=$('.gate-right'), frieze=$('.rising-frieze');
  const spiritCopy=$('.spirit-copy'), dateBlock=$('.date-block'), eventDetails=$('.event-details');
  const programmeCopy=$('.programme-copy'), programmeOrbit=$('.programme-orbit');
  const sceneNote=$('.scene-scroll-note');
  let sceneMode=false, sequenceTop=0, sequenceUnit=1, lastUnit=-1, circleX=0, circleY=0, circleMax=1, gateWidth=70;
  const doors = ['left','right'].map(side => ({side,panel:$(`.door-${side} .door-panel`),line:$(`.door-${side} .door-line`),handle:$(`.door-${side} .door-handle`),date:$(`.door-${side} .door-date`),clip:$(`.date-clip-polygon-${side}`)}));
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
      const projectedDoor=[[0,150],[75,150],[75,360],[0,360]].map(([u,y])=>project(d.side,u,y,angle).join(',')).join(' ');
      d.panel.setAttribute('points',projectedDoor);
      d.clip.setAttribute('points',projectedDoor);
      // Keep the gold inscription attached to the same projected door surface.
      const q=280/(280+Math.sin(angle)*37.5), horizontal=Math.cos(angle)*q*q;
      const anchorX=d.side==='left'?262.5:337.5;
      const [dateX,dateY]=project(d.side,37.5,255,angle);
      d.date.setAttribute('transform',`matrix(${horizontal} 0 0 ${q} ${dateX-horizontal*anchorX} ${dateY-q*255})`);
      d.date.style.visibility=angle<Math.PI/2?'visible':'hidden';
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
  function setTransform(element,value){element.style.transform=value;}
  function clearScenes(){
    panels.forEach(panel=>{panel.style.visibility='visible';panel.style.clipPath='none';panel.inert=false;});
    [spiritCopy,mascot,dateBlock,eventDetails,programmeCopy,programmeOrbit].forEach(el=>el.style.removeProperty('transform'));
    irisWorld.style.visibility='hidden';leftGate.style.visibility='hidden';rightGate.style.visibility='hidden';frieze.style.visibility='hidden';
    medallion.removeAttribute('transform');orbit.removeAttribute('transform');
  }
  function renderSequence(unit){
    if(Math.abs(unit-lastUnit)<.00002)return;
    lastUnit=unit;
    const iris=easeInOut((unit-.8)/1.2), gates=easeInOut((unit-3)/1.2), lift=easeInOut((unit-5.2)/1.2);
    panels[0].style.visibility=unit<2.01?'visible':'hidden';
    panels[1].style.visibility=unit>.8&&unit<4.21?'visible':'hidden';
    panels[2].style.visibility=unit>3&&unit<6.41?'visible':'hidden';
    panels[3].style.visibility=unit>5.2?'visible':'hidden';
    const radius=iris*circleMax;
    panels[1].style.clipPath=iris>=1?'none':`circle(${radius}px at ${circleX}px ${circleY}px)`;
    irisWorld.style.visibility=unit>.8&&unit<2?'visible':'hidden';
    irisRings.forEach((ring,i)=>{ring.setAttribute('cx',circleX);ring.setAttribute('cy',circleY);ring.setAttribute('r',Math.max(0,radius-i*15));});
    setTransform(spiritCopy,`translate3d(${-iris*viewportW*.035}px,0,0)`);
    setTransform(mascot,`scale(${1+iris*.12})`);
    medallion.setAttribute('transform',`rotate(${clamp(unit/2)*24-12} 300 335)`);
    setTransform(dateBlock,`translate3d(${-gates*viewportW*.17}px,0,0)`);
    setTransform(eventDetails,`translate3d(${gates*viewportW*.17}px,0,0)`);
    panels[2].style.clipPath=gates>=1?'none':`inset(0 ${(1-gates)*50}% 0 ${(1-gates)*50}%)`;
    const gateVisible=unit>3&&unit<4.2;
    leftGate.style.visibility=rightGate.style.visibility=gateVisible?'visible':'hidden';
    const breadth=easeOut(Math.min(gates,1-gates)/.13);
    setTransform(leftGate,`translate3d(${viewportW/2-gates*(viewportW/2+gateWidth)-gateWidth}px,0,0) scaleX(${breadth})`);
    setTransform(rightGate,`translate3d(${viewportW/2+gates*(viewportW/2+gateWidth)}px,0,0) scaleX(${breadth})`);
    orbit.setAttribute('transform',`rotate(${clamp((unit-3)/3.4)*80} 250 250)`);
    setTransform(programmeOrbit,`translate(-50%,-50%) translateY(${-lift*viewportH*.3}px) scale(${1+lift*.2})`);
    setTransform(programmeCopy,`translate3d(0,${-lift*viewportH*.18}px,0)`);
    panels[3].style.clipPath=lift>=1?'none':`inset(${(1-lift)*100}% 0 0 0)`;
    frieze.style.visibility=unit>5.2&&unit<6.4?'visible':'hidden';
    setTransform(frieze,`translate3d(0,${(1-lift)*viewportH-27}px,0)`);
    const active=unit<=.8?0:unit>=2&&unit<=3?1:unit>=4.2&&unit<=5.2?2:unit>=6.4?3:-1;
    panels.forEach((panel,i)=>{panel.inert=i!==active;});
    const nearest=unit<1.4?0:unit<3.6?1:unit<5.8?2:3;
    sceneLinks.forEach((link,i)=>{if(i===nearest)link.setAttribute('aria-current','step');else link.removeAttribute('aria-current');});
    sceneNote.style.visibility=unit<6.4?'visible':'hidden';
  }
  function paint(){
    queued=false;
    const y=scrollY;
    if(!reduced.matches){
      renderEntrance(clamp((y-journeyTop)/distance));
      if(sceneMode)renderSequence(Math.max(0,Math.min(7,(y-sequenceTop)/sequenceUnit)));
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
    sceneMode=!reduced.matches&&viewportH>=620;
    document.body.classList.toggle('has-scroll-scenes',sceneMode);
    clearScenes();
    if(sceneMode&&panels.some(panel=>panel.scrollHeight>sequenceStage.clientHeight+4)){
      sceneMode=false;document.body.classList.remove('has-scroll-scenes');
    }
    markers.forEach((marker,i)=>{
      const name=panels[i].dataset.scene;
      if(sceneMode){panels[i].removeAttribute('id');marker.id=name;}
      else{marker.removeAttribute('id');panels[i].id=name;}
    });
    sequenceTop=sequence.getBoundingClientRect().top+scrollY;
    sequenceUnit=sequenceStage.clientHeight;
    if(sceneMode){
      const art=mascot.getBoundingClientRect(), parent=sequenceStage.getBoundingClientRect();
      circleX=art.left-parent.left+art.width*.5;
      circleY=art.top-parent.top+art.height*(335/720);
      circleMax=Math.hypot(Math.max(circleX,viewportW-circleX),Math.max(circleY,viewportH-circleY))+30;
      irisWorld.setAttribute('viewBox',`0 0 ${viewportW} ${viewportH}`);
      gateWidth=leftGate.getBoundingClientRect().width;
    }
    lastUnit=-1;
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
  // Align initial deep links after the progressive layout has its real scroll markers.
  if(['#soiree','#infos','#programme','#contact'].includes(location.hash)){
    requestAnimationFrame(()=>{document.getElementById(location.hash.slice(1))?.scrollIntoView({block:'start',behavior:'instant'});schedule();});
  }
})();
