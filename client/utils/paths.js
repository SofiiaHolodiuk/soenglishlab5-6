/** Нормалізує шлях з БД до URL: локальні з у `public/` або повні https. */
export function publicAsset(path) {
  if (!path) return '/assets/images/favicon/favicon.svg';
  if (/^https?:\/\//i.test(path)) return path;
  return path.startsWith('/') ? path : `/${path}`;
}
