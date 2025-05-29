
import React, { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (language: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  pt: {
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
    'navigation.community': 'Comunidade'
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
    'navigation.community': 'Community'
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
    'navigation.community': 'Comunidad'
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('pt');

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
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
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
