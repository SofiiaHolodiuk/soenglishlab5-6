import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SubscriptionSection } from '@/components/SubscriptionSection';
import { FaqAccordion } from '@/components/FaqAccordion';
import { ContactEffects } from '@/components/ContactEffects';
import { getFaq, getSiteContent } from '@/api/server-api';
import Image from 'next/image';

export async function generateMetadata() {
  const content = await getSiteContent();
  const title = content?.meta?.contactTitle ?? content?.meta?.defaultTitle ?? 'SoEnglish';
  return { title };
}

export default async function ContactPage() {
  const [content, faqItems] = await Promise.all([getSiteContent(), getFaq().catch(() => [])]);
  const contactPage = content?.contactPage ?? {};

  return (
    <>
      <ContactEffects />
      <Header content={content} />

      <section className="hero-gallery">
        <div className="hero-gallery-background">
          <Image src="/assets/images/backgrounds/gallery-bg.svg" alt="" width={1920} height={1080} />
        </div>
        <div className="container">
          <div className="hero-right">
            <h1 className="title title-1" data-animate="swim-top">
              {contactPage.heroTitle ?? ''}
            </h1>
          </div>
        </div>
      </section>

      <section className="map" data-animate="swim-top">
        <iframe
          src={contactPage.mapEmbedUrl ?? ''}
          width="100%"
          height={450}
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>

      <section className="faq">
        <div className="container">
          <div className="faq-wrapper">
            <div className="faq-left">
              <h2 className="title title-2" data-animate="swim-top">
                {contactPage.faqTitle ?? ''}
              </h2>
              <p className="description body-2" data-animate="swim-top">
                {contactPage.faqDescription ?? ''}
              </p>
            </div>
            <div className="faq-right">
              {faqItems.length === 0 ? (
                <p className="description body-1" data-animate="swim-top">
                  {contactPage.faqEmpty ?? ''}
                </p>
              ) : (
                <FaqAccordion items={faqItems} />
              )}
            </div>
          </div>
        </div>
      </section>

      <SubscriptionSection subscription={content?.subscription} />
      <Footer content={content} />
    </>
  );
}
