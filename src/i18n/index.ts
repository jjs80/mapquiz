import { en } from './en';
import { fi } from './fi';

export type Language = 'en' | 'fi';

export const translations = {
  en,
  fi,
};

export const getTranslation = (language: Language) => {
  return translations[language] || translations.en;
};
