/* Native-size texture overlays: animate only the water pixels, leave architecture intact. */
(()=>{
 const reduce=matchMedia('(prefers-reduced-motion: reduce)'),effects=[];
 function create(owner,kind){
  const img=owner.querySelector('img'),canvas=document.createElement('canvas');canvas.className='water-motion';canvas.setAttribute('aria-hidden','true');owner.append(canvas);
  const gl=canvas.getContext('webgl',{alpha:true,premultipliedAlpha:false,antialias:false,depth:false,stencil:false,powerPreference:'low-power'});if(!gl){canvas.remove();return;}
  const vertex=`attribute vec2 p;varying vec2 uv;void main(){uv=p*.5+.5;gl_Position=vec4(p,0.,1.);}`;
  const fragment=`precision highp float;uniform sampler2D image;uniform vec2 view,art,crop;uniform float time,kind;varying vec2 uv;
   vec3 sampleAt(vec2 p){return texture2D(image,clamp(p,vec2(.0001),vec2(.9999))).rgb;}
   void main(){vec2 pixel=vec2(uv.x,1.-uv.y)*view;vec2 p=(pixel+crop)/art;vec3 original=sampleAt(p);float cyan=smoothstep(.035,.14,min(original.g,original.b)-original.r);float pool=kind<.5?smoothstep(.68,.73,p.y):smoothstep(.71,.8,p.y);float fall=kind<.5?0.:(1.-smoothstep(.035,.052,abs(p.x-.615)))*smoothstep(.05,.1,p.y);float mask=cyan*max(pool,fall);
   vec2 flow=vec2(sin(p.y*390.-time*2.7)*.0011+sin(p.x*100.+time)*.0005,sin(p.x*160.+time*1.9)*.00065);flow=mix(flow,vec2(sin(p.y*320.-time*5.)*.0009,-.0015*sin(time*1.6+p.x*90.)),fall);
   vec3 c=sampleAt(p+flow*mask);float ripples=sin(p.y*780.-time*3.7+sin(p.x*120.+time)*1.7);float foam=pow(max(0.,sin(p.y*1300.-time*18.+p.x*22.)),12.);c+=vec3(.6,.84,1.)*ripples*.012*pool;c+=vec3(.7,.95,1.)*foam*.022*fall;gl_FragColor=vec4(clamp(c,0.,1.),mask*.96);}`;
  const compile=(type,src)=>{const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);return gl.getShaderParameter(s,gl.COMPILE_STATUS)?s:null;};
  const vs=compile(gl.VERTEX_SHADER,vertex),fs=compile(gl.FRAGMENT_SHADER,fragment);if(!vs||!fs){canvas.remove();return;}
  const program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS)){canvas.remove();return;}gl.useProgram(program);
  const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);const position=gl.getAttribLocation(program,'p');gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
  const uniform={};['image','view','art','crop','time','kind'].forEach(k=>uniform[k]=gl.getUniformLocation(program,k));const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  let ready=false,visible=false,paused=false,lost=false,raf=0,last=0,lastDraw=0,time=0,draws=0,w=1,h=1,aw=1,ah=1,cx=0,cy=0;
  function size(){w=owner.clientWidth;h=owner.clientHeight;const scale=Math.max(w/(img.naturalWidth||1672),h/(img.naturalHeight||941));aw=(img.naturalWidth||1672)*scale;ah=(img.naturalHeight||941)*scale;cx=(aw-w)*(kind&&innerWidth<=600?.55:.5);cy=(ah-h)*(kind?.5:.6);const dpr=Math.min(devicePixelRatio||1,1.5,Math.sqrt(1800000/Math.max(1,w*h)));canvas.width=Math.max(1,Math.round(w*dpr));canvas.height=Math.max(1,Math.round(h*dpr));gl.viewport(0,0,canvas.width,canvas.height);}
  const wanted=()=>ready&&visible&&!paused&&!reduce.matches&&!document.hidden&&!lost;
  function draw(){gl.useProgram(program);gl.bindTexture(gl.TEXTURE_2D,texture);gl.uniform1i(uniform.image,0);gl.uniform2f(uniform.view,w,h);gl.uniform2f(uniform.art,aw,ah);gl.uniform2f(uniform.crop,cx,cy);gl.uniform1f(uniform.time,time);gl.uniform1f(uniform.kind,kind);gl.drawArrays(gl.TRIANGLES,0,6);draws++;}
  function frame(now){raf=0;if(!wanted()){last=0;return;}if(last)time+=Math.min(50,now-last)/1000;last=now;if(now-lastDraw>32.5){draw();lastDraw=now;}raf=requestAnimationFrame(frame);}
  function sync(){canvas.style.visibility=reduce.matches||lost?'hidden':'visible';if(wanted()&&!raf)raf=requestAnimationFrame(frame);else if(!wanted()){cancelAnimationFrame(raf);raf=0;last=0;}}
  function load(){if(ready||!img.complete||!img.naturalWidth||lost)return;try{gl.bindTexture(gl.TEXTURE_2D,texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);ready=true;size();sync();}catch{canvas.remove();}}
  img.addEventListener('load',load);load();new ResizeObserver(()=>{if(ready&&!lost){size();if(visible)draw();}}).observe(owner);new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();}).observe(owner);document.addEventListener('visibilitychange',sync);reduce.addEventListener('change',sync);canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();lost=true;sync();});
  effects.push({pause(v){paused=v;sync();},status(){return{kind,ready,visible,paused,lost,draws,width:canvas.width,height:canvas.height};}});
 }
 document.querySelectorAll('[data-water-scene]').forEach((el,i)=>create(el,i));window.WaterMotion={pause(value){effects.forEach(e=>e.pause(value));},status(){return effects.map(e=>e.status());}};
})();
