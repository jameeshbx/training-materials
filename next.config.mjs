import withNextIntl from 'next-intl/plugin';
import { withSentryConfig } from '@sentry/nextjs';

const nextConfig = {
  experimental: {
    srcDir: true
  }
};

export default withSentryConfig(
  withNextIntl({
    locales: ['en', 'ml'],
    defaultLocale: 'en'
  })(nextConfig),
  {
    org: "eldhose-er",
    project: "javascript-nextjs",
    silent: !process.env.CI,
    widenClientFileUpload: true,
    tunnelRoute: "/monitoring",
    disableLogger: true,
    automaticVercelMonitors: true
  }
);
