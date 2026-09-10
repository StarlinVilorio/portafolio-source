"use client";
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState } from 'react';
const Scene=dynamic(()=>import('./journey-scene').then(m=>m.JourneyScene),{ssr:false});
export function SceneLoader(){
 const [mount,setMount]=useState(false),[ready,setReady]=useState(false);
 const onReady=useCallback(()=>setReady(true),[]);
 useEffect(()=>{
  if('requestIdleCallback' in window){const id=window.requestIdleCallback(()=>setMount(true),{timeout:1200});return()=>window.cancelIdleCallback(id)}
  const id=setTimeout(()=>setMount(true),150);return()=>clearTimeout(id);
 },[]);
 return <>{!ready&&<img className="journey-canvas scene-poster" src="/assets/portfolio/portal-poster.svg" alt="" fetchPriority="high"/>}{mount&&<Scene onReady={onReady}/>}</>;
}
