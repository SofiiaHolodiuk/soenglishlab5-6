'use client';

import { useEffect } from 'react';
import { runScrollAnimations } from '@/components/gsap-scroll';
import { initHeaderScroll } from '@/utils/page-effects';
import { initGsap } from '@/utils/client-libs';

/** Після Unite Gallery ініціалізує GSAP для інших блоків сторінки. */
export function GalleryPageEffects() {
  useEffect(() => {
    const cleanups = [];
    let cancelled = false;

    const t = window.setTimeout(() => {
      (async () => {
        try {
          const { gsap, ScrollTrigger } = await initGsap();
          if (cancelled) return;
          runScrollAnimations(gsap, ScrollTrigger);
          cleanups.push(initHeaderScroll());
        } catch (e) {
          console.error(e);
        }
      })();
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(t);
      cleanups.forEach(fn => fn?.());
    };
  }, []);

  return null;
}
