import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SubscriptionSection } from '@/components/SubscriptionSection';
import { GalleryUnite } from '@/components/GalleryUnite';
import { GalleryPageEffects } from '@/components/GalleryPageEffects';
import { getGallery, getSiteContent } from '@/api/server-api';
import { publicAsset } from '@/utils/paths';
import Image from 'next/image';

export async function generateMetadata() {
  const content = await getSiteContent();
  const title = content?.meta?.galleryTitle ?? content?.meta?.defaultTitle ?? 'SoEnglish';
  return { title };
}

export default async function GalleryPage() {
  const [content, images] = await Promise.all([getSiteContent(), getGallery().catch(() => [])]);
  const galleryPage = content?.galleryPage ?? {};

  return (
    <>
      <GalleryPageEffects />
      <Header content={content} />

      <section className="hero-gallery">
        <div className="hero-gallery-background">
          <Image src="/assets/images/backgrounds/gallery-bg.svg" alt="" width={1920} height={1080} />
        </div>
        <div className="container">
          <div className="hero-right">
            <h1 className="title title-1" data-animate="swim-top">
              {galleryPage.heroTitle ?? ''}
            </h1>
          </div>
        </div>
      </section>

      <section className="gallery-section" data-animate-group="list">
        <div className="container">
          {images.length === 0 ? (
            <p className="description body-1" data-animate="swim-top">
              {galleryPage.emptyGallery ?? ''}
            </p>
          ) : (
            <GalleryUnite stableKey={images.map((img, i) => String(img._id ?? img.id ?? i)).join(',')}>
              {images.map((img, i) => (
                <a key={String(img._id ?? img.id ?? i)} href={publicAsset(img.imagePath)}>
                  <Image
                    src={publicAsset(img.imagePath)}
                    alt={img.altText || ''}
                    width={800}
                    height={600}
                    unoptimized
                  />
                </a>
              ))}
            </GalleryUnite>
          )}
        </div>
      </section>

      <SubscriptionSection subscription={content?.subscription} />
      <Footer content={content} />
    </>
  );
}
