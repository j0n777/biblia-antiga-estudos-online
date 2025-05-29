
export type Language = 'pt-BR' | 'en' | 'es' | 'fr' | 'ar';

export interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}
