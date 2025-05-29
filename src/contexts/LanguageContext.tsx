import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'pt-BR' | 'en' | 'es' | 'fr' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: { [key: string]: { [key in Language]: string } } = {
  'common.save': {
    'pt-BR': 'Salvar',
    'en': 'Save',
    'es': 'Guardar',
    'fr': 'Enregistrer',
    'ar': 'يحفظ',
  },
  'common.close': {
    'pt-BR': 'Fechar',
    'en': 'Close',
    'es': 'Cerrar',
    'fr': 'Fermer',
    'ar': 'يغلق',
  },
  'common.error': {
    'pt-BR': 'Erro',
    'en': 'Error',
    'es': 'Error',
    'fr': 'Erreur',
    'ar': 'خطأ',
  },
  'common.loading': {
    'pt-BR': 'Carregando...',
    'en': 'Loading...',
    'es': 'Cargando...',
    'fr': 'Chargement...',
    'ar': 'جاري التحميل...',
  },
  'common.share': {
    'pt-BR': 'Compartilhar',
    'en': 'Share',
    'es': 'Compartir',
    'fr': 'Partager',
    'ar': 'يشارك',
  },
  'nav.home': {
    'pt-BR': 'Início',
    'en': 'Home',
    'es': 'Inicio',
    'fr': 'Accueil',
    'ar': 'الرئيسية',
  },
  'nav.read': {
    'pt-BR': 'Ler',
    'en': 'Read',
    'es': 'Leer',
    'fr': 'Lire',
    'ar': 'يقرأ',
  },
  'nav.search': {
    'pt-BR': 'Buscar',
    'en': 'Search',
    'es': 'Buscar',
    'fr': 'Chercher',
    'ar': 'يبحث',
  },
  'nav.community': {
    'pt-BR': 'Comunidade',
    'en': 'Community',
    'es': 'Comunidad',
    'fr': 'Communauté',
    'ar': 'مجتمع',
  },
  'nav.profile': {
    'pt-BR': 'Perfil',
    'en': 'Profile',
    'es': 'Perfil',
    'fr': 'Profil',
    'ar': 'الملف الشخصي',
  },
  'profile.title': {
    'pt-BR': 'Perfil',
    'en': 'Profile',
    'es': 'Perfil',
    'fr': 'Profil',
    'ar': 'الملف الشخصي',
  },
  'profile.achievements': {
    'pt-BR': 'Conquistas',
    'en': 'Achievements',
    'es': 'Logros',
    'fr': 'Réalisations',
    'ar': 'الإنجازات',
  },
  'profile.stats': {
    'pt-BR': 'Estatísticas',
    'en': 'Statistics',
    'es': 'Estadísticas',
    'fr': 'Statistiques',
    'ar': 'إحصائيات',
  },
  'profile.points': {
    'pt-BR': 'pontos',
    'en': 'points',
    'es': 'puntos',
    'fr': 'points',
    'ar': 'نقاط',
  },
  'profile.history': {
    'pt-BR': 'Histórico',
    'en': 'History',
    'es': 'Historial',
    'fr': 'Historique',
    'ar': 'التاريخ',
  },
  'profile.savedVerses': {
    'pt-BR': 'Versículos Salvos',
    'en': 'Saved Verses',
    'es': 'Versículos Guardados',
    'fr': 'Versets Sauvegardés',
    'ar': 'الآيات المحفوظة',
  },
  'profile.viewAllVerses': {
    'pt-BR': 'Ver todos os versículos',
    'en': 'View all verses',
    'es': 'Ver todos los versículos',
    'fr': 'Voir tous les versets',
    'ar': 'عرض جميع الآيات',
  },
  'profile.recentReading': {
    'pt-BR': 'Leituras Recentes',
    'en': 'Recent Reading',
    'es': 'Lectura Reciente',
    'fr': 'Lecture Récente',
    'ar': 'القراءة الأخيرة',
  },
  'profile.viewAllHistory': {
    'pt-BR': 'Ver histórico completo',
    'en': 'View complete history',
    'es': 'Ver historial completo',
    'fr': 'Voir l\'historique complet',
    'ar': 'عرض التاريخ الكامل',
  },
  'profile.readingStreak': {
    'pt-BR': 'Sequência de Leitura',
    'en': 'Reading Streak',
    'es': 'Racha de Lectura',
    'fr': 'Série de Lecture',
    'ar': 'سلسلة القراءة',
  },
  'profile.days': {
    'pt-BR': 'dias',
    'en': 'days',
    'es': 'días',
    'fr': 'jours',
    'ar': 'أيام',
  },
  'profile.dailyGoal': {
    'pt-BR': 'Meta Diária',
    'en': 'Daily Goal',
    'es': 'Meta Diaria',
    'fr': 'Objectif Quotidien',
    'ar': 'الهدف اليومي',
  },
  'profile.bestStreak': {
    'pt-BR': 'Melhor sequência',
    'en': 'Best streak',
    'es': 'Mejor racha',
    'fr': 'Meilleure série',
    'ar': 'أفضل سلسلة',
  },
  'profile.all': {
    'pt-BR': 'Todas',
    'en': 'All',
    'es': 'Todas',
    'fr': 'Toutes',
    'ar': 'الكل',
  },
  'profile.streak': {
    'pt-BR': 'Sequências',
    'en': 'Streaks',
    'es': 'Rachas',
    'fr': 'Séries',
    'ar': 'السلاسل',
  },
  'profile.milestones': {
    'pt-BR': 'Marcos',
    'en': 'Milestones',
    'es': 'Hitos',
    'fr': 'Jalons',
    'ar': 'المعالم',
  },
  'profile.challenges': {
    'pt-BR': 'Desafios',
    'en': 'Challenges',
    'es': 'Desafíos',
    'fr': 'Défis',
    'ar': 'التحديات',
  },
  'auth.guest': {
    'pt-BR': 'Visitante',
    'en': 'Guest',
    'es': 'Invitado',
    'fr': 'Invité',
    'ar': 'ضيف',
  },
  'auth.signOut': {
    'pt-BR': 'Sair',
    'en': 'Sign Out',
    'es': 'Cerrar Sesión',
    'fr': 'Se Déconnecter',
    'ar': 'خروج',
  },
  'auth.createAccount': {
    'pt-BR': 'Criar Conta',
    'en': 'Create Account',
    'es': 'Crear Cuenta',
    'fr': 'Créer un Compte',
    'ar': 'إنشاء حساب',
  },
  'auth.guestMode': {
    'pt-BR': 'Modo Visitante',
    'en': 'Guest Mode',
    'es': 'Modo Invitado',
    'fr': 'Mode Invité',
    'ar': 'وضع الضيف',
  },
  'auth.guestModeDescription': {
    'pt-BR': 'Você está usando o aplicativo como visitante. Crie uma conta para salvar seu progresso.',
    'en': 'You are using the app as a guest. Create an account to save your progress.',
    'es': 'Estás usando la aplicación como invitado. Crea una cuenta para guardar tu progreso.',
    'fr': 'Vous utilisez l\'application en tant qu\'invité. Créez un compte pour sauvegarder votre progression.',
    'ar': 'أنت تستخدم التطبيق كضيف. أنشئ حسابًا لحفظ تقدمك.',
  },
  'settings.title': {
    'pt-BR': 'Configurações',
    'en': 'Settings',
    'es': 'Ajustes',
    'fr': 'Paramètres',
    'ar': 'إعدادات',
  },
  'settings.profile': {
    'pt-BR': 'Meu Perfil',
    'en': 'My Profile',
    'es': 'Mi Perfil',
    'fr': 'Mon Profil',
    'ar': 'ملفي الشخصي',
  },
  'settings.language': {
    'pt-BR': 'Idioma',
    'en': 'Language',
    'es': 'Idioma',
    'fr': 'Langue',
    'ar': 'لغة',
  },
  'settings.fontSize': {
    'pt-BR': 'Tamanho da Fonte',
    'en': 'Font Size',
    'es': 'Tamaño de Fuente',
    'fr': 'Taille de la Police',
    'ar': 'حجم الخط',
  },
  'settings.fontSize.small': {
    'pt-BR': 'Pequeno',
    'en': 'Small',
    'es': 'Pequeño',
    'fr': 'Petit',
    'ar': 'صغير',
  },
  'settings.fontSize.medium': {
    'pt-BR': 'Médio',
    'en': 'Medium',
    'es': 'Mediano',
    'fr': 'Moyen',
    'ar': 'متوسط',
  },
  'settings.fontSize.large': {
    'pt-BR': 'Normal',
    'en': 'Large',
    'es': 'Grande',
    'fr': 'Grand',
    'ar': 'كبير',
  },
  'settings.fontSize.extraLarge': {
    'pt-BR': 'Grande',
    'en': 'Extra Large',
    'es': 'Extra Grande',
    'fr': 'Très Grand',
    'ar': 'كبير جدا',
  },
  'settings.fontSize.huge': {
    'pt-BR': 'Extra Grande',
    'en': 'Huge',
    'es': 'Enorme',
    'fr': 'Énorme',
    'ar': 'ضخم',
  },
  'settings.fontSizeChanged': {
    'pt-BR': 'Tamanho da fonte alterado para',
    'en': 'Font size changed to',
    'es': 'Tamaño de fuente cambiado a',
    'fr': 'Taille de police modifiée à',
    'ar': 'تم تغيير حجم الخط إلى',
  },
  'settings.systemLanguage': {
    'pt-BR': 'Usar idioma do sistema',
    'en': 'Use system language',
    'es': 'Usar idioma del sistema',
    'fr': 'Utiliser la langue du système',
    'ar': 'استخدام لغة النظام',
  },
  'settings.notifications': {
    'pt-BR': 'Notificações',
    'en': 'Notifications',
    'es': 'Notificaciones',
    'fr': 'Notifications',
    'ar': 'إشعارات',
  },
  'settings.dailyReminders': {
    'pt-BR': 'Receber lembretes de leitura diária',
    'en': 'Receive daily reading reminders',
    'es': 'Recibir recordatorios de lectura diaria',
    'fr': 'Recevoir des rappels de lecture quotidienne',
    'ar': 'تلقي تذكيرات بالقراءة اليومية',
  },
  'settings.autoScroll': {
    'pt-BR': 'Auto-rolagem',
    'en': 'Auto-scroll',
    'es': 'Desplazamiento automático',
    'fr': 'Défilement automatique',
    'ar': 'التمرير التلقائي',
  },
  'settings.autoScrollReading': {
    'pt-BR': 'Rolar automaticamente durante a leitura',
    'en': 'Automatically scroll during reading',
    'es': 'Desplazarse automáticamente durante la lectura',
    'fr': 'Défiler automatiquement pendant la lecture',
    'ar': 'التمرير تلقائيًا أثناء القراءة',
  },
  'settings.updateError': {
    'pt-BR': 'Não foi possível atualizar as configurações. Tente novamente.',
    'en': 'Could not update settings. Please try again.',
    'es': 'No se pudieron actualizar los ajustes. Por favor, inténtelo de nuevo.',
    'fr': 'Impossible de mettre à jour les paramètres. Veuillez réessayer.',
    'ar': 'تعذر تحديث الإعدادات. يرجى المحاولة مرة أخرى.',
  },
  'settings.general': {
    'pt-BR': 'Geral',
    'en': 'General',
    'es': 'General',
    'fr': 'Général',
    'ar': 'عام',
  },
  'bible.selectBook': {
    'pt-BR': 'Selecionar Livro',
    'en': 'Select Book',
    'es': 'Seleccionar Libro',
    'fr': 'Sélectionner un Livre',
    'ar': 'اختر كتابا',
  },
  'bible.selectChapter': {
    'pt-BR': 'Cap.',
    'en': 'Ch.',
    'es': 'Cap.',
    'fr': 'Chap.',
    'ar': 'الفصل',
  },
  'bible.oldTestament': {
    'pt-BR': 'Antigo Testamento',
    'en': 'Old Testament',
    'es': 'Antiguo Testamento',
    'fr': 'Ancien Testament',
    'ar': 'العهد القديم',
  },
  'bible.newTestament': {
    'pt-BR': 'Novo Testamento',
    'en': 'New Testament',
    'es': 'Nuevo Testamento',
    'fr': 'Nouveau Testament',
    'ar': 'العهد الجديد',
  },
  'bible.book': {
    'pt-BR': 'Livros',
    'en': 'Books',
    'es': 'Libros',
    'fr': 'Livres',
    'ar': 'الكتب',
  },
  'bible.testament': {
    'pt-BR': 'Testamentos',
    'en': 'Testaments',
    'es': 'Testamentos',
    'fr': 'Testaments',
    'ar': 'العهود',
  },
  'bible.unknown': {
    'pt-BR': 'Desconhecido',
    'en': 'Unknown',
    'es': 'Desconocido',
    'fr': 'Inconnu',
    'ar': 'غير معروف',
  },
  'achievements.none': {
    'pt-BR': 'Nenhuma conquista encontrada para este filtro.',
    'en': 'No achievements found for this filter.',
    'es': 'No se encontraron logros para este filtro.',
    'fr': 'Aucune réalisation trouvée pour ce filtre.',
    'ar': 'لم يتم العثور على إنجازات لهذا المرشح.',
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>((localStorage.getItem('language') as Language) || (navigator.language.startsWith('pt') ? 'pt-BR' : 'en'));

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string) => {
    const translation = translations[key]?.[language];
    return translation || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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
