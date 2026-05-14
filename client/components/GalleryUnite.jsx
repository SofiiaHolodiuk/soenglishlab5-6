'use client';

export function GalleryUnite({ children, stableKey }) {
  return <div key={stableKey} className="gallery-unite-grid">{children}</div>;
}
