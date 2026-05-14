import './globals.css';
import '@/styles/styles.scss';
import '@fontsource/lato/400.css';
import '@fontsource/lato/700.css';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import 'unitegallery/dist/css/unite-gallery.css';
import { getSiteContent } from '@/api/server-api';
import { PHProvider } from './posthog-provider';
import SuspendedPostHogPageView from './posthog-pageview';

export async function generateMetadata() {
  const content = await getSiteContent();
  return {
    title: content?.meta?.defaultTitle ?? 'SoEnglish',
    description: content?.meta?.defaultDescription ?? '',
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="uk">
      <head>
        <link rel="icon" type="image/svg+xml" href="/assets/images/favicon/favicon.svg" />
      </head>
      <body>
          <PHProvider>
            <SuspendedPostHogPageView />
            {children}
          </PHProvider>
        </body>
    </html>
  );
}
