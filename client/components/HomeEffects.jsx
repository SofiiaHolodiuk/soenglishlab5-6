'use client';

import { useEffect } from 'react';
import { runScrollAnimations } from '@/components/gsap-scroll';
import { initHeaderScroll, initSmoothAnchors, initVideoModal } from '@/utils/page-effects';
import { initGsap, initJquery } from '@/utils/client-libs';

export function HomeEffects() {
  useEffect(() => {
    const cleanups = [];
    let cancelled = false;

    (async () => {
      try {
        const $ = await initJquery();
        if (cancelled) return;
        await import('owl.carousel');
        if (cancelled) return;

        if ($ && $('.owl-carousel').length) {
          $('.owl-carousel').owlCarousel({
            loop: true,
            margin: 40,
            nav: true,
            dots: true,
            responsive: {
              0: { items: 1 },
              600: { items: 2 },
              1000: { items: 3 },
            },
            onInitialized: () => {
              const jq = window.jQuery;
              jq('.owl-prev').empty().append('<img src="/assets/images/icons/arrow.svg" alt="Previous" />');
              jq('.owl-next').empty().append('<img src="/assets/images/icons/arrow.svg" alt="Next" />');
            },
          });
        }

        const { gsap, ScrollTrigger } = await initGsap();
        if (cancelled) return;
        runScrollAnimations(gsap, ScrollTrigger);

        cleanups.push(initHeaderScroll());
        cleanups.push(initSmoothAnchors());
        cleanups.push(initVideoModal());
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
