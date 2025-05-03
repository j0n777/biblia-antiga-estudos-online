
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'pt-BR' | 'en' | 'es' | 'fr' | 'ar';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  'pt-BR': {
    // Navigation
    'nav.home': 'Início',
    'nav.read': 'Leitura',
    'nav.search': 'Busca',
    'nav.profile': 'Perfil',
    
    // Common
    'common.loading': 'Carregando...',
    'common.search': 'Buscar',
    'common.save': 'Salvar',
    'common.cancel': 'Cancelar',
    'common.close': 'Fechar',
    'common.share': 'Compartilhar',
    'common.view': 'Ver',
    'common.edit': 'Editar',
    'common.delete': 'Excluir',
    
    // Auth
    'auth.login': 'Entrar',
    'auth.signup': 'Cadastrar',
    'auth.logout': 'Sair',
    'auth.email': 'Email',
    'auth.password': 'Senha',
    'auth.name': 'Nome',
    'auth.forgotPassword': 'Esqueceu a senha?',
    
    // Profile
    'profile.title': 'Meu Perfil',
    'profile.streak': 'Sequência Atual',
    'profile.achievements': 'Conquistas',
    'profile.stats': 'Estatísticas',
    'profile.ranking': 'Ranking',
    'profile.settings': 'Configurações',
    'profile.signOut': 'Sair da conta',
    
    // Settings
    'settings.title': 'Configurações',
    'settings.language': 'Idioma',
    'settings.theme': 'Tema',
    'settings.notifications': 'Notificações',
    'settings.bibleVersion': 'Versão da Bíblia',
    
    // Bible
    'bible.verse': 'Versículo',
    'bible.chapter': 'Capítulo',
    'bible.book': 'Livro',
    'bible.testament': 'Testamento',
    'bible.oldTestament': 'Antigo Testamento',
    'bible.newTestament': 'Novo Testamento',
    
    // Achievements
    'achievements.title': 'Conquistas',
    'achievements.recent': 'Conquistas Recentes',
    'achievements.viewAll': 'Ver todas',
    'achievements.locked': 'Bloqueado',
    'achievements.streak.title': 'Sequência de Leitura',
    'achievements.streak.days': 'dias',
    'achievements.streak.record': 'Recorde',
    
    // Studies
    'studies.title': 'Estudos Bíblicos',
    'studies.viewAll': 'Ver todos',
    'studies.searchStudies': 'Buscar estudos',
  },
  
  'en': {
    // Navigation
    'nav.home': 'Home',
    'nav.read': 'Read',
    'nav.search': 'Search',
    'nav.profile': 'Profile',
    
    // Common
    'common.loading': 'Loading...',
    'common.search': 'Search',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.close': 'Close',
    'common.share': 'Share',
    'common.view': 'View',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    
    // Auth
    'auth.login': 'Login',
    'auth.signup': 'Sign Up',
    'auth.logout': 'Logout',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.name': 'Name',
    'auth.forgotPassword': 'Forgot password?',
    
    // Profile
    'profile.title': 'My Profile',
    'profile.streak': 'Current Streak',
    'profile.achievements': 'Achievements',
    'profile.stats': 'Statistics',
    'profile.ranking': 'Ranking',
    'profile.settings': 'Settings',
    'profile.signOut': 'Sign Out',
    
    // Settings
    'settings.title': 'Settings',
    'settings.language': 'Language',
    'settings.theme': 'Theme',
    'settings.notifications': 'Notifications',
    'settings.bibleVersion': 'Bible Version',
    
    // Bible
    'bible.verse': 'Verse',
    'bible.chapter': 'Chapter',
    'bible.book': 'Book',
    'bible.testament': 'Testament',
    'bible.oldTestament': 'Old Testament',
    'bible.newTestament': 'New Testament',
    
    // Achievements
    'achievements.title': 'Achievements',
    'achievements.recent': 'Recent Achievements',
    'achievements.viewAll': 'View all',
    'achievements.locked': 'Locked',
    'achievements.streak.title': 'Reading Streak',
    'achievements.streak.days': 'days',
    'achievements.streak.record': 'Record',
    
    // Studies
    'studies.title': 'Bible Studies',
    'studies.viewAll': 'View all',
    'studies.searchStudies': 'Search studies',
  },
  
  'es': {
    // Navigation
    'nav.home': 'Inicio',
    'nav.read': 'Lectura',
    'nav.search': 'Búsqueda',
    'nav.profile': 'Perfil',
    
    // Common
    'common.loading': 'Cargando...',
    'common.search': 'Buscar',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.close': 'Cerrar',
    'common.share': 'Compartir',
    'common.view': 'Ver',
    'common.edit': 'Editar',
    'common.delete': 'Eliminar',
    
    // Auth
    'auth.login': 'Iniciar sesión',
    'auth.signup': 'Registrarse',
    'auth.logout': 'Cerrar sesión',
    'auth.email': 'Correo electrónico',
    'auth.password': 'Contraseña',
    'auth.name': 'Nombre',
    'auth.forgotPassword': '¿Olvidó su contraseña?',
    
    // Profile
    'profile.title': 'Mi Perfil',
    'profile.streak': 'Racha Actual',
    'profile.achievements': 'Logros',
    'profile.stats': 'Estadísticas',
    'profile.ranking': 'Clasificación',
    'profile.settings': 'Configuración',
    'profile.signOut': 'Cerrar sesión',
    
    // Settings
    'settings.title': 'Configuración',
    'settings.language': 'Idioma',
    'settings.theme': 'Tema',
    'settings.notifications': 'Notificaciones',
    'settings.bibleVersion': 'Versión de la Biblia',
    
    // Bible
    'bible.verse': 'Versículo',
    'bible.chapter': 'Capítulo',
    'bible.book': 'Libro',
    'bible.testament': 'Testamento',
    'bible.oldTestament': 'Antiguo Testamento',
    'bible.newTestament': 'Nuevo Testamento',
    
    // Achievements
    'achievements.title': 'Logros',
    'achievements.recent': 'Logros Recientes',
    'achievements.viewAll': 'Ver todos',
    'achievements.locked': 'Bloqueado',
    'achievements.streak.title': 'Racha de Lectura',
    'achievements.streak.days': 'días',
    'achievements.streak.record': 'Récord',
    
    // Studies
    'studies.title': 'Estudios Bíblicos',
    'studies.viewAll': 'Ver todos',
    'studies.searchStudies': 'Buscar estudios',
  },
  
  'fr': {
    // Navigation
    'nav.home': 'Accueil',
    'nav.read': 'Lecture',
    'nav.search': 'Recherche',
    'nav.profile': 'Profil',
    
    // Common
    'common.loading': 'Chargement...',
    'common.search': 'Rechercher',
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.close': 'Fermer',
    'common.share': 'Partager',
    'common.view': 'Voir',
    'common.edit': 'Modifier',
    'common.delete': 'Supprimer',
    
    // Auth
    'auth.login': 'Se connecter',
    'auth.signup': "S'inscrire",
    'auth.logout': 'Se déconnecter',
    'auth.email': 'Email',
    'auth.password': 'Mot de passe',
    'auth.name': 'Nom',
    'auth.forgotPassword': 'Mot de passe oublié?',
    
    // Profile
    'profile.title': 'Mon Profil',
    'profile.streak': 'Série Actuelle',
    'profile.achievements': 'Succès',
    'profile.stats': 'Statistiques',
    'profile.ranking': 'Classement',
    'profile.settings': 'Paramètres',
    'profile.signOut': 'Se déconnecter',
    
    // Settings
    'settings.title': 'Paramètres',
    'settings.language': 'Langue',
    'settings.theme': 'Thème',
    'settings.notifications': 'Notifications',
    'settings.bibleVersion': 'Version de la Bible',
    
    // Bible
    'bible.verse': 'Verset',
    'bible.chapter': 'Chapitre',
    'bible.book': 'Livre',
    'bible.testament': 'Testament',
    'bible.oldTestament': 'Ancien Testament',
    'bible.newTestament': 'Nouveau Testament',
    
    // Achievements
    'achievements.title': 'Succès',
    'achievements.recent': 'Succès Récents',
    'achievements.viewAll': 'Voir tout',
    'achievements.locked': 'Verrouillé',
    'achievements.streak.title': 'Série de Lecture',
    'achievements.streak.days': 'jours',
    'achievements.streak.record': 'Record',
    
    // Studies
    'studies.title': 'Études Bibliques',
    'studies.viewAll': 'Voir tout',
    'studies.searchStudies': 'Rechercher des études',
  },
  
  'ar': {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.read': 'قراءة',
    'nav.search': 'بحث',
    'nav.profile': 'الملف الشخصي',
    
    // Common
    'common.loading': 'جار التحميل...',
    'common.search': 'بحث',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.close': 'إغلاق',
    'common.share': 'مشاركة',
    'common.view': 'عرض',
    'common.edit': 'تعديل',
    'common.delete': 'حذف',
    
    // Auth
    'auth.login': 'تسجيل الدخول',
    'auth.signup': 'إنشاء حساب',
    'auth.logout': 'تسجيل الخروج',
    'auth.email': 'البريد الإلكتروني',
    'auth.password': 'كلمة المرور',
    'auth.name': 'الاسم',
    'auth.forgotPassword': 'نسيت كلمة المرور؟',
    
    // Profile
    'profile.title': 'ملفي الشخصي',
    'profile.streak': 'التتابع الحالي',
    'profile.achievements': 'الإنجازات',
    'profile.stats': 'الإحصائيات',
    'profile.ranking': 'التصنيف',
    'profile.settings': 'الإعدادات',
    'profile.signOut': 'تسجيل الخروج',
    
    // Settings
    'settings.title': 'الإعدادات',
    'settings.language': 'اللغة',
    'settings.theme': 'المظهر',
    'settings.notifications': 'الإشعارات',
    'settings.bibleVersion': 'نسخة الكتاب المقدس',
    
    // Bible
    'bible.verse': 'آية',
    'bible.chapter': 'إصحاح',
    'bible.book': 'كتاب',
    'bible.testament': 'عهد',
    'bible.oldTestament': 'العهد القديم',
    'bible.newTestament': 'العهد الجديد',
    
    // Achievements
    'achievements.title': 'الإنجازات',
    'achievements.recent': 'الإنجازات الأخيرة',
    'achievements.viewAll': 'عرض الكل',
    'achievements.locked': 'مقفل',
    'achievements.streak.title': 'تتابع القراءة',
    'achievements.streak.days': 'أيام',
    'achievements.streak.record': 'الرقم القياسي',
    
    // Studies
    'studies.title': 'دراسات الكتاب المقدس',
    'studies.viewAll': 'عرض الكل',
    'studies.searchStudies': 'بحث في الدراسات',
  }
};

// Detect browser language and return supported language or default to pt-BR
const detectBrowserLanguage = (): Language => {
  const browserLang = navigator.language;
  
  if (browserLang.startsWith('pt')) return 'pt-BR';
  if (browserLang.startsWith('en')) return 'en';
  if (browserLang.startsWith('es')) return 'es';
  if (browserLang.startsWith('fr')) return 'fr';
  if (browserLang.startsWith('ar')) return 'ar';
  
  return 'pt-BR'; // Default
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Try to get saved language from localStorage, or detect from browser
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLang = localStorage.getItem('app-language');
    if (savedLang && ['pt-BR', 'en', 'es', 'fr', 'ar'].includes(savedLang)) {
      return savedLang as Language;
    }
    return detectBrowserLanguage();
  });
  
  // Update language and save to localStorage
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app-language', lang);
  };
  
  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key;
  };
  
  // Effect to set document language attribute
  useEffect(() => {
    document.documentElement.lang = language;
    // For Arabic, add RTL direction
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  
  return context;
};
