
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
    'nav.community': 'Comunidade',
    'verseOfDay.title': 'Versículo do Dia',
    'profile.readingStreak': 'Sequência de Leitura',
    'profile.dailyGoal': 'Meta Diária',
    'profile.bestStreak': 'Melhor Sequência',
    'profile.days': 'dias',
    'profile.achievements': 'Conquistas',
    'profile.stats': 'Estatísticas',
    'auth.signOut': 'Sair',
    'auth.createAccount': 'Criar Conta',
    'auth.guestModeDescription': 'Você está no modo visitante. Crie uma conta para salvar seu progresso.',
    'common.loading': 'Carregando...',
    'common.close': 'Fechar',
    'common.save': 'Salvar',
    'common.cancel': 'Cancelar',
    'settings.title': 'Configurações',
    'settings.profile': 'Meu Perfil',
    'settings.language': 'Idioma',
    'settings.fontSize': 'Tamanho da Fonte',
    'settings.fontSize.small': 'Pequeno',
    'settings.fontSize.medium': 'Médio',
    'settings.fontSize.large': 'Grande',
    'settings.notifications': 'Notificações',
    'settings.autoScroll': 'Auto-rolagem',
    'settings.systemLanguage': 'Usar idioma do sistema',
    'settings.dailyReminders': 'Receber lembretes de leitura diária',
    'settings.autoScrollReading': 'Rolar automaticamente durante a leitura',
    'settings.fontSizeChanged': 'Tamanho da fonte alterado',
    'settings.fontSizeLarge': 'Grande'
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
    'nav.community': 'Community',
    'verseOfDay.title': 'Verse of the Day',
    'profile.readingStreak': 'Reading Streak',
    'profile.dailyGoal': 'Daily Goal',
    'profile.bestStreak': 'Best Streak',
    'profile.days': 'days',
    'profile.achievements': 'Achievements',
    'profile.stats': 'Statistics',
    'auth.signOut': 'Sign Out',
    'auth.createAccount': 'Create Account',
    'auth.guestModeDescription': 'You are in guest mode. Create an account to save your progress.',
    'common.loading': 'Loading...',
    'common.close': 'Close',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'settings.title': 'Settings',
    'settings.profile': 'My Profile',
    'settings.language': 'Language',
    'settings.fontSize': 'Font Size',
    'settings.fontSize.small': 'Small',
    'settings.fontSize.medium': 'Medium',
    'settings.fontSize.large': 'Large',
    'settings.notifications': 'Notifications',
    'settings.autoScroll': 'Auto-scroll',
    'settings.systemLanguage': 'Use system language',
    'settings.dailyReminders': 'Receive daily reading reminders',
    'settings.autoScrollReading': 'Auto scroll during reading',
    'settings.fontSizeChanged': 'Font size changed',
    'settings.fontSizeLarge': 'Large'
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
    'nav.community': 'Comunidad',
    'verseOfDay.title': 'Versículo del Día',
    'profile.readingStreak': 'Racha de Lectura',
    'profile.dailyGoal': 'Meta Diaria',
    'profile.bestStreak': 'Mejor Racha',
    'profile.days': 'días',
    'profile.achievements': 'Logros',
    'profile.stats': 'Estadísticas',
    'auth.signOut': 'Cerrar Sesión',
    'auth.createAccount': 'Crear Cuenta',
    'auth.guestModeDescription': 'Estás en modo invitado. Crea una cuenta para guardar tu progreso.',
    'common.loading': 'Cargando...',
    'common.close': 'Cerrar',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'settings.title': 'Configuraciones',
    'settings.profile': 'Mi Perfil',
    'settings.language': 'Idioma',
    'settings.fontSize': 'Tamaño de Fuente',
    'settings.fontSize.small': 'Pequeño',
    'settings.fontSize.medium': 'Mediano',
    'settings.fontSize.large': 'Grande',
    'settings.notifications': 'Notificaciones',
    'settings.autoScroll': 'Desplazamiento automático',
    'settings.systemLanguage': 'Usar idioma del sistema',
    'settings.dailyReminders': 'Recibir recordatorios de lectura diaria',
    'settings.autoScrollReading': 'Desplazamiento automático durante la lectura',
    'settings.fontSizeChanged': 'Tamaño de fuente cambiado',
    'settings.fontSizeLarge': 'Grande'
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
    'nav.community': 'Communauté',
    'verseOfDay.title': 'Verset du Jour',
    'profile.readingStreak': 'Série de Lecture',
    'profile.dailyGoal': 'Objectif Quotidien',
    'profile.bestStreak': 'Meilleure Série',
    'profile.days': 'jours',
    'profile.achievements': 'Réalisations',
    'profile.stats': 'Statistiques',
    'auth.signOut': 'Se Déconnecter',
    'auth.createAccount': 'Créer un Compte',
    'auth.guestModeDescription': 'Vous êtes en mode invité. Créez un compte pour sauvegarder votre progression.',
    'common.loading': 'Chargement...',
    'common.close': 'Fermer',
    'common.save': 'Sauvegarder',
    'common.cancel': 'Annuler',
    'settings.title': 'Paramètres',
    'settings.profile': 'Mon Profil',
    'settings.language': 'Langue',
    'settings.fontSize': 'Taille de Police',
    'settings.fontSize.small': 'Petit',
    'settings.fontSize.medium': 'Moyen',
    'settings.fontSize.large': 'Grand',
    'settings.notifications': 'Notifications',
    'settings.autoScroll': 'Défilement automatique',
    'settings.systemLanguage': 'Utiliser la langue du système',
    'settings.dailyReminders': 'Recevoir des rappels de lecture quotidiens',
    'settings.autoScrollReading': 'Défilement automatique pendant la lecture',
    'settings.fontSizeChanged': 'Taille de police modifiée',
    'settings.fontSizeLarge': 'Grand'
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
    'nav.community': 'المجتمع',
    'verseOfDay.title': 'آية اليوم',
    'profile.readingStreak': 'سلسلة القراءة',
    'profile.dailyGoal': 'الهدف اليومي',
    'profile.bestStreak': 'أفضل سلسلة',
    'profile.days': 'أيام',
    'profile.achievements': 'الإنجازات',
    'profile.stats': 'الإحصائيات',
    'auth.signOut': 'تسجيل الخروج',
    'auth.createAccount': 'إنشاء حساب',
    'auth.guestModeDescription': 'أنت في وضع الضيف. قم بإنشاء حساب لحفظ تقدمك.',
    'common.loading': 'جاري التحميل...',
    'common.close': 'إغلاق',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'settings.title': 'الإعدادات',
    'settings.profile': 'ملفي الشخصي',
    'settings.language': 'اللغة',
    'settings.fontSize': 'حجم الخط',
    'settings.fontSize.small': 'صغير',
    'settings.fontSize.medium': 'متوسط',
    'settings.fontSize.large': 'كبير',
    'settings.notifications': 'الإشعارات',
    'settings.autoScroll': 'التمرير التلقائي',
    'settings.systemLanguage': 'استخدام لغة النظام',
    'settings.dailyReminders': 'تلقي تذكيرات القراءة اليومية',
    'settings.autoScrollReading': 'التمرير التلقائي أثناء القراءة',
    'settings.fontSizeChanged': 'تم تغيير حجم الخط',
    'settings.fontSizeLarge': 'كبير'
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
