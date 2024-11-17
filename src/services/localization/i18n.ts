import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import tr from './locales/tr.json';
import en from './locales/en.json';
import ru from './locales/ru.json';
import DroNetLocalStorageManager from '../middleware/DroNetLocalStorageManager';

// Dil çeviri dosyalarını tanımlayın
const resources = {
  en: { translation: en },
  tr: { translation: tr },
  ru: { translation: ru }
};

//const userLanguage = navigator.language || navigator.languages[0];

let userLanguage = '';
DroNetLocalStorageManager.getItem('language') ? userLanguage = DroNetLocalStorageManager.getItem('language') as string : userLanguage = '';
if (!userLanguage) {
  userLanguage = navigator.language.split('-')[0];
  // Eğer kullanıcının tarayıcısında dil tanımlı değilse ya da desteklenmeyen bir dilse varsayılan olarak 'en' kullanılacak
  if (userLanguage !== 'tr' && userLanguage !== 'en' && userLanguage !== 'ru') {
    userLanguage = 'en';
  }
  DroNetLocalStorageManager.setItem('language', userLanguage);
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: userLanguage, // Varsayılan dil
    interpolation: {
      escapeValue: false // React bileşenlerinde HTML kodlarını kullanabilmek için
    }
  });

export default i18n;
