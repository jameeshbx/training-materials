// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   // Empty turbopack config to silence the warning
//   turbopack: {},
// }

// module.exports = nextConfig



// // Injected content via Sentry wizard below

// const { withSentryConfig } = require("@sentry/nextjs");

// module.exports = withSentryConfig(
//   module.exports,
//   {
//     // For all available options, see:
//     // https://www.npmjs.com/package/@sentry/webpack-plugin#options

//     org: "buyexchange-xl",
//     project: "javascript-nextjs",

//     // Only print logs for uploading source maps in CI
//     silent: !process.env.CI,

//     // For all available options, see:
//     // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

//     // Upload a larger set of source maps for prettier stack traces (increases build time)
//     widenClientFileUpload: true,

//     // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
//     // This can increase your server load as well as your hosting bill.
//     // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
//     // side errors will fail.
//     tunnelRoute: "/monitoring",

//     // Automatically tree-shake Sentry logger statements to reduce bundle size
//     disableLogger: true,

//     // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
//     // See the following for more information:
//     // https://docs.sentry.io/product/crons/
//     // https://vercel.com/docs/cron-jobs
//     automaticVercelMonitors: true,
//   }
// );

/*************************************************************
 * Next.js Config + PWA + Sentry (Ready to Paste)
 *************************************************************/

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",

  fallbacks: {
    document: "/offline.html",
  },

  runtimeCaching: [
    {
      urlPattern: /^https?:.*\.(png|jpg|jpeg|svg|gif|webp|ico)$/,
      handler: "CacheFirst",
      options: {
        cacheName: "images-cache",
        expiration: {
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        },
      },
    },
    {
      urlPattern: /^https?:.*\.(js|css|map)$/,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "static-resources",
      },
    },
    {
      urlPattern: /^\/api\/.*$/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "api-cache",
        networkTimeoutSeconds: 10,
      },
    },
    {
      urlPattern: /^\/$/,
      handler: "NetworkFirst",
      options: {
        cacheName: "start-url",
      },
    },
  ],
});

/** @type {import('next').NextConfig} */
const baseNextConfig = {
  // your original turbopack config (kept unchanged)
  turbopack: {},
};

// wrap base config with PWA
const pwaNextConfig = withPWA(baseNextConfig);

// ---- SENTRY INTEGRATION ----
const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(
  pwaNextConfig,
  {
    org: "buyexchange-xl",
    project: "javascript-nextjs",

    silent: !process.env.CI,
    widenClientFileUpload: true,
    tunnelRoute: "/monitoring",
    disableLogger: true,
    automaticVercelMonitors: true,
  }
);
