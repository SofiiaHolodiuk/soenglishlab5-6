export async function initGsap() {
  const [{ gsap }, { ScrollTrigger }] = await Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger'),
  ]);
  gsap.registerPlugin(ScrollTrigger);
  return { gsap, ScrollTrigger };
}

export async function initJquery() {
  const jqueryModule = await import('jquery');
  const $ = jqueryModule.default;
  window.$ = window.jQuery = $;
  return $;
}
