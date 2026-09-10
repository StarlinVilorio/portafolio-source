"use client";
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { controller } from '@/lib/particle-formations';

const vertex = `
attribute vec3 aCloud;
attribute vec3 aPortal;
attribute vec3 aOrbit;
attribute vec3 aStar;
attribute vec3 aRibbon;
attribute vec3 aColor;
attribute float aSeed;
attribute float aSize;
attribute float aOpacity;
uniform float uTime;
uniform float uMorph;
uniform float uAssemble;
uniform float uDpr;
uniform float uAspect;
uniform vec2 uPointer;
varying float vLight;
varying float vSoft;
varying vec3 vColor;
void main(){
 float j=clamp(uMorph,0.,4.);
 float f=smoothstep(.08,.92,fract(j));
 vec3 p=j<1.?mix(aPortal,position,f):j<2.?mix(position,aOrbit,f):j<3.?mix(aOrbit,aStar,f):mix(aStar,aRibbon,f);
 if(j>=4.)p=aRibbon;
 // A brief outward breath connects each target instead of cutting between objects.
 p+=normalize(aCloud)*sin(f*3.14159)*.26;
 // The portal is present from the first frame; only scroll controls convergence.
 p+=vec3(sin(uTime*.45+aSeed*71.),cos(uTime*.38+aSeed*43.),sin(uTime*.3+aSeed*23.))*.018;
 vec4 mv=modelViewMatrix*vec4(p,1.);
 vec4 clip=projectionMatrix*mv;
 vec2 delta=(clip.xy/clip.w-uPointer)*vec2(uAspect,1.);
 float influence=exp(-dot(delta,delta)*48.);
 mv.xy+=normalize(delta+vec2(.001))*influence*.16;
 gl_Position=projectionMatrix*mv;
 float depth=clamp(6./-mv.z,.45,1.6);
 vLight=(.79+.21*sin(aSeed*193.+uTime*1.3)+influence*.55)*aOpacity*depth;
 vColor=mix(aColor,vec3(1.,.95,.97),influence*.35);
 vSoft=smoothstep(.3,2.5,abs(-mv.z-6.));
 gl_PointSize=clamp(aSize*uDpr*depth*(1.+vSoft*.5),1.,10.);
}`;
const fragment = `
varying float vLight;
varying float vSoft;
varying vec3 vColor;
void main(){
 float r=length(gl_PointCoord-.5)*2.;
 if(r>1.)discard;
 float core=exp(-r*r*mix(10.,4.,vSoft));
 float halo=exp(-r*r*2.8)*.24;
 gl_FragColor=vec4(vColor,(core+halo)*vLight*(1.-smoothstep(.75,1.,r)));
}`;
const dustVertex=`
attribute float aSeed;
uniform float uTime;
uniform float uDpr;
varying float vOpacity;
varying vec3 vColor;
void main(){
 vec3 p=position;
 p.xy+=vec2(sin(uTime*.12+aSeed*30.),cos(uTime*.1+aSeed*40.))*.12;
 vec4 mv=modelViewMatrix*vec4(p,1.);
 float near=clamp((p.z+3.)/7.,0.,1.);
 gl_Position=projectionMatrix*mv;
 gl_PointSize=(1.3+near*near*19.)*uDpr;
 vOpacity=.15+near*.12;
 vColor=mix(vec3(.43,.46,.49),vec3(.8,.03,.09),step(.48,aSeed));
}`;
const dustFragment=`
varying float vOpacity;
varying vec3 vColor;
void main(){
 float r=length(gl_PointCoord-.5)*2.;
 if(r>1.)discard;
 gl_FragColor=vec4(vColor,exp(-r*r*4.)*vOpacity*(1.-smoothstep(.55,1.,r)));
}`;

export function JourneyScene({onReady}:{onReady?:()=>void}){
 const ref=useRef<HTMLCanvasElement>(null);
 const [fallback,setFallback]=useState(false);
 useEffect(()=>{
  const canvas=ref.current,host=document.getElementById('journey');if(!canvas||!host)return;
  const root=document.documentElement,media=matchMedia('(prefers-reduced-motion: reduce)');
  let renderer:THREE.WebGLRenderer;
  try{renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:false,powerPreference:'high-performance'})}catch{setFallback(true);return}
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(38,1,.1,40);camera.position.z=6;
  const count=innerWidth<760?12000:32000,data=controller(count),geometry=new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.BufferAttribute(data.pos,3));
  geometry.setAttribute('aPortal',new THREE.BufferAttribute(data.portal,3));
  geometry.setAttribute('aCloud',new THREE.BufferAttribute(data.cloud,3));
  geometry.setAttribute('aOrbit',new THREE.BufferAttribute(data.orbit,3));
  geometry.setAttribute('aSeed',new THREE.BufferAttribute(data.seeds,1));
  geometry.setAttribute('aStar',new THREE.BufferAttribute(data.star,3));
  geometry.setAttribute('aRibbon',new THREE.BufferAttribute(data.ribbon,3));
  geometry.setAttribute('aColor',new THREE.BufferAttribute(data.colors,3));
  geometry.setAttribute('aSize',new THREE.BufferAttribute(data.sizes,1));
  geometry.setAttribute('aOpacity',new THREE.BufferAttribute(data.opacities,1));
  // Spread a reduced draw range across every anatomical feature.
  geometry.setIndex(Array.from({length:count},(_,i)=>(i*7919)%count));
  const uniforms={uTime:{value:0},uMorph:{value:0},uAssemble:{value:0},uDpr:{value:1},uAspect:{value:1},uPointer:{value:new THREE.Vector2(10,10)}};
  const material=new THREE.ShaderMaterial({vertexShader:vertex,fragmentShader:fragment,uniforms,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending});
  const points=new THREE.Points(geometry,material);points.frustumCulled=false;scene.add(points);
  const dustGeometry=new THREE.BufferGeometry(),dust=new Float32Array(360*3),dustSeeds=new Float32Array(360);
  for(let i=0;i<360;i++){dust.set([Math.sin(i*127.1)*8,Math.cos(i*311.7)*5,Math.sin(i*43.7)*6-2],i*3);dustSeeds[i]=(i*.6180339)%1}
  dustGeometry.setAttribute('position',new THREE.BufferAttribute(dust,3));
  dustGeometry.setAttribute('aSeed',new THREE.BufferAttribute(dustSeeds,1));
  const dustMaterial=new THREE.ShaderMaterial({vertexShader:dustVertex,fragmentShader:dustFragment,uniforms,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending});
  const atmosphere=new THREE.Points(dustGeometry,dustMaterial);scene.add(atmosphere);
  const memory=(navigator as Navigator & {deviceMemory?:number}).deviceMemory;
  let lowPower=(memory!==undefined&&memory<=2)||navigator.hardwareConcurrency<=2;
  let frame=0,last=0,time=0,progress=0,targetProgress=0,visible=true,dead=false,slowFrames=0,measuredFrames=0,rendered=0;
  const pointerTarget=new THREE.Vector2(10,10);
  const moving=()=>root.dataset.effects==='on'&&!media.matches&&!lowPower;
  const measure=()=>{
   const bounds=host.getBoundingClientRect(),finale=host.querySelector('.chapter-finale')!.getBoundingClientRect();
   const storyHeight=finale.bottom-bounds.top-innerHeight;
   targetProgress=Math.max(0,-bounds.top/Math.max(1,storyHeight));
   host.style.setProperty('--journey-progress',String(Math.min(1,-bounds.top/Math.max(1,bounds.height-innerHeight))));
  };
  const render=()=>{
   const enabled=moving(),p=enabled?progress:0;
   camera.position.z=(canvas.clientWidth<760?7.8:6)-Math.sin(Math.min(1,p)*Math.PI)*.55;
   uniforms.uTime.value=enabled?time:0;
   uniforms.uAssemble.value=enabled?THREE.MathUtils.smoothstep(time,0,2.2):1;
   uniforms.uMorph.value=p<=1?Math.min(4,p*4):4-(.5-.5*Math.cos((p-1)*Math.PI))*2;
   points.rotation.set(-.1+(enabled?Math.sin(time*.2)*.035:0),-.08+(enabled?Math.sin(time*.16)*.045:0)+Math.min(1,p)*.14+(uniforms.uPointer.value.x<2?uniforms.uPointer.value.x*.07:0),-.055);
   const mobile=canvas.clientWidth<760;
   points.position.x=mobile?0:THREE.MathUtils.lerp(Math.sin(p*Math.PI*4)*1.3,-1.3,THREE.MathUtils.smoothstep(p,.78,1));
   points.position.y=THREE.MathUtils.lerp(.18,0,THREE.MathUtils.smoothstep(p,0,.16));
   const scale=mobile?.59:THREE.MathUtils.lerp(1.12,.88,THREE.MathUtils.smoothstep(p,.4,.7));points.scale.setScalar(scale);
   geometry.setDrawRange(0,enabled?count:3500);
   atmosphere.visible=enabled;
   renderer.render(scene,camera);
   if(rendered===0)onReady?.();
   rendered++;
   canvas.dataset.renderedFrames=String(rendered);
   canvas.dataset.sceneMotion=enabled?'animated':'static';
   canvas.dataset.morph=String(uniforms.uMorph.value);
   canvas.dataset.activeParticles=String(enabled?count:3500);
  };
  const tick=(now:number)=>{
   frame=0;if(dead||!visible||document.hidden)return;
   const elapsed=now-last;
   if(elapsed>=32){
    time+=Math.min(elapsed,100)/1000;last=now;
    progress=targetProgress;
    uniforms.uPointer.value.lerp(pointerTarget,1-Math.exp(-elapsed/180));
    if(time>4){measuredFrames++;if(elapsed>85)slowFrames++}
    if(measuredFrames>=90){if(slowFrames/measuredFrames>.65)lowPower=true;measuredFrames=0;slowFrames=0}
    render();
   }
   if(moving())frame=requestAnimationFrame(tick);
  };
  const sync=()=>{cancelAnimationFrame(frame);frame=0;measure();if(!visible||document.hidden)return;render();last=performance.now();if(moving())frame=requestAnimationFrame(tick)};
  const resize=()=>{const w=canvas.clientWidth,h=canvas.clientHeight;renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(w,h,false);camera.aspect=w/h;camera.position.z=w<760?7.8:6;camera.updateProjectionMatrix();uniforms.uDpr.value=renderer.getPixelRatio();uniforms.uAspect.value=w/h;sync()};
  const pointer=(e:PointerEvent)=>{if(moving()&&e.pointerType==='mouse')pointerTarget.set(e.clientX/innerWidth*2-1,1-e.clientY/innerHeight*2)};
  const leave=()=>{pointerTarget.set(10,10);uniforms.uPointer.value.set(10,10)};
  const scroll=()=>{measure();if(!moving())return;if(!frame&&visible)sync()};
  const ro=new ResizeObserver(resize);ro.observe(canvas);ro.observe(host);
  const io=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync()});io.observe(canvas);
  const preferenceChange=()=>{leave();sync()};
  const mo=new MutationObserver(preferenceChange);mo.observe(root,{attributes:true,attributeFilter:['data-effects','lang']});
  addEventListener('scroll',scroll,{passive:true});addEventListener('pointermove',pointer,{passive:true});document.addEventListener('pointerleave',leave);document.addEventListener('visibilitychange',sync);media.addEventListener('change',preferenceChange);resize();
  const contextLost=(event:Event)=>{event.preventDefault();cancelAnimationFrame(frame);setFallback(true)};
  canvas.addEventListener('webglcontextlost',contextLost);
  canvas.dataset.particles=String(count);
  return()=>{dead=true;canvas.removeEventListener('webglcontextlost',contextLost);cancelAnimationFrame(frame);ro.disconnect();io.disconnect();mo.disconnect();removeEventListener('scroll',scroll);removeEventListener('pointermove',pointer);document.removeEventListener('pointerleave',leave);document.removeEventListener('visibilitychange',sync);media.removeEventListener('change',preferenceChange);geometry.dispose();material.dispose();dustGeometry.dispose();dustMaterial.dispose();renderer.dispose()};
 },[onReady]);
 if(fallback)return <img className="journey-canvas" src="/assets/portfolio/portal-poster.svg" alt=""/>;
 return <canvas ref={ref} className="journey-canvas" aria-hidden="true"/>;
}



