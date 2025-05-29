
import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'pt-BR' | 'en' | 'es' | 'fr' | 'ar';

interface LanguageContextType {
  currentLanguage: string;
  language: string; // Add language as alias for currentLanguage
  setLanguage: (language: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  'pt-BR': {
    'home.title': 'Início',
    'home.greeting': 'Bem-vindo',
    'home.subtitle': 'Comece sua jornada espiritual',
    'home.dailyVerse': 'Versículo do Dia',
    'search.title': 'Pesquisar na Bíblia',
    'search.placeholder': 'Digite uma palavra ou referência...',
    'search.noResults': 'Nenhum resultado encontrado',
    'profile.title': 'Perfil',
    'community.title': 'Comunidade',
    'read.title': 'Leitura',
    'navigation.home': 'Início',
    'navigation.search': 'Pesquisar',
    'navigation.read': 'Ler',
    'navigation.profile': 'Perfil',
    'navigation.community': 'Comunidade',
    'nav.home': 'Início',
    'nav.search': 'Buscar',
    'nav.read': 'Ler',
    'nav.profile': 'Perfil',
    'nav.community': 'Comunidade'
  },
  en: {
    'home.title': 'Home',
    'home.greeting': 'Welcome',
    'home.subtitle': 'Start your spiritual journey',
    'home.dailyVerse': 'Daily Verse',
    'search.title': 'Search Bible',
    'search.placeholder': 'Type a word or reference...',
    'search.noResults': 'No results found',
    'profile.title': 'Profile',
    'community.title': 'Community',
    'read.title': 'Read',
    'navigation.home': 'Home',
    'navigation.search': 'Search',
    'navigation.read': 'Read',
    'navigation.profile': 'Profile',
    'navigation.community': 'Community',
    'nav.home': 'Home',
    'nav.search': 'Search',
    'nav.read': 'Read',
    'nav.profile': 'Profile',
    'nav.community': 'Community'
  },
  es: {
    'home.title': 'Inicio',
    'home.greeting': 'Bienvenido',
    'home.subtitle': 'Comienza tu viaje espiritual',
    'home.dailyVerse': 'Versículo del Día',
    'search.title': 'Buscar en la Biblia',
    'search.placeholder': 'Escribe una palabra o referencia...',
    'search.noResults': 'No se encontraron resultados',
    'profile.title': 'Perfil',
    'community.title': 'Comunidad',
    'read.title': 'Leer',
    'navigation.home': 'Inicio',
    'navigation.search': 'Buscar',
    'navigation.read': 'Leer',
    'navigation.profile': 'Perfil',
    'navigation.community': 'Comunidad',
    'nav.home': 'Inicio',
    'nav.search': 'Buscar',
    'nav.read': 'Leer',
    'nav.profile': 'Perfil',
    'nav.community': 'Comunidad'
  },
  fr: {
    'home.title': 'Accueil',
    'home.greeting': 'Bienvenue',
    'home.subtitle': 'Commencez votre voyage spirituel',
    'home.dailyVerse': 'Verset du Jour',
    'search.title': 'Rechercher dans la Bible',
    'search.placeholder': 'Tapez un mot ou une référence...',
    'search.noResults': 'Aucun résultat trouvé',
    'profile.title': 'Profil',
    'community.title': 'Communauté',
    'read.title': 'Lire',
    'navigation.home': 'Accueil',
    'navigation.search': 'Rechercher',
    'navigation.read': 'Lire',
    'navigation.profile': 'Profil',
    'navigation.community': 'Communauté',
    'nav.home': 'Accueil',
    'nav.search': 'Rechercher',
    'nav.read': 'Lire',
    'nav.profile': 'Profil',
    'nav.community': 'Communauté'
  },
  ar: {
    'home.title': 'الرئيسية',
    'home.greeting': 'مرحبا',
    'home.subtitle': 'ابدأ رحلتك الروحية',
    'home.dailyVerse': 'آية اليوم',
    'search.title': 'البحث في الكتاب المقدس',
    'search.placeholder': 'اكتب كلمة أو مرجع...',
    'search.noResults': 'لم يتم العثور على نتائج',
    'profile.title': 'الملف الشخصي',
    'community.title': 'المجتمع',
    'read.title': 'قراءة',
    'navigation.home': 'الرئيسية',
    'navigation.search': 'البحث',
    'navigation.read': 'قراءة',
    'navigation.profile': 'الملف الشخصي',
    'navigation.community': 'المجتمع',
    'nav.home': 'الرئيسية',
    'nav.search': 'البحث',
    'nav.read': 'قراءة',
    'nav.profile': 'الملف الشخصي',
    'nav.community': 'المجتمع'
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('pt-BR');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language');
    if (savedLanguage && translations[savedLanguage as keyof typeof translations]) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const setLanguage = (language: string) => {
    setCurrentLanguage(language);
    localStorage.setItem('preferred-language', language);
  };

  const t = (key: string): string => {
    const langTranslations = translations[currentLanguage as keyof typeof translations];
    return langTranslations?.[key as keyof typeof langTranslations] || key;
  };

  return (
    <LanguageContext.Provider value={{ 
      currentLanguage, 
      language: currentLanguage, // Add language as alias
      setLanguage, 
      t 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
