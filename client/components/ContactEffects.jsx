'use client';

import { useEffect } from 'react';
import { runScrollAnimations } from '@/components/gsap-scroll';
import { initHeaderScroll, initSmoothAnchors } from '@/utils/page-effects';
import { initGsap } from '@/utils/client-libs';

export function ContactEffects() {
  useEffect(() => {
    const cleanups = [];
    let cancelled = false;

    (async () => {
      try {
        const { gsap, ScrollTrigger } = await initGsap();
        if (cancelled) return;
        runScrollAnimations(gsap, ScrollTrigger);
        cleanups.push(initHeaderScroll());
        cleanups.push(initSmoothAnchors());
      } catch (err) {
        console.error(err);
      }
    })();

    return () => {
      cancelled = true;
      cleanups.forEach(fn => fn?.());
    };
  }, []);

  return null;
}
