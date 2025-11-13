// postcss.config.js
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {
      content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
      // Add other Tailwind v4 configuration here
    },
    autoprefixer: {},
  },
}