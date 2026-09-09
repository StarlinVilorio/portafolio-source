"use client";
import { useEffect, useRef } from 'react';

/** A lightweight, projected 3D point field. No model downloads or continuous offscreen work. */
export function DepthField(){
 const canvas=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const el=canvas.current;
  if(!el)return;
  const ctx=el.getContext('2d',{alpha:true});
  if(!ctx)return;
  const root=document.documentElement;
  const media=window.matchMedia('(prefers-reduced-motion: reduce)');
  let visible=true,frame=0,last=0,angle=.35,width=1,height=1;
  const points=Array.from({length:432},(_,i)=>{
   const u=(i%36)/36*Math.PI*2,v=Math.floor(i/36)/12*Math.PI*2;
   const radius=1+.14*Math.cos(v);
   return {x:radius*Math.cos(u),y:radius*Math.sin(u),z:.14*Math.sin(v),warm:i%3===0};
  });
  const draw=()=>{
   ctx.clearRect(0,0,width,height);
   const scale=Math.min(width,height)*.4;
   const c=Math.cos(angle),s=Math.sin(angle),tilt=.48;
   const projected=points.map(p=>{
    const x=p.x*c-p.z*s,z=p.x*s+p.z*c;
    const y=p.y*Math.cos(tilt)-z*Math.sin(tilt),depth=p.y*Math.sin(tilt)+z*Math.cos(tilt);
    const perspective=3.8/(3.8-depth);
    return {x:width/2+x*scale*perspective,y:height/2+y*scale*perspective,depth,warm:p.warm};
   }).sort((a,b)=>a.depth-b.depth);
   ctx.globalCompositeOperation='lighter';
   for(const p of projected){
    const alpha=.2+(p.depth+1.2)/2.4*.55;
    ctx.fillStyle=p.warm?`rgba(255,174,117,${alpha})`:`rgba(127,200,255,${alpha})`;
    ctx.beginPath();ctx.arc(p.x,p.y,Math.max(.7,1.1+p.depth*.4),0,Math.PI*2);ctx.fill();
   }
   ctx.globalCompositeOperation='source-over';
  };
  const active=()=>visible&&!document.hidden&&!media.matches&&root.dataset.effects==='on';
  const tick=(now:number)=>{
   frame=0;if(!active())return;
   if(now-last>=33){angle+=Math.min(now-last,66)*.00012;last=now;draw()}
   frame=requestAnimationFrame(tick);
  };
  const sync=()=>{cancelAnimationFrame(frame);frame=0;last=performance.now();draw();if(active())frame=requestAnimationFrame(tick)};
  const resize=()=>{const rect=el.getBoundingClientRect();width=rect.width;height=rect.height;const dpr=Math.min(window.devicePixelRatio||1,1.5);el.width=Math.round(width*dpr);el.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);sync()};
  const size=new ResizeObserver(resize);size.observe(el);
  const viewport=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??false;sync()},{rootMargin:'40px'});viewport.observe(el);
  const settings=new MutationObserver(sync);settings.observe(root,{attributes:true,attributeFilter:['data-effects']});
  document.addEventListener('visibilitychange',sync);media.addEventListener('change',sync);resize();
  return()=>{cancelAnimationFrame(frame);size.disconnect();viewport.disconnect();settings.disconnect();document.removeEventListener('visibilitychange',sync);media.removeEventListener('change',sync)};
 },[]);
 return <canvas ref={canvas} className="depth-field" aria-hidden="true"/>;
}
