import Link from 'next/link';
import Image from 'next/image';

export function Footer({ content }) {
  const footer = content?.footer ?? {};
  const nav = content?.nav ?? {};
  return (
    <footer className="footer">
      <div className="footer-background">
        <Image src="/assets/images/backgrounds/footer-bg.svg" alt="" width={1920} height={640} />
      </div>
      <div className="container">
        <div className="footer-wrapper">
          <div className="logo-info">
            <Link href="/" className="logo">
              <Image src="/assets/images/logo.png" alt="" width={160} height={48} />
            </Link>
            <p className="footer-description">{footer.description}</p>
            <div className="socials">
              <a href={footer.facebookUrl} target="_blank" rel="noreferrer">
                <Image src="/assets/images/icons/facebook.svg" alt="" width={24} height={24} />
              </a>
            </div>
          </div>
          <div className="footer-wrapper-cols">
            <div className="col">
              <p className="title title-5">{footer.columnCompany}</p>
              <ul>
                <li>
                  <Link href="/gallery">{nav.gallery}</Link>
                </li>
                <li>
                  <Link href="/contact-us">{nav.contacts}</Link>
                </li>
              </ul>
            </div>
            <div className="col">
              <p className="title title-5">{footer.columnNav}</p>
              <ul>
                <li>
                  <Link href="/#courses">{footer.navCourses}</Link>
                </li>
                <li>
                  <Link href="/#instructor">{footer.navInstructor}</Link>
                </li>
              </ul>
            </div>
            <div className="col">
              <p className="title title-5">{footer.columnContact}</p>
              <ul>
                <li>
                  <a href={footer.phoneHref}>{footer.phone}</a>
                </li>
                <li>
                  <a href={footer.emailHref}>{footer.email}</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="copyright">{footer.copyright}</div>
      </div>
    </footer>
  );
}
