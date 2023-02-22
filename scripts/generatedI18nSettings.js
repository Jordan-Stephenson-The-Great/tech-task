module.exports = {
  currency: 'USD',
  country: 'US',
  countries: [
    { name: 'DE', label: 'Germany' },
    { name: 'US', label: 'United States' }
  ],
  currencies: [
    { name: 'EUR', label: 'Euro' },
    { name: 'USD', label: 'US Dollar' }
  ],
  locales: [
    { code: 'de', label: 'German', file: 'de.js', iso: 'de' },
    { code: 'en', label: 'English', file: 'en.js', iso: 'en' }
  ],
  defaultLocale: 'en',
  lazy: true,
  langDir: 'lang/',
  vueI18n: {
    fallbackLocale: 'en',
    numberFormats: {
      en: {
        currency: {
          style: 'currency',
          currency: 'USD',
          currencyDisplay: 'symbol'
        }
      },
      de: {
        currency: {
          style: 'currency',
          currency: 'EUR',
          currencyDisplay: 'symbol'
        }
      }
    }
  },
  detectBrowserLanguage: false,
  autoChangeCookie: { currency: true },
  reloadOnLanguageChange: true
};
