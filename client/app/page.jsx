import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HomeEffects } from '@/components/HomeEffects';
import { SubscriptionSection } from '@/components/SubscriptionSection';
import { getCourses, getGallery, getTestimonials, getSiteContent } from '@/api/server-api';
import { publicAsset } from '@/utils/paths';
import Image from 'next/image';

/** Локальних png у public немає — стабільні прев’ю з Unsplash */
const IMG = {
  hero: '/assets/images/images/hero/hero.png',
  benefits: '/assets/images/images/benefits/image.png',
  instructor: '/assets/images/images/instructor/instructor.png',
  deco: i =>
    `https://images.unsplash.com/photo-${['1507003211169-0a1dd7228f2d', '1472099645785-5658abf4ff4e', '1438761681033-6461ffad8d80', '1519345182560-3f2917c472ef', '1534528741775-53994a69daeb', '1527980965255-d3b416303d12'][i]}?auto=format&fit=crop&w=400&q=70`,
};

export default async function HomePage() {
  const [content, courses, galleryImages, testimonials] = await Promise.all([
    getSiteContent(),
    getCourses().catch(() => []),
    getGallery().catch(() => []),
    getTestimonials().catch(() => []),
  ]);
  const galleryPreview = galleryImages.slice(0, 5);

  const home = content?.home ?? {};
  const videoModal = content?.videoModal ?? {};
  const mainTestimonial = testimonials[0];

  return (
    <>
      <HomeEffects />
      <Header content={content} />

      <section className="hero" data-animate-group="list">
        <div className="container">
          <div className="hero-wrapper">
            <div className="hero-left">
              <Image src={IMG.hero} alt="" width={720} height={720} />
            </div>
            <div className="hero-right">
              <h1 className="title title-1" data-animate="swim-top">
                {home.heroTitle}
              </h1>
              <p className="description body-1" data-animate="swim-top">
                {home.heroQuote}
              </p>
              <div className="hero-video-button open-modal-btn" data-animate="swim-top">
                <Image src="/assets/images/icons/play.svg" alt="" width={24} height={24} />
                <span>{home.videoButtonLabel}</span>
              </div>
            </div>

            <div className="stats">
              {(Array.isArray(home.stats) ? home.stats : []).map((s, index) => (
                <div key={index} data-animate="swim-top">
                  <Image src={`/assets/images/icons/${s.icon}.svg`} alt="" width={24} height={24} />
                  <h3 className="title-5">{s.value}</h3>
                  <p>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="courses" className="popular-courses">
        <div className="container-content">
          <h2 className="title title-3" data-animate="swim-top">
            {home.coursesTitle}
          </h2>
          <p className="description" data-animate="swim-top">
            {home.coursesDescription}
          </p>
          <div className="courses-grid" data-animate-group="list">
            {courses.length === 0 ? (
              <p className="description" data-animate="swim-top">
                {home.coursesEmpty}
              </p>
            ) : (
              courses.map((course, index) => (
                <div
                  key={String(course._id ?? course.id ?? index)}
                  className="course-card"
                  data-animate="swim-top"
                >
                  <div className="image">
                    <Image src={publicAsset(course.imagePath)} alt="" width={640} height={360} unoptimized />
                    <div className="tag body-5">{course.tag || home.courseDefaultTag}</div>
                  </div>
                  <h3 className="title title-5">{course.title}</h3>
                  <p>{course.description}</p>
                  <div className="info">
                    <div>
                      {course.lessonCount ?? 12}x {home.courseLessonsSuffix}
                    </div>
                    <div className="rating">
                      {course.rating ?? 4.9}{' '}
                      <Image src="/assets/images/icons/star.svg" alt="" width={16} height={16} />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="benefits">
        <div className="container">
          <div className="benefits-wrapper">
            <div className="benefits-left" data-animate="swim-top">
              <Image src={IMG.benefits} alt="" width={640} height={480} />
            </div>
            <div className="benefits-right">
              <h2 className="section-title title-2" data-animate="swim-top">
                {home.benefitsTitle}
              </h2>
              <div className="benefits-items">
                {(Array.isArray(home.benefits) ? home.benefits : []).map((b, index) => (
                  <div key={index} className="benefits-card" data-animate="swim-top">
                    <h3 className="title title-5">{b.title}</h3>
                    <p>{b.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="instructor" className="instructor">
        <div className="container">
          <div className="instructor-wrapper">
            <div className="instructor-left">
              <h2 className="title title-2" data-animate="swim-top">
                {home.instructorTitle}
              </h2>
              <p className="description" data-animate="swim-top">
                {home.instructorDescription}
              </p>
              <a href="#join" className="btn" data-animate="swim-top">
                {home.instructorCta}
              </a>
            </div>
            <div className="instructor-right" data-animate="fade">
              <Image src={IMG.instructor} alt="" width={640} height={480} />
            </div>
          </div>
        </div>
      </section>

      <section className="gallery">
        <div className="container">
          <h2 className="title title-2" data-animate="swim-top">
            {home.gallerySectionTitle}
          </h2>
          <div className="owl-carousel">
            {galleryPreview.length === 0
              ? null
              : galleryPreview.map((img, index) => (
                  <div key={String(img._id ?? img.id ?? index)} className="item">
                    <Image
                      src={publicAsset(img.imagePath)}
                      alt={img.altText || ''}
                      width={640}
                      height={480}
                      unoptimized
                    />
                  </div>
                ))}
          </div>
          <a href="/gallery" className="btn -white">
            {home.galleryViewAll}
          </a>
        </div>
      </section>

      <section className="testimonials">
        <div className="container">
          <h2 className="title title-2" data-animate="swim-top">
            {home.testimonialsTitle}
          </h2>
          <p className="subtitle" data-animate="swim-top">
            {home.testimonialsSubtitle}
          </p>
          <div className="testimonials-coments">
            {mainTestimonial ? (
              <div className="testimonials-item" data-animate="swim-top">
                <Image src={publicAsset(mainTestimonial.imagePath)} alt="" width={320} height={320} unoptimized />
                <p>&quot;{mainTestimonial.text}&quot;</p>
                <p className="body-1 author">- {mainTestimonial.author}</p>
              </div>
            ) : (
              <p className="description" data-animate="swim-top">
                {home.testimonialsEmpty}
              </p>
            )}
            <div className="testimonials-bg">
              {[0, 1, 2, 3, 4, 5].map(i => (
                <Image key={i} src={IMG.deco(i)} alt="" width={200} height={200} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <SubscriptionSection subscription={content?.subscription} />

      <Footer content={content} />

      <section className="video-modal">
        <div className="modal-close">
          <Image src="/assets/images/icons/cross.svg" alt={videoModal.closeAlt ?? ''} width={24} height={24} />
        </div>
        <iframe
          width="100%"
          height="100%"
          src={videoModal.iframeSrc ?? ''}
          title={videoModal.iframeTitle ?? ''}
          frameBorder={0}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </section>
    </>
  );
}
