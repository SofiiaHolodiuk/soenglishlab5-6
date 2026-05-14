import { getBackendUrl } from '@/utils/backend';
import siteContentFallback from '../../server/data/site-content.json';

function cloneFallback() {
  return JSON.parse(JSON.stringify(siteContentFallback));
}

/**
 * Гарантує повну структуру контенту: неповна відповідь API або об’єкт помилки
 * не ламають сторінку — підставляються поля з site-content.json.
 */
function mergeSiteContent(api) {
  const fb = cloneFallback();

  if (!api || typeof api !== 'object' || Array.isArray(api)) {
    return fb;
  }

  const meta = api.meta && typeof api.meta === 'object' ? api.meta : {};
  const nav = api.nav && typeof api.nav === 'object' ? api.nav : {};
  const footer = api.footer && typeof api.footer === 'object' ? api.footer : {};

  return {
    ...fb,
    meta: { ...fb.meta, ...meta },
    nav: { ...fb.nav, ...nav },
    footer: { ...fb.footer, ...footer },
    home: (() => {
      const h = api.home && typeof api.home === 'object' ? api.home : {};
      return {
        ...fb.home,
        ...h,
        stats: Array.isArray(h.stats) && h.stats.length > 0 ? h.stats : fb.home.stats,
        benefits:
          Array.isArray(h.benefits) && h.benefits.length > 0 ? h.benefits : fb.home.benefits,
      };
    })(),
    galleryPage: {
      ...fb.galleryPage,
      ...(api.galleryPage && typeof api.galleryPage === 'object' ? api.galleryPage : {}),
    },
    contactPage: {
      ...fb.contactPage,
      ...(api.contactPage && typeof api.contactPage === 'object' ? api.contactPage : {}),
    },
    subscription: {
      ...fb.subscription,
      ...(api.subscription && typeof api.subscription === 'object' ? api.subscription : {}),
    },
    videoModal: {
      ...fb.videoModal,
      ...(api.videoModal && typeof api.videoModal === 'object' ? api.videoModal : {}),
    },
    apiMessages: {
      ...fb.apiMessages,
      ...(api.apiMessages && typeof api.apiMessages === 'object' ? api.apiMessages : {}),
    },
  };
}

async function fetchJson(path) {
  const base = getBackendUrl();
  const res = await fetch(`${base}/api/${path}`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`Backend ${path}: ${res.status}`);
  }
  return res.json();
}

export function getCourses() {
  return fetchJson('courses');
}

export function getGallery() {
  return fetchJson('gallery');
}

export function getTestimonials() {
  return fetchJson('testimonials');
}

export function getFaq() {
  return fetchJson('faq');
}

export async function getSiteContent() {
  const base = getBackendUrl();
  try {
    const res = await fetch(`${base}/api/content`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`content ${res.status}`);
    const data = await res.json();
    return mergeSiteContent(data);
  } catch {
    return mergeSiteContent(null);
  }
}
