

const createNextIntlPlugin = require("next-intl/plugin");
const { withSentryConfig } = require("@sentry/nextjs");
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Webpack mode REQUIRED for next-pwa (does NOT remove features)
  webpack: (config) => {
    return config;
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-XSS-Protection", value: "1; mode=block" },

          // IMPORTANT:
          // We are NOT adding Content-Security-Policy here because it breaks
          // NextAuth, Live Activity, and dynamic internal scripts.
        ],
      },
    ];
  },
};

// ✅ 1. Wrap with next-intl
const intlConfig = withNextIntl(nextConfig);

// ✅ 2. Wrap with Sentry (keeps your monitoring)
const sentryConfig = withSentryConfig(intlConfig, {
  org: "buyexchange-an",
  project: "javascript-nextjs",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  disableLogger: true,
  automaticVercelMonitors: true,
});

// ✅ 3. Wrap with PWA LAST (THIS ENABLES sw.js)
module.exports = withPWA(sentryConfig);
