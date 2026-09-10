"use client";

import { useLanguage } from '@/components/language';

import { SceneLoader } from '@/components/scene-loader';

import type { ReactNode } from 'react';

import { ArrowDown, ArrowUpRight, Download } from 'lucide-react';

import Image from 'next/image';



export function ScrollJourney({children}:{children?:ReactNode}){

 const {language}=useLanguage();

 const en=language==='en';

 return <div className="scroll-journey" id="journey">

  <div className="journey-stage" aria-hidden="true"><SceneLoader/><div className="journey-vignette"/><div className="journey-coordinate">STARLIN / {en?'A WORK IN MOTION':'IDEAS EN MOVIMIENTO'}</div><div className="journey-progress"><span/></div></div>

  <div className="journey-chapters">

   <section className="journey-chapter chapter-intro" id="home" data-chapter="0">

    <div className="chapter-inner">

     <p className="journey-overline">{en?'TECHNOLOGY · INTELLIGENCE · CREATION':'TECNOLOGÍA · INTELIGENCIA · CREACIÓN'}</p>

     <h1 className="journey-name"><span>STARLIN</span><span>VILORIO<span className="name-dot">.</span></span></h1>

     <p className="journey-tagline">{en?'An idea. A spark. Something real.':'Una idea. Una chispa. Algo real.'}</p>

     <a className="journey-scroll" href="#discover-me"><span>{en?'SCROLL TO DISCOVER':'DESLIZA PARA DESCUBRIR'}</span><ArrowDown size={18}/></a>

    </div>

   </section>

   <section className="journey-chapter chapter-left" id="discover-me" data-chapter="1">

    <div className="chapter-inner shell">

     <div className="chapter-copy"><p className="journey-overline">01 / {en?'THE PERSON BEHIND THE WORK':'LA PERSONA DETRÁS DEL TRABAJO'}</p>

      <h2>{en?'Curiosity.':'Curiosidad.'}<br/><em>{en?'Built into everything.':'En todo lo que hago.'}</em></h2>

      <p>{en?'I’m Starlin, a technology professional and digital creator based in the Dominican Republic. For more than 13 years, I’ve turned technical challenges into practical solutions.':'Soy Starlin, profesional de tecnología y creador digital desde República Dominicana. Llevo más de 13 años convirtiendo desafíos técnicos en soluciones prácticas.'}</p>

      <div className="journey-role"><span>{en?'CURRENTLY':'ACTUALMENTE'}</span><strong>Hardware Support</strong><span>Red Sail Technologies</span></div>

      <a href="/Starlin-Vilorio-CV.pdf" download className="journey-link">{en?'Download my CV':'Descargar mi CV'}<Download size={16}/></a>

     </div>

     <figure className="journey-portrait"><Image src="/assets/portfolio/starlin-professional-portrait-v1.webp" alt="Starlin Vilorio" fill sizes="(max-width:720px) 65vw, 30vw"/><figcaption>{en?'Based in the Dominican Republic. Connected to the world.':'Desde República Dominicana. Conectado con el mundo.'}</figcaption></figure>

    </div>

   </section>

   <section className="journey-chapter chapter-right" id="discover-ai" data-chapter="2">

    <div className="chapter-inner shell">

     <div className="chapter-copy"><p className="journey-overline">02 / {en?'INTELLIGENCE INTO ACTION':'INTELIGENCIA EN ACCIÓN'}</p>

      <h2>{en?'I build tools':'Creo herramientas'}<br/><em>{en?'that do the work.':'que hacen el trabajo.'}</em></h2>

      <p>{en?'My projects connect local AI, software and infrastructure. From restoring video to translating speech, each starts with something I want to make possible.':'Mis proyectos conectan IA local, software e infraestructura. Desde restaurar video hasta traducir voz, cada uno empieza con algo que quiero hacer posible.'}</p>

      <a href="#coral-graphic" className="journey-project"><span className="journey-overline">{en?'FEATURED PROJECT':'PROYECTO DESTACADO'}</span><strong>Coral Better<br/>Graphic 2</strong><span>{en?'AI video restoration · GPU processing':'Restauración de video con IA · Procesamiento GPU'}</span><ArrowUpRight size={26}/></a>

      <div className="journey-mini"><span>Coral Ultra IA</span><span>Interpreter App</span><span>MovieRD</span></div>

     </div>

    </div>

   </section>

   <section className="journey-chapter chapter-left" id="discover-creative" data-chapter="3">

    <div className="chapter-inner shell">

     <div className="chapter-copy"><p className="journey-overline">03 / {en?'A DIFFERENT SIDE OF ME':'OTRA PARTE DE MÍ'}</p>

      <h2>{en?'Technology can':'La tecnología también'}<br/><em>{en?'tell a story.':'cuenta historias.'}</em></h2>

      <p>{en?'I explore art direction, AI-assisted filmmaking and digital storytelling. Characters, environments and ideas become a visual language of their own.':'Exploro dirección artística, producción audiovisual con IA y narrativa digital. Personajes, escenarios e ideas encuentran su propio lenguaje visual.'}</p>

      <a href="#despertar" className="journey-link">{en?'Discover Despertar':'Descubrir Despertar'}<ArrowUpRight size={18}/></a>

     </div>

     <a className="journey-art" href="#despertar" aria-label={en?'Discover the Despertar project':'Descubrir el proyecto Despertar'}><Image src="/projects/despertar.webp" alt={en?'Fantasy forest created for Despertar':'Bosque fantástico creado para Despertar'} fill sizes="(max-width:720px) 90vw, 45vw"/><div><span>{en?'A VISUAL UNIVERSE IN DEVELOPMENT':'UN UNIVERSO VISUAL EN DESARROLLO'}</span><strong>DESPERTAR</strong></div><ArrowUpRight size={24}/></a>

    </div>

   </section>

   <section className="journey-chapter chapter-right chapter-finale" id="discover-consulting" data-chapter="4">

    <div className="chapter-inner shell"><div className="chapter-copy"><p className="journey-overline">04 / {en?'YOUR NEXT CHAPTER':'TU PRÓXIMO CAPÍTULO'}</p>

     <h2>{en?'Your idea.':'Tu idea.'}<br/><em>{en?'Let’s bring it to life.':'Vamos a darle vida.'}</em></h2>

     <p>{en?'I’m completing my Community Management training, bringing technology and creative production together to help brands develop their digital presence.':'Estoy completando mi formación en Community Management, conectando tecnología y creación audiovisual para ayudar a las marcas con su presencia digital.'}</p>

     <a className="journey-consult" href="#community-management"><span>Community Management<br/><small>{en?'Consulting':'Asesoría'}</small></span><strong>US$75</strong><ArrowUpRight size={24}/></a>

     <div className="journey-final-links"><a href="#portfolio" className="journey-link">{en?'Explore all 19 projects & experiences':'Explorar los 19 proyectos y experiencias'}<ArrowDown size={18}/></a><a href="#contact" className="journey-link">{en?'Let’s talk':'Hablemos'}<ArrowUpRight size={18}/></a></div>

    </div></div>

   </section>

   {children}

  </div>

 </div>;

}

