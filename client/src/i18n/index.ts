import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { en, zh, ja, de, es } from './locales';

// the translations
const resources = {
  en: {
    translation: en
  },
  zh: {
    translation: zh
  },
  ja: {
    translation: ja
  },
  de: {
    translation: de
  },
  es: {
    translation: es
  }
};

i18n
  // detect user language
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next
  .use(initReactI18next)
  // init i18next
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    }
  });

export default i18n;