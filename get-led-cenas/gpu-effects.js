/* GET LED CENAS · Immersive GPU Layer v0.6
   WebGL lightweight additive light field. Zero dependencies.
   The underlying photo remains a visual reference; this is not true 3D geometry or a VR experience.
   Architecture: one Canvas & WebGL context / user-triggered start / reduced-motion friendly / CSS fallback.
*/
(() => {
  'use strict';
  const canvas = document.getElementById('gpuSceneCanvas');
  const host = document.getElementById('modalVisual');
  if (!canvas || !host) return;
  const prefersReduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  let gl = null, program = null, buffer = null, loc = {}, raf = 0, running = false;
  let lastFrame = 0, startTime = performance.now(), sequenceAt = -1, lastClientW = 0, lastClientH = 0;
  const current = { led: .10, tv: 0, shade: 0, audio: 0 };
  const target = { led: .10, tv: 0, shade: 0, audio: 0 };
  const vs = `
    attribute vec2 a_pos;
    varying vec2 v_uv;
    void main() {
      v_uv = a_pos * .5 + .5;
      gl_Position = vec4(a_pos, 0., 1.);
    }
  `;
  const fs = `
    precision mediump float;
    varying vec2 v_uv;
    uniform vec2 u_size;
    uniform float u_time;
    uniform float u_led;
    uniform float u_tv;
    uniform float u_shade;
    uniform float u_audio;
    uniform float u_seq;
    float gaussian(float d, float width) { return exp(-d*d/max(width*width,.0000001)); }
    float sdLine(vec2 p, vec2 a, vec2 b) {
      vec2 ba=b-a;
      float t=clamp(dot(p-a,ba)/dot(ba,ba),0.,1.);
      return length((p-a)-ba*t);
    }
    float softCircle(vec2 p, vec2 center, vec2 radius, float thickness) {
      float d=abs(length((p-center)/radius)-1.);
      return exp(-pow(d/max(thickness,.003),2.));
    }
    void main() {
      vec2 p=vec2(v_uv.x, 1.-v_uv.y);
      float aspect=max(u_size.x,1.)/max(u_size.y,1.);
      float led=smoothstep(.0,.9,u_led);
      float tv=clamp(u_tv,0.,1.);
      float audio=clamp(u_audio,0.,1.);
      float curtain=clamp(u_shade,0.,1.);
      float shimmer=.86 + .14*sin(u_time*1.35);

      // Ceiling slots mapped to the two diagonal recesses in the reference living image.
      float d1=sdLine(p,vec2(.255,.005),vec2(.366,.355));
      float d2=sdLine(p,vec2(.293,.004),vec2(.417,.352));
      float ledCore=(gaussian(d1,.00185)+gaussian(d2,.00185))*.34*led;
      float ledHalo=(gaussian(d1,.017)+gaussian(d2,.017))*.24*led*shimmer;
      float ledWide=(gaussian(d1,.055)+gaussian(d2,.055))*.12*led;
      vec3 warm=vec3(1.,.70,.38);
      vec3 color=warm*(ledCore+ledHalo+ledWide);
      float alpha=(ledCore*.75+ledHalo*.8+ledWide*.64);

      // Two warm decorative rings aligned to the pendant fixtures.
      float pendantA=softCircle(p,vec2(.115,.412),vec2(.067,.017),.20);
      float pendantB=softCircle(p,vec2(.195,.451),vec2(.045,.012),.24);
      float pendant=clamp(pendantA+pendantB,0.,1.)*(led*.48+.04);
      color+=vec3(1.,.76,.46)*pendant*.42;
      alpha+=pendant*.22;

      // TV screen glow / simulated audiovisual power-up on its right wall.
      vec2 tvd=(p-vec2(.876,.425))/vec2(.19,.255);
      float halo=exp(-dot(tvd,tvd)*2.2)*tv;
      float lineFlux=gaussian(p.y-(.42+.003*sin(u_time*1.1)),.085)*gaussian(p.x-.865,.17)*tv;
      vec3 tvBlue=vec3(.16,.55,1.);
      color+=tvBlue*(halo*.24+lineFlux*.13);
      alpha+=(halo*.17+lineFlux*.08);

      // Soundbar energy pulse - a short, soft radiating field.
      vec2 ad=(p-vec2(.865,.66))/vec2(.18,.075);
      float wave=exp(-dot(ad,ad)*3.6)*audio*(.75+.25*sin(u_time*4.2));
      color+=vec3(.22,.91,.94)*wave*.20;
      alpha+=wave*.14;

      // Tone compensation with closed curtain: reduce window spill and emphasize LED glow.
      color*=1. + curtain*.06;
      float cinematicFlash = u_seq*.12*gaussian(length(p-vec2(.58,.5)),.38);
      color+=vec3(.45,.80,1.)*cinematicFlash;
      alpha+=cinematicFlash*.17;

      float outA=clamp(alpha,0.,.66);
      vec3 outC=clamp(color,0.,1.);
      gl_FragColor=vec4(outC,outA);
    }
  `;
  function compile(type, code) {
    const shader=gl.createShader(type);
    gl.shaderSource(shader,code);gl.compileShader(shader);
    if (!gl.getShaderParameter(shader,gl.COMPILE_STATUS)) {
      const err=gl.getShaderInfoLog(shader);gl.deleteShader(shader);throw new Error(err);
    }
    return shader;
  }
  function setup() {
    if (gl) return true;
    try {
      gl = canvas.getContext('webgl', {alpha:true,antialias:false,depth:false,stencil:false,premultipliedAlpha:false,preserveDrawingBuffer:false,powerPreference:'low-power'});
      if (!gl) throw new Error('WebGL indisponível');
      program=gl.createProgram();
      gl.attachShader(program,compile(gl.VERTEX_SHADER,vs));
      gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fs));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program,gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
      gl.useProgram(program);
      buffer=gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
      gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1, 1,-1,1,1,-1,1]),gl.STATIC_DRAW);
      const attr=gl.getAttribLocation(program,'a_pos');
      gl.enableVertexAttribArray(attr);gl.vertexAttribPointer(attr,2,gl.FLOAT,false,0,0);
      for(const name of ['u_size','u_time','u_led','u_tv','u_shade','u_audio','u_seq']) loc[name]=gl.getUniformLocation(program,name);
      gl.disable(gl.DEPTH_TEST);
      gl.clearColor(0,0,0,0);
      canvas.classList.add('gpu-ready');
      host.dataset.renderer='WebGL';
      canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();stop();canvas.classList.remove('gpu-ready');gl=null;program=null;});
      return true;
    } catch (error) {
      host.dataset.renderer='CSS';
      canvas.classList.remove('gpu-ready');
      console.info('GET LED CENAS: fallback CSS disponível.',error.message);
      return false;
    }
  }
  function resize() {
    const rect=host.getBoundingClientRect();
    const w=Math.max(1,Math.floor(rect.width));const h=Math.max(1,Math.floor(rect.height));
    if(w===lastClientW&&h===lastClientH)return;
    lastClientW=w;lastClientH=h;
    const dpr=Math.min(window.devicePixelRatio||1,1.5);
    canvas.width=Math.floor(w*dpr);canvas.height=Math.floor(h*dpr);
    gl.viewport(0,0,canvas.width,canvas.height);
  }
  function draw(now) {
    if(!running||!gl)return;
    raf=window.requestAnimationFrame(draw);
    if(now-lastFrame<(prefersReduced?65:30))return;
    const dt=Math.min((now-lastFrame)/1000,.075);lastFrame=now;
    resize();
    const lerp=prefersReduced?1:Math.min(1,dt*4.4);
    for(const key in current)current[key]+=(target[key]-current[key])*lerp;
    let seq=0;
    if(sequenceAt>=0){let t=(now-sequenceAt)/1000;if(t<2.6)seq= Math.max(0,Math.sin(t*Math.PI/2.6));else sequenceAt=-1;}
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.uniform2f(loc.u_size,canvas.width,canvas.height);
    gl.uniform1f(loc.u_time,(now-startTime)/1000);
    gl.uniform1f(loc.u_led,current.led);
    gl.uniform1f(loc.u_tv,current.tv);
    gl.uniform1f(loc.u_shade,current.shade);
    gl.uniform1f(loc.u_audio,current.audio);
    gl.uniform1f(loc.u_seq,seq);
    gl.drawArrays(gl.TRIANGLES,0,6);
  }
  function start() {
    if(running)return;
    if(!setup())return;
    running=true;lastFrame=performance.now()-60;
    raf=window.requestAnimationFrame(draw);
  }
  function stop() {
    running=false;if(raf)cancelAnimationFrame(raf);raf=0;sequenceAt=-1;
  }
  function setScene(next={}) {
    for(const key in target){if(Number.isFinite(next[key]))target[key]=Math.max(0,Math.min(1,next[key]));}
  }
  function playSequence() {sequenceAt=performance.now();}
  window.GetLedGPU={start,stop,setScene,playSequence,get status(){return {mode:host.dataset.renderer||'pending',running,values:{...current}};}};
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else if(!host.closest('.hidden'))start();});
})();
