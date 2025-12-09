
const createNextIntlPlugin = require("next-intl/plugin");
const { withSentryConfig } = require("@sentry/nextjs");

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Empty turbopack config to silence the warning
  turbopack: {},

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

// ✅ Wrap FIRST with next-intl
const intlConfig = withNextIntl(nextConfig);

// ✅ Then wrap with Sentry
module.exports = withSentryConfig(intlConfig, {
  org: "buyexchange-an",
  project: "javascript-nextjs",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  disableLogger: true,
  automaticVercelMonitors: true,
});
