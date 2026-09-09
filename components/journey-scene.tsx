"use client";
import { useEffect, useRef } from 'react';

const clamp=(n:number,min=0,max=1)=>Math.min(max,Math.max(min,n));
const mix=(a:number,b:number,t:number)=>a+(b-a)*t;
const smooth=(t:number)=>t*t*(3-2*t);

/** Original geometric scene. Scroll controls its position, scale and rotation. */
export function JourneyScene(){
 const ref=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const canvas=ref.current,host=document.getElementById('journey');
  if(!canvas||!host)return;
  const ctx=canvas.getContext('2d',{alpha:true});if(!ctx)return;
  const root=document.documentElement;
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  const fine=matchMedia('(hover:hover) and (pointer:fine)');
  const chapters=Array.from(host.querySelectorAll<HTMLElement>('.journey-chapter'));
  const star=Array.from({length:12},(_,i)=>{const a=i*Math.PI/6-Math.PI/2,r=i%2===0?1:.31;return [Math.cos(a)*r,Math.sin(a)*r,0]});
  const particles=Array.from({length:85},(_,i)=>({x:((i*127.1)%997)/997,y:((i*311.7)%991)/991,z:((i*43.3)%97)/97}));
  let width=1,height=1,frame=0,last=0,visible=true,phase=0,pointerX=0,pointerY=0,progress=0,scrollDirty=true;
  const moving=()=>root.dataset.effects==='on'&&!media.matches;
  const measure=()=>{
   const bounds=host.getBoundingClientRect();
   progress=clamp(-bounds.top/Math.max(1,bounds.height-height));
   host.style.setProperty('--journey-progress',String(progress));
   for(const chapter of chapters){const r=chapter.getBoundingClientRect();const travel=clamp(-r.top/Math.max(1,r.height-height));chapter.style.setProperty('--chapter-travel',String(travel));}
   scrollDirty=false;
  };
  const draw=()=>{
   ctx.clearRect(0,0,width,height);
   const mobile=width<760;
   const stops=mobile?[.5,.62,.28,.65,.26]:[.5,.76,.23,.76,.23];
   const step=(moving()?progress:0)*4,index=Math.min(3,Math.floor(step)),local=smooth(step-index);
   const centerX=width*mix(stops[index],stops[index+1],local);
   const centerY=height*(mobile?.39:.49);
   const scales=[.78,1.04,1.16,.92,1.08]; const base=Math.min(width,height)*(mobile?.28:.29)*mix(scales[index],scales[index+1],local);
   const turn=moving()?phase*.1+progress*Math.PI*3:.45;
   const tilt=moving()?.32+pointerY*.13:.32;
   const project=(v:number[])=>{
    const x=v[0]*Math.cos(turn)+v[2]*Math.sin(turn),z=-v[0]*Math.sin(turn)+v[2]*Math.cos(turn);
    const y=v[1]*Math.cos(tilt)-z*Math.sin(tilt),depth=v[1]*Math.sin(tilt)+z*Math.cos(tilt);
    const zoom=3.5/(3.5-depth);
    return {x:centerX+x*base*zoom+(moving()?pointerX*18:0),y:centerY+y*base*zoom,z:depth};
   };
   const glow=ctx.createRadialGradient(centerX,centerY,0,centerX,centerY,base*1.65);
   glow.addColorStop(0,'rgba(255,174,120,.085)');glow.addColorStop(.5,'rgba(115,171,204,.025)');glow.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,width,height);
   for(const p of particles){const y=(p.y*height-(moving()?progress*p.z*height*.3:0)+height)%height;ctx.fillStyle=`rgba(198,211,225,${.1+p.z*.23})`;ctx.beginPath();ctx.arc(p.x*width,y,p.z>.8?1.2:.65,0,Math.PI*2);ctx.fill()}
   const faces=[];
   for(let i=0;i<12;i++)for(const side of [-1,1]){const a=project(star[i]),b=project(star[(i+1)%12]),c=project([0,0,.36*side]);faces.push({a,b,c,depth:(a.z+b.z+c.z)/3,i,side})}
   faces.sort((a,b)=>a.depth-b.depth);
   for(const f of faces){
    const gradient=ctx.createLinearGradient(f.a.x,f.a.y,f.c.x,f.c.y);
    const intensity=clamp(.4+f.depth*.5);
    gradient.addColorStop(0,`rgba(246,207,172,${.35+intensity*.35})`);
    gradient.addColorStop(.55,`rgba(${f.i%2?'118,148,163':'202,183,163'},${.08+intensity*.28})`);
    gradient.addColorStop(1,`rgba(248,232,207,${.55+intensity*.4})`);
    ctx.beginPath();ctx.moveTo(f.a.x,f.a.y);ctx.lineTo(f.b.x,f.b.y);ctx.lineTo(f.c.x,f.c.y);ctx.closePath();ctx.fillStyle=gradient;ctx.fill();ctx.strokeStyle='rgba(247,216,183,.23)';ctx.lineWidth=.7;ctx.stroke();
   }
   const core=project([0,0,.38]);ctx.fillStyle='#ffe3c0';ctx.shadowColor='#ffc88f';ctx.shadowBlur=22;ctx.beginPath();ctx.arc(core.x,core.y,2.2,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
  };
  const tick=(now:number)=>{frame=0;if(!visible||document.hidden)return;if(now-last>=33){phase+=Math.min(66,now-last)*.001;last=now;if(scrollDirty)measure();draw()}if(moving())frame=requestAnimationFrame(tick)};
  const sync=()=>{cancelAnimationFrame(frame);frame=0;if(!visible||document.hidden)return;if(scrollDirty)measure();draw();last=performance.now();if(moving())frame=requestAnimationFrame(tick)};
  const scroll=()=>{scrollDirty=true;if(!frame)frame=requestAnimationFrame(now=>{frame=0;measure();if(visible)draw();last=now;if(moving()&&visible&&!document.hidden)frame=requestAnimationFrame(tick)})};
  const resize=()=>{width=canvas.clientWidth;height=canvas.clientHeight;const dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);scrollDirty=true;sync()};
  const pointer=(e:PointerEvent)=>{if(!fine.matches||!moving())return;pointerX=clamp(e.clientX/width,0,1)-.5;pointerY=clamp(e.clientY/height,0,1)-.5};
  const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(canvas);resizeObserver.observe(host);
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync()});observer.observe(host);
  const preferences=new MutationObserver(()=>{scrollDirty=true;sync()});preferences.observe(root,{attributes:true,attributeFilter:['data-effects','lang']});
  addEventListener('scroll',scroll,{passive:true});addEventListener('pointermove',pointer,{passive:true});document.addEventListener('visibilitychange',sync);media.addEventListener('change',sync);resize();
  return()=>{cancelAnimationFrame(frame);resizeObserver.disconnect();observer.disconnect();preferences.disconnect();removeEventListener('scroll',scroll);removeEventListener('pointermove',pointer);document.removeEventListener('visibilitychange',sync);media.removeEventListener('change',sync)};
 },[]);
 return <canvas ref={ref} className="journey-canvas" aria-hidden="true"/>;
}
