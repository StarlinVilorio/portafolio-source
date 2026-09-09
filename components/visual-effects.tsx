"use client";

import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';

/** Progressive enhancement: content stays visible without JavaScript or motion. */
export function VisualEffects() {
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(true);
  const progress = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(preference.matches);
    update();
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const active = !paused && !reduced;
    root.dataset.effects = active ? 'on' : 'off';
    if (!active) return;

    let scrollFrame = 0;
    let pointerFrame = 0;
    let current: HTMLElement | null = null;
    let px = 0, py = 0;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const animations = new Set<Animation>();
    const seen = new WeakSet<Element>();
    const scroll = () => {
      if (scrollFrame) return;
      scrollFrame = requestAnimationFrame(() => {
        const max = root.scrollHeight - window.innerHeight;
        if (progress.current) progress.current.style.transform = `scaleX(${max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0})`;
        scrollFrame = 0;
      });
    };
    const reset = () => {
      if (!current) return;
      current.style.removeProperty('--rx');
      current.style.removeProperty('--ry');
      current.style.removeProperty('--light-x');
      current.style.removeProperty('--light-y');
      current.removeAttribute('data-tilting');
      current = null;
    };
    const pointer = (event: PointerEvent) => {
      if (!finePointer.matches || event.pointerType === 'touch') return;
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>('.project, .hero-stage, .community-offer') : null;
      if (target !== current) { reset(); current = target; }
      if (!current) return;
      px = event.clientX; py = event.clientY;
      if (pointerFrame) return;
      pointerFrame = requestAnimationFrame(() => {
        pointerFrame = 0;
        if (!current) return;
        const rect = current.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (px - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (py - rect.top) / rect.height));
        current.style.setProperty('--rx', `${(0.5 - y) * 6}deg`);
        current.style.setProperty('--ry', `${(x - 0.5) * 8}deg`);
        current.style.setProperty('--light-x', `${x * 100}%`);
        current.style.setProperty('--light-y', `${y * 100}%`);
        current.dataset.tilting = 'true';
      });
    };
    const visibility = () => {
      root.dataset.pageHidden = document.hidden ? 'true' : 'false';
      if (document.hidden) reset();
    };
    const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer?.unobserve(entry.target);
        const animation = entry.target.animate([
          { opacity: 0.25, transform: 'perspective(1100px) translate3d(0, 36px, 0) rotateX(5deg)' },
          { opacity: 1, transform: 'perspective(1100px) translate3d(0, 0, 0) rotateX(0deg)' }
        ], { duration: 760, easing: 'cubic-bezier(.16,1,.3,1)' });
        animations.add(animation);
        animation.onfinish = () => animations.delete(animation);
      }
    }, { threshold: 0.08 }) : null;
    const observe = () => document.querySelectorAll('.section-head, .project, .service, .about-grid, .contact-grid, .community-offer').forEach(el => {
      if (!seen.has(el)) { seen.add(el); observer?.observe(el); }
    });
    observe();
    const grid = document.querySelector('.work-grid');
    const mutation = new MutationObserver(observe);
    if (grid) mutation.observe(grid, { childList: true });
    window.addEventListener('scroll', scroll, { passive: true });
    window.addEventListener('resize', scroll, { passive: true });
    document.addEventListener('pointermove', pointer, { passive: true });
    document.addEventListener('pointerleave', reset);
    document.addEventListener('visibilitychange', visibility);
    finePointer.addEventListener('change', reset);
    scroll(); visibility();
    return () => {
      observer?.disconnect(); mutation.disconnect();
      animations.forEach(a => a.cancel());
      window.removeEventListener('scroll', scroll);
      window.removeEventListener('resize', scroll);
      document.removeEventListener('pointermove', pointer);
      document.removeEventListener('pointerleave', reset);
      document.removeEventListener('visibilitychange', visibility);
      finePointer.removeEventListener('change', reset);
      cancelAnimationFrame(scrollFrame); cancelAnimationFrame(pointerFrame);
      reset(); delete root.dataset.effects; delete root.dataset.pageHidden;
    };
  }, [paused, reduced]);

  const disabled = paused || reduced;
  return <>
    <div className="reading-progress" aria-hidden="true"><div ref={progress} /></div>
    <button type="button" className="motion-control" onClick={() => setPaused(!paused)} disabled={reduced} aria-pressed={!disabled} aria-label={reduced ? 'Movimiento reducido según tu sistema' : paused ? 'Activar efectos visuales' : 'Pausar efectos visuales'}>
      {disabled ? <Play size={14} /> : <Pause size={14} />}
      <span>{reduced ? 'Movimiento reducido' : paused ? 'Activar efectos' : 'Pausar efectos'}</span>
    </button>
  </>;
}
