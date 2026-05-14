/** Ініціалізація анімацій при скролі (логіка з колишнього animations.js). */
export function runScrollAnimations(gsap, ScrollTrigger) {
  if (!ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  const DELAY_INCREMENT = 0.2;
  const ANIMATION_DURATION = 0.7;
  const START_TRIGGER = 'top 90%';
  const END_TRIGGER = 'bottom 60%';
  const TOGGLE_ACTIONS = 'play none none none';
  const SHOW_MARKERS = false;

  const getAnimationConfig = (animationType, delay) => {
    const fromVars = { opacity: 0 };
    const toVars = {
      opacity: 1,
      delay,
      duration: ANIMATION_DURATION,
      scrollTrigger: {
        trigger: null,
        start: START_TRIGGER,
        end: END_TRIGGER,
        toggleActions: TOGGLE_ACTIONS,
        markers: SHOW_MARKERS,
      },
    };

    const st = toVars.scrollTrigger;

    switch (animationType) {
      case 'swim-top':
        fromVars.y = 100;
        toVars.y = 0;
        st.start = 'top 90%';
        st.end = 'top 70%';
        break;
      case 'swim-down':
        fromVars.y = -100;
        toVars.y = 0;
        st.start = 'top 90%';
        st.end = 'top 70%';
        break;
      case 'swim-left':
        fromVars.x = 100;
        toVars.x = 0;
        break;
      case 'swim-right':
        fromVars.x = -100;
        toVars.x = 0;
        break;
      case 'fade':
        break;
      default:
        fromVars.y = 100;
        toVars.y = 0;
        st.start = 'top 90%';
        st.end = 'top 70%';
    }

    return { fromVars, toVars };
  };

  const handleAnimationGroups = groupSelector => {
    document.querySelectorAll(groupSelector).forEach(group => {
      const elements = group.querySelectorAll('[data-animate]');
      elements.forEach((el, index) => {
        const animationType = el.getAttribute('data-animate') || 'swim-top';
        el.setAttribute('data-animate', animationType);
        const delay = index * DELAY_INCREMENT;
        const { fromVars, toVars } = getAnimationConfig(animationType, delay);
        toVars.scrollTrigger.trigger = group;
        gsap.fromTo(el, fromVars, toVars);
      });
    });
  };

  handleAnimationGroups('[data-animate-group="list"]');
  handleAnimationGroups('[data-animate-group="content"]');

  document.querySelectorAll('[data-animate]').forEach(el => {
    const inList = el.closest('[data-animate-group="list"], [data-animate-group="content"]');
    if (inList) return;
    const animationType = el.getAttribute('data-animate');
    const { fromVars, toVars } = getAnimationConfig(animationType, 0);
    toVars.scrollTrigger.trigger = el;
    gsap.fromTo(el, fromVars, toVars);
  });
}
