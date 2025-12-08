// i18n/request.ts
import { getRequestConfig } from 'next-intl/server';

const locales = ['en', 'ml']; // Update here too

export default getRequestConfig(async ({ locale }) => {
  // Validate the locale
  if (!locale || !locales.includes(locale as any)) {
    locale = 'en';
  }

  try {
    return {
      locale,
      messages: (await import(`@/messages/${locale}.json`)).default
    };
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    
    // Fallback to English
    return {
      locale: 'en',
      messages: (await import('@/messages/en.json')).default
    };
  }
});