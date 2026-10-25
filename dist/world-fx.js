/* Animate the existing painting in place; preserve one continuous world. */
(() => {
  const stage = document.querySelector('.world-stage');
  const image = document.querySelector('.world-illustration');
  const root = document.querySelector('.expedition');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const canvas = document.createElement('canvas');
  canvas.className = 'live-world';
  canvas.setAttribute('aria-hidden', 'true');
  stage.insertBefore(canvas, document.querySelector('.world-shade'));
  const gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: 'low-power', preserveDrawingBuffer: false });
  if (!gl) { canvas.remove(); return; }
  const vertex = `attribute vec2 a_position; varying vec2 v_uv; void main(){v_uv=a_position*.5+.5;gl_Position=vec4(a_position,0.,1.);}`;
  const fragment = `
    precision highp float;
    uniform sampler2D u_image;
    uniform vec2 u_view, u_art, u_camera, u_texel;
    uniform float u_time, u_motion;
    varying vec2 v_uv;
    float spot(vec2 p,vec2 center,vec2 radius){vec2 q=(p-center)/radius;return exp(-dot(q,q)*2.);}
    vec3 source(vec2 p){return texture2D(u_image,clamp(p,vec2(.0001),vec2(.9999))).rgb;}
    void main(){
      vec2 screen=vec2(v_uv.x,1.-v_uv.y)*u_view;
      vec2 uv=(screen-u_camera)/u_art;
      vec3 raw=source(uv);
      float t=u_time;
      float center=mix(.635,.585,smoothstep(.19,.36,uv.y));
      center=mix(center,.568,smoothstep(.44,.67,uv.y));
      float riverWidth=mix(.047,.055,smoothstep(.4,.65,uv.y));
      riverWidth=mix(riverWidth,.42,smoothstep(.86,.92,uv.y));
      float path=1.-smoothstep(riverWidth*.7,riverWidth,abs(uv.x-center));
      float cyan=smoothstep(.035,.17,min(raw.g,raw.b)-raw.r)*smoothstep(.25,.65,raw.g+raw.b);
      float water=path*cyan*smoothstep(.11,.15,uv.y);
      float pool=smoothstep(.865,.91,uv.y);
      vec2 drift=vec2(sin(uv.y*720.-t*4.2)*.00095+sin(uv.y*175.+t*1.4)*.0005,sin(uv.x*210.+t*2.)*.00022);
      drift=mix(drift,vec2(sin(uv.y*480.+t*1.7)*.0013,sin(uv.x*220.+t*1.2)*.00045),pool);
      float foliage=smoothstep(.02,.08,raw.g-max(raw.r*.88,raw.b*.92));
      foliage*=max(1.-smoothstep(.12,.17,uv.y),smoothstep(.7,.8,uv.y));
      float fabric=smoothstep(.02,.09,min(raw.r,raw.b)-raw.g)*smoothstep(.61,.72,uv.y);
      vec2 p=uv+drift*water*u_motion;
      p.x+=(foliage*.00055+fabric*.00075)*sin(t*1.1+uv.y*95.)*u_motion;
      vec3 c=source(p);
      // Modest edge contrast, using real source pixels rather than invented detail.
      vec3 neighbors=(source(p+vec2(u_texel.x,0.))+source(p-vec2(u_texel.x,0.))+source(p+vec2(0.,u_texel.y))+source(p-vec2(0.,u_texel.y)))*.25;
      vec3 detail=c-neighbors;
      c+=clamp(detail,vec3(-.10),vec3(.10))*.48;
      float flow=sin(uv.y*890.-t*7.5+sin(uv.x*240.)*2.);
      float ripple=sin(uv.x*250.+uv.y*630.-t*2.2);
      c+=vec3(.45,.85,1.)*(flow*.025*(1.-pool)+ripple*.022*pool)*water*u_motion;
      float torches=spot(uv,vec2(.10,.115),vec2(.047,.015))+spot(uv,vec2(.46,.128),vec2(.04,.014))+spot(uv,vec2(.95,.31),vec2(.06,.019))+spot(uv,vec2(.10,.49),vec2(.06,.022))+spot(uv,vec2(.16,.73),vec2(.06,.02))+spot(uv,vec2(.78,.75),vec2(.065,.023))+spot(uv,vec2(.12,.86),vec2(.065,.024))+spot(uv,vec2(.88,.83),vec2(.06,.024))+spot(uv,vec2(.36,.89),vec2(.07,.022));
      float flicker=.56+.22*sin(t*2.7+uv.x*9.)+.13*sin(t*4.3+uv.y*7.);
      float warm=smoothstep(.05,.26,raw.r-raw.b)*smoothstep(.35,.75,raw.r+raw.g);
      c+=vec3(1.,.55,.18)*torches*warm*(flicker-.45)*.19*u_motion;
      float surface=1.-smoothstep(.13,.17,uv.y);
      float riverShine=sin(uv.y*1750.+t*1.8)*.018*surface*cyan;
      c+=vec3(.6,.8,1.)*riverShine*u_motion;
      gl_FragColor=vec4(clamp(c,0.,1.),1.);
    }`;
  function compile(type, text) {
    const shader = gl.createShader(type); gl.shaderSource(shader, text); gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { gl.deleteShader(shader); return null; }
    return shader;
  }
  const vs = compile(gl.VERTEX_SHADER, vertex), fs = compile(gl.FRAGMENT_SHADER, fragment);
  if (!vs || !fs) { canvas.remove(); return; }
  const program = gl.createProgram(); gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { canvas.remove(); return; }
  gl.useProgram(program);
  const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
  const attribute = gl.getAttribLocation(program, 'a_position'); gl.enableVertexAttribArray(attribute); gl.vertexAttribPointer(attribute,2,gl.FLOAT,false,0,0);
  const uniforms = {};
  ['u_image','u_view','u_art','u_camera','u_texel','u_time','u_motion'].forEach(name => uniforms[name]=gl.getUniformLocation(program,name));
  const texture = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D,texture);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  let view={width:innerWidth,height:innerHeight,artWidth:innerWidth,artHeight:innerWidth*3,x:0,y:0};
  let ready=false,paused=false,visible=true,dirty=true,raf=0,lastFrame=0,lastDraw=0,time=0,draws=0,lost=false;
  function resize(){
    const ratio=Math.min(devicePixelRatio||1,1.75,Math.sqrt(2200000/(view.width*view.height)));
    const width=Math.max(1,Math.round(view.width*ratio)),height=Math.max(1,Math.round(view.height*ratio));
    if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;gl.viewport(0,0,width,height);}
  }
  function wanted(){return ready&&visible&&!document.hidden&&!lost&&!reduced.matches;}
  function draw(){
    resize();gl.useProgram(program);gl.bindTexture(gl.TEXTURE_2D,texture);
    gl.uniform1i(uniforms.u_image,0);gl.uniform2f(uniforms.u_view,view.width,view.height);gl.uniform2f(uniforms.u_art,view.artWidth,view.artHeight);
    gl.uniform2f(uniforms.u_camera,view.x,view.y);gl.uniform2f(uniforms.u_texel,1/image.naturalWidth,1/image.naturalHeight);
    gl.uniform1f(uniforms.u_time,time);gl.uniform1f(uniforms.u_motion,paused?0:1);
    gl.drawArrays(gl.TRIANGLES,0,6);draws++;dirty=false;stage.classList.add('has-live-world');
  }
  function frame(now){
    raf=0;if(!wanted()){lastFrame=0;return;}
    if(!paused&&lastFrame)time+=Math.min(50,now-lastFrame)/1000;
    lastFrame=now;
    if(dirty||(!paused&&now-lastDraw>=1000/30-.8)){draw();lastDraw=now;}
    if(!paused)raf=requestAnimationFrame(frame);else lastFrame=0;
  }
  function schedule(){dirty=true;if(wanted()&&!raf)raf=requestAnimationFrame(frame);}
  function load(){
    if(!image.complete||!image.naturalWidth||lost)return;
    try{gl.bindTexture(gl.TEXTURE_2D,texture);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);ready=true;schedule();}catch{stage.classList.remove('has-live-world');}
  }
  image.addEventListener('load',load);load();
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible){cancelAnimationFrame(raf);raf=0;lastFrame=0;}else schedule();}).observe(root);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;lastFrame=0;}else schedule();});
  reduced.addEventListener('change',()=>{stage.classList.remove('has-live-world');schedule();});
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();lost=true;cancelAnimationFrame(raf);raf=0;stage.classList.remove('has-live-world');});
  // A restored context needs new GPU resources; retain the complete HTML image fallback.
  window.WorldFx={setView(next){view=next;schedule();},setPaused(value){paused=value;schedule();},status(){return{ready,lost,paused,visible,draws,time,width:canvas.width,height:canvas.height,sourceWidth:image.naturalWidth,sourceHeight:image.naturalHeight};}};
})();
