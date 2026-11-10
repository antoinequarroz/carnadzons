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
  const backlight=$('.pyramid28-backlight');
  const fineHover=matchMedia('(hover: hover) and (pointer: fine)');
  const pointer={active:false,x:0,y:0};
  const depths=[...document.querySelectorAll('.pyramid27-depth')].map(element=>({
    element,depth:Number(element.dataset.depth),width:Number(element.dataset.width),height:Number(element.dataset.height),
    walls:[...element.querySelectorAll('.pyramid27-walls span')],
    carvings:[...element.querySelectorAll('.pyramid28-carving')].map(element=>({
      element,ambient:element.querySelector('.pyramid29-ambient'),wash:element.querySelector('.pyramid29-wash'),
      spot:element.querySelector('.pyramid29-pointer'),focus:element.querySelector('.pyramid29-focus'),
      matrix:null,available:false
    }))
  }));
  const clamp=x=>Math.max(0,Math.min(1,x));
  const easeOut=x=>1-Math.pow(1-clamp(x),3);
  const easeInOut=x=>{const t=clamp(x);return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;};
  let viewportW=0,viewportH=0,heroAnchorY=0,base=1,distance=1,journeyTop=0,pageHeight=1;
  let queued=false,previous=-1,current=0,target=0,lastTime=0,lastY=scrollY,ready=false,active='';
  let sectionBounds=[],artBounds=[],initialAnchorAllowed=true;
  // One broad vestibule replaces the repeated frames. The front threshold
  // and the wide rear opening still share the same reversible camera.
  const cameraStops=[[0,0],[.12,.1],[.48,.97],[.9,1.78],[1,1.95]];
  function cameraAt(p){
    for(let i=1;i<cameraStops.length;i++){
      const [end,value]=cameraStops[i], [start,prior]=cameraStops[i-1];
      if(p<=end)return prior+(value-prior)*(p-start)/(end-start);
    }
    return cameraStops.at(-1)[1];
  }
  function coverScale(anchorY,width,height){
    return Math.max(viewportW/width,2*Math.max(anchorY,viewportH-anchorY)/height)*1.08;
  }
  function placeWalls(walls,left,right,top,bottom){
    walls[0].style.transform=`translate3d(0,${top-viewportH}px,0)`;
    walls[1].style.transform=`translate3d(0,${bottom}px,0)`;
    walls[2].style.transform=`translate3d(${left-viewportW}px,0,0)`;
    walls[3].style.transform=`translate3d(${right}px,0,0)`;
  }
  function projectCarving(carving,points){
    // Unit-square homography: the carved vector follows all four wall corners,
    // including their vanishing-point compression, using one CSS transform.
    const [[x0,y0],[x1,y1],[x2,y2],[x3,y3]]=points;
    const dx1=x1-x2,dx2=x3-x2,dx3=x0-x1+x2-x3;
    const dy1=y1-y2,dy2=y3-y2,dy3=y0-y1+y2-y3;
    const determinant=dx1*dy2-dx2*dy1;
    if(Math.abs(determinant)<.000001){carving.element.style.visibility='hidden';carving.available=false;return;}
    const g=(dx3*dy2-dx2*dy3)/determinant,h=(dx1*dy3-dx3*dy1)/determinant;
    const a=x1-x0+g*x1,b=x3-x0+h*x3,d=y1-y0+g*y1,e=y3-y0+h*y3;
    const matrix=[a/240,d/240,0,g/240,b/315,e/315,0,h/315,0,0,1,0,x0,y0,0,1];
    carving.matrix=matrix;carving.available=true;
    carving.element.style.transform=`matrix3d(${matrix.join(',')})`;
    carving.element.style.visibility='inherit';
  }
  function connectWalls(walls,near,far,carvings,passed){
    // Four simple clipped planes stay viewport-sized; no oversized bitmap
    // or blurred background is stretched during the perspective traverse.
    const point=(x,y)=>`${x.toFixed(3)}px ${y.toFixed(3)}px`;
    const polygons=[
      [[near.left,near.top],[near.right,near.top],[far.right,far.top],[far.left,far.top]],
      [[near.left,near.bottom],[far.left,far.bottom],[far.right,far.bottom],[near.right,near.bottom]],
      [[near.left,near.top],[far.left,far.top],[far.left,far.bottom],[near.left,near.bottom]],
      [[near.right,near.top],[near.right,near.bottom],[far.right,far.bottom],[far.right,far.top]]
    ];
    polygons.forEach((points,index)=>walls[index].style.clipPath=`polygon(${points.map(p=>point(...p)).join(',')})`);
    const nested=far.left>near.left+.1&&far.right<near.right-.1&&far.top>near.top+.1&&far.bottom<near.bottom-.1;
    carvings.forEach((carving,index)=>{
      if(!nested||passed){carving.element.style.visibility='hidden';carving.available=false;return;}
      const points=index===0?polygons[2]:[polygons[3][0],polygons[3][3],polygons[3][2],polygons[3][1]];
      projectCarving(carving,points);
    });
  }
  function localPointer(matrix,x,y){
    const a=matrix[0]-x*matrix[3],b=matrix[4]-x*matrix[7],c=x-matrix[12];
    const d=matrix[1]-y*matrix[3],e=matrix[5]-y*matrix[7],f=y-matrix[13];
    const determinant=a*e-b*d;
    if(Math.abs(determinant)<.000001)return null;
    return {x:(c*e-b*f)/determinant,y:(a*f-c*d)/determinant};
  }
  function paintPointer(p){
    const enabled=pointer.active&&fineHover.matches&&!reduced.matches&&p>.18&&p<.9;
    if(!fineHover.matches||reduced.matches||p>=.9||p<=.18)pointer.active=false;
    for(const slice of depths)for(const carving of slice.carvings){
      const point=enabled&&carving.available&&carving.matrix?localPointer(carving.matrix,pointer.x,pointer.y):null;
      const hit=point&&point.x>=0&&point.x<=240&&point.y>=0&&point.y<=315;
      if(hit){carving.focus.setAttribute('cx',point.x.toFixed(3));carving.focus.setAttribute('cy',point.y.toFixed(3));}
      carving.spot.style.opacity=hit?'1':'0';
    }
  }
  function clearPointer(){if(pointer.active){pointer.active=false;schedule();}}
  function movePointer(event){
    if(!fineHover.matches||reduced.matches||event.pointerType!=='mouse'||!Number.isFinite(event.clientX)||!Number.isFinite(event.clientY)||current<=.18||current>=.9||event.target?.closest?.('a,button,input,summary')){clearPointer();return;}
    pointer.active=true;pointer.x=event.clientX;pointer.y=event.clientY;schedule();
  }
  function renderEntrance(p){
    if(Math.abs(p-previous)<.00001)return;
    previous=p;
    const camera=cameraAt(p);
    if(backlight){
      const light=easeOut((p-.14)/.48)*(1-easeInOut((p-.72)/.22));
      backlight.style.opacity=light;
      backlight.style.transform=`translate3d(0,${12*(1-light)}px,0) scale(${.94+.06*light})`;
    }
    const anchorY=heroAnchorY+(viewportH*.5-heroAnchorY)*easeInOut(p/.44);
    const limit=coverScale(anchorY,192,279),denominator=1-camera;
    const crossed=denominator<=base/limit;
    const scale=crossed?limit:base/denominator;
    world.style.transform=`translate3d(${viewportW/2-720*scale}px,${anchorY-722.5*scale}px,0) scale(${scale})`;
    world.style.visibility=crossed?'hidden':'visible';
    const doorLeft=viewportW/2-112*scale,doorRight=viewportW/2+112*scale;
    const doorTop=anchorY-157.5*scale,doorBottom=anchorY+157.5*scale;
    placeWalls(mattes,doorLeft,doorRight,doorTop,doorBottom);
    for(const matte of mattes)matte.style.visibility=crossed?'hidden':'visible';
    const near={left:doorLeft+16*scale,right:doorRight-16*scale,top:doorTop+18*scale,bottom:doorBottom-18*scale};
    for(const slice of depths){
      const remaining=1+slice.depth-camera,cap=coverScale(anchorY,slice.width,slice.height);
      const passed=remaining<=base/cap,projection=passed?cap:base/remaining;
      slice.element.style.visibility=passed?'hidden':'visible';
      const far={left:viewportW/2-slice.width*.5*projection,right:viewportW/2+slice.width*.5*projection,top:anchorY-slice.height*.5*projection,bottom:anchorY+slice.height*.5*projection};
      connectWalls(slice.walls,near,far,slice.carvings,passed);
      const exposure=easeInOut((p-.18)/.5);
      for(const carving of slice.carvings){
        carving.ambient.style.opacity=exposure*.78;
        carving.wash.setAttribute('gradientTransform',`translate(${160-400*exposure} 0)`);
      }
    }
    const fade=1-easeOut(p/.25);
    title.style.opacity=fade;title.style.transform=`translate3d(0,${-46*(1-fade)}px,0)`;venue.style.opacity=fade;
    const ui=1-easeOut(p/.24);
    cue.style.opacity=ui;caption.style.opacity=ui;skip.style.opacity=ui;skip.style.visibility=p>.25?'hidden':'visible';
    const angle=easeInOut((p-.12)/.28)*103;
    doors[0].style.transform=`perspective(440px) rotateY(${angle}deg)`;
    doors[1].style.transform=`perspective(440px) rotateY(${-angle}deg)`;
    const drift=easeOut(p/.62);
    dunes[0].setAttribute('transform',`translate(${-12*drift} ${3*drift})`);
    dunes[1].setAttribute('transform',`translate(${15*drift} ${8*drift})`);
    halo.setAttribute('transform',`translate(0 ${-12*drift})`);
    const reveal=easeOut((p-.58)/.29);
    arrivalCopy.style.opacity=reveal;
    arrivalCopy.style.transform=`translate3d(0,${18*(1-reveal)}px,0)`;
    arrival.style.visibility=p>.18?'visible':'hidden';arrival.inert=p<.74;
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
    paintPointer(current);
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
  fineHover.addEventListener('change',clearPointer);
  addEventListener('pointermove',movePointer,{passive:true});
  addEventListener('blur',clearPointer);
  addEventListener('pointercancel',clearPointer);
  addEventListener('pointerout',event=>{if(!event.relatedTarget)clearPointer();});
  document.addEventListener('pointerleave',clearPointer);
  for(const type of ['pointerdown','wheel','touchstart','keydown'])addEventListener(type,()=>{initialAnchorAllowed=false;},{once:true,passive:true});
  document.fonts.ready.then(()=>{measure();if(initialAnchorAllowed)alignHash();});
  measure();requestAnimationFrame(alignHash);
})();
