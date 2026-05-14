export function initHeaderScroll() {
  const header = document.querySelector('header');
  if (!header) return () => {};

  const onScroll = () => {
    if (window.scrollY > 50) header.classList.add('-scrolled');
    else header.classList.remove('-scrolled');
  };

  onScroll();
  window.addEventListener('scroll', onScroll);
  return () => window.removeEventListener('scroll', onScroll);
}

export function initSmoothAnchors(offset = 200) {
  const handler = e => {
    const target = e.target.closest?.('a[href^="#"]');
    if (!target) return;

    const href = target.getAttribute('href');
    if (!href || href === '#') return;

    const el = document.querySelector(href);
    if (!el) return;

    e.preventDefault();
    const offsetTop = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
  };

  document.addEventListener('click', handler);
  return () => document.removeEventListener('click', handler);
}

function lockScroll(on) {
  document.documentElement.classList.toggle('-scroll-lock', on);
  document.body.classList.toggle('-scroll-lock', on);
}

export function initVideoModal() {
  const modal = document.querySelector('.video-modal');
  const openBtn = document.querySelector('.open-modal-btn');
  if (!modal || !openBtn) return () => {};

  const closeBtn = modal.querySelector('.modal-close');
  if (!closeBtn) return () => {};

  const open = e => {
    e.stopPropagation();
    modal.classList.add('-active');
    lockScroll(true);
  };

  const close = e => {
    e.stopPropagation();
    modal.classList.remove('-active');
    lockScroll(false);
  };

  openBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);

  const onDocClick = e => {
    if (!modal.contains(e.target) && modal.classList.contains('-active')) {
      modal.classList.remove('-active');
      lockScroll(false);
    }
  };
  const onModalClick = e => e.stopPropagation();

  document.addEventListener('click', onDocClick);
  modal.addEventListener('click', onModalClick);

  return () => {
    openBtn.removeEventListener('click', open);
    closeBtn.removeEventListener('click', close);
    document.removeEventListener('click', onDocClick);
    modal.removeEventListener('click', onModalClick);
    lockScroll(false);
  };
}
