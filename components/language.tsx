"use client";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import english from '@/lib/english.json';
export type Language = 'es' | 'en';
const translations: Record<string,string> = english;
const LanguageContext=createContext({language:'es' as Language,setLanguage:(_language:Language)=>{},t:(text:string)=>text});
export function LanguageProvider({children}:{children:ReactNode}){
 const [language,setCurrent]=useState<Language>('es');
 useEffect(()=>{
  const query=new URL(window.location.href).searchParams.get('lang');
  let saved:string|null=null;
  try{saved=localStorage.getItem('starlinit-language')}catch{}
  const selected=query==='en'||query==='es'?query:saved;
  if(selected==='en'||selected==='es')setCurrent(selected);
 },[]);
 useEffect(()=>{
  document.documentElement.lang=language;
  document.title=language==='en'?'Starlin Vilorio | Infrastructure, development & artificial intelligence':'Starlin Vilorio | Infraestructura, desarrollo e inteligencia artificial';
  const description=document.querySelector('meta[name="description"]');
  description?.setAttribute('content',language==='en'?'Starlin Vilorio: 13+ years in technology, local AI, software and creative work. Community Management consulting for US$75.':'Starlin Vilorio: más de 13 años en tecnología, IA local, software y creación audiovisual. Asesoría de Community Management por US$75.');
 },[language]);
 const setLanguage=useCallback((next:Language)=>{
  setCurrent(next);
  try{localStorage.setItem('starlinit-language',next)}catch{}
  const url=new URL(window.location.href);url.searchParams.set('lang',next);
  window.history.replaceState(window.history.state,'',url);
 },[]);
 const t=useCallback((text:string)=>{
  if(language==='es')return text;
  const key=text.trim();const translated=translations[key];
  return translated===undefined?text:text.replace(key,()=>translated);
 },[language]);
 return <LanguageContext.Provider value={{language,setLanguage,t}}>{children}</LanguageContext.Provider>;
}
export const useLanguage=()=>useContext(LanguageContext);
export function LanguageSwitch(){const {language,setLanguage}=useLanguage();return <div className="language-switch" role="group" aria-label="Language / Idioma"><button type="button" lang="en" aria-pressed={language==='en'} onClick={()=>setLanguage('en')}>English</button><span aria-hidden="true">/</span><button type="button" lang="es" aria-pressed={language==='es'} onClick={()=>setLanguage('es')}>Español</button></div>}
