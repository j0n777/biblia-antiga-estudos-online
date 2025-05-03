
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
    'common.saving': 'Salvando...',
    'common.cancel': 'Cancelar',
    'common.close': 'Fechar',
    'common.share': 'Compartilhar',
    'common.view': 'Ver',
    'common.edit': 'Editar',
    'common.delete': 'Excluir',
    'common.error': 'Erro',
    
    // Auth
    'auth.login': 'Entrar',
    'auth.signup': 'Cadastrar',
    'auth.logout': 'Sair',
    'auth.email': 'Email',
    'auth.password': 'Senha',
    'auth.name': 'Nome',
    'auth.forgotPassword': 'Esqueceu a senha?',
    'auth.createAccount': 'Criar conta',
    'auth.newPassword': 'Nova senha',
    'auth.confirmPassword': 'Confirmar senha',
    
    // Profile
    'profile.title': 'Meu Perfil',
    'profile.streak': 'Sequência Atual',
    'profile.achievements': 'Conquistas',
    'profile.stats': 'Estatísticas',
    'profile.ranking': 'Ranking',
    'profile.settings': 'Configurações',
    'profile.signOut': 'Sair da conta',
    'profile.visitor': 'Visitante',
    'profile.guestMode': 'Modo visitante',
    'profile.guestModeDescription': 'Você está navegando como visitante. Crie uma conta para salvar seu progresso, conquistas e participar do ranking.',
    'profile.viewNotes': 'Ver Notas',
    'profile.fullName': 'Nome completo',
    'profile.nickname': 'Apelido (para ranking)',
    'profile.country': 'País',
    'profile.birthYear': 'Ano de nascimento',
    'profile.phone': 'Telefone',
    'profile.readingProgress': 'Meu Progresso de Leitura',
    'profile.completedBooks': 'Livros Completados',
    'profile.chaptersRead': 'Capítulos Lidos',
    'profile.versesRead': 'Versículos Lidos',
    'profile.points': 'pontos',
    'profile.updated': 'Perfil atualizado',
    'profile.updateSuccess': 'Suas informações foram atualizadas com sucesso.',
    'profile.updateError': 'Não foi possível atualizar seu perfil. Tente novamente.',
    'profile.errorMessage': 'Ocorreu um erro ao atualizar seu perfil.',
    'profile.createAccountPrompt': 'Crie uma conta para salvar seu progresso e participar do ranking!',
    'profile.guestAccount': 'Conta Temporária',
    
    // Settings
    'settings.title': 'Configurações',
    'settings.description': 'Personalize sua experiência',
    'settings.language': 'Idioma',
    'settings.theme': 'Tema',
    'settings.notifications': 'Notificações',
    'settings.bibleVersion': 'Versão da Bíblia',
    'settings.systemLanguage': 'Usar idioma do sistema',
    'settings.systemLanguageDescription': 'Detectar automaticamente o idioma do dispositivo',
    'settings.notificationsDescription': 'Receber lembretes de leitura diária',
    'settings.autoScroll': 'Auto-rolagem',
    'settings.autoScrollDescription': 'Rolar automaticamente durante a leitura',
    'settings.updateError': 'Não foi possível atualizar configuração.',
    
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
    
    // Validation
    'validation.nicknameRequired': 'Apelido é obrigatório',
    'validation.minCharacters': 'Mínimo de 3 caracteres',
    'validation.invalidEmail': 'Email inválido',
    'validation.passwordMatch': 'As senhas não coincidem'
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
    'common.saving': 'Saving...',
    'common.cancel': 'Cancel',
    'common.close': 'Close',
    'common.share': 'Share',
    'common.view': 'View',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.error': 'Error',
    
    // Auth
    'auth.login': 'Login',
    'auth.signup': 'Sign Up',
    'auth.logout': 'Logout',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.name': 'Name',
    'auth.forgotPassword': 'Forgot password?',
    'auth.createAccount': 'Create account',
    'auth.newPassword': 'New password',
    'auth.confirmPassword': 'Confirm password',
    
    // Profile
    'profile.title': 'My Profile',
    'profile.streak': 'Current Streak',
    'profile.achievements': 'Achievements',
    'profile.stats': 'Statistics',
    'profile.ranking': 'Ranking',
    'profile.settings': 'Settings',
    'profile.signOut': 'Sign Out',
    'profile.visitor': 'Visitor',
    'profile.guestMode': 'Guest Mode',
    'profile.guestModeDescription': 'You are browsing as a guest. Create an account to save your progress, achievements and participate in the ranking.',
    'profile.viewNotes': 'View Notes',
    'profile.fullName': 'Full name',
    'profile.nickname': 'Nickname (for ranking)',
    'profile.country': 'Country',
    'profile.birthYear': 'Birth year',
    'profile.phone': 'Phone',
    'profile.readingProgress': 'My Reading Progress',
    'profile.completedBooks': 'Completed Books',
    'profile.chaptersRead': 'Chapters Read',
    'profile.versesRead': 'Verses Read',
    'profile.points': 'points',
    'profile.updated': 'Profile updated',
    'profile.updateSuccess': 'Your information has been successfully updated.',
    'profile.updateError': 'Could not update your profile. Try again.',
    'profile.errorMessage': 'An error occurred while updating your profile.',
    'profile.createAccountPrompt': 'Create an account to save your progress and participate in the ranking!',
    'profile.guestAccount': 'Temporary Account',
    
    // Settings
    'settings.title': 'Settings',
    'settings.description': 'Customize your experience',
    'settings.language': 'Language',
    'settings.theme': 'Theme',
    'settings.notifications': 'Notifications',
    'settings.bibleVersion': 'Bible Version',
    'settings.systemLanguage': 'Use system language',
    'settings.systemLanguageDescription': 'Automatically detect device language',
    'settings.notificationsDescription': 'Receive daily reading reminders',
    'settings.autoScroll': 'Auto-scroll',
    'settings.autoScrollDescription': 'Automatically scroll during reading',
    'settings.updateError': 'Could not update setting.',
    
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
    
    // Validation
    'validation.nicknameRequired': 'Nickname is required',
    'validation.minCharacters': 'Minimum 3 characters',
    'validation.invalidEmail': 'Invalid email',
    'validation.passwordMatch': 'Passwords do not match'
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
    'common.saving': 'Guardando...',
    'common.cancel': 'Cancelar',
    'common.close': 'Cerrar',
    'common.share': 'Compartir',
    'common.view': 'Ver',
    'common.edit': 'Editar',
    'common.delete': 'Eliminar',
    'common.error': 'Error',
    
    // Auth
    'auth.login': 'Iniciar sesión',
    'auth.signup': 'Registrarse',
    'auth.logout': 'Cerrar sesión',
    'auth.email': 'Correo electrónico',
    'auth.password': 'Contraseña',
    'auth.name': 'Nombre',
    'auth.forgotPassword': '¿Olvidó su contraseña?',
    'auth.createAccount': 'Crear cuenta',
    'auth.newPassword': 'Nueva contraseña',
    'auth.confirmPassword': 'Confirmar contraseña',
    
    // Profile
    'profile.title': 'Mi Perfil',
    'profile.streak': 'Racha Actual',
    'profile.achievements': 'Logros',
    'profile.stats': 'Estadísticas',
    'profile.ranking': 'Clasificación',
    'profile.settings': 'Configuración',
    'profile.signOut': 'Cerrar sesión',
    'profile.visitor': 'Visitante',
    'profile.guestMode': 'Modo invitado',
    'profile.guestModeDescription': 'Estás navegando como invitado. Crea una cuenta para guardar tu progreso, logros y participar en el ranking.',
    'profile.viewNotes': 'Ver Notas',
    'profile.fullName': 'Nombre completo',
    'profile.nickname': 'Apodo (para ranking)',
    'profile.country': 'País',
    'profile.birthYear': 'Año de nacimiento',
    'profile.phone': 'Teléfono',
    'profile.readingProgress': 'Mi Progreso de Lectura',
    'profile.completedBooks': 'Libros Completados',
    'profile.chaptersRead': 'Capítulos Leídos',
    'profile.versesRead': 'Versículos Leídos',
    'profile.points': 'puntos',
    'profile.updated': 'Perfil actualizado',
    'profile.updateSuccess': 'Tu información ha sido actualizada con éxito.',
    'profile.updateError': 'No se pudo actualizar tu perfil. Inténtelo de nuevo.',
    'profile.errorMessage': 'Ocurrió un error al actualizar tu perfil.',
    'profile.createAccountPrompt': '¡Crea una cuenta para guardar tu progreso y participar en el ranking!',
    'profile.guestAccount': 'Cuenta Temporal',
    
    // Settings
    'settings.title': 'Configuración',
    'settings.description': 'Personaliza tu experiencia',
    'settings.language': 'Idioma',
    'settings.theme': 'Tema',
    'settings.notifications': 'Notificaciones',
    'settings.bibleVersion': 'Versión de la Biblia',
    'settings.systemLanguage': 'Usar idioma del sistema',
    'settings.systemLanguageDescription': 'Detectar automáticamente el idioma del dispositivo',
    'settings.notificationsDescription': 'Recibir recordatorios de lectura diaria',
    'settings.autoScroll': 'Auto-desplazamiento',
    'settings.autoScrollDescription': 'Desplazarse automáticamente durante la lectura',
    'settings.updateError': 'No se pudo actualizar la configuración.',
    
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
    
    // Validation
    'validation.nicknameRequired': 'El apodo es obligatorio',
    'validation.minCharacters': 'Mínimo 3 caracteres',
    'validation.invalidEmail': 'Correo electrónico inválido',
    'validation.passwordMatch': 'Las contraseñas no coinciden'
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
    'common.saving': 'Enregistrement...',
    'common.cancel': 'Annuler',
    'common.close': 'Fermer',
    'common.share': 'Partager',
    'common.view': 'Voir',
    'common.edit': 'Modifier',
    'common.delete': 'Supprimer',
    'common.error': 'Erreur',
    
    // Auth
    'auth.login': 'Se connecter',
    'auth.signup': "S'inscrire",
    'auth.logout': 'Se déconnecter',
    'auth.email': 'Email',
    'auth.password': 'Mot de passe',
    'auth.name': 'Nom',
    'auth.forgotPassword': 'Mot de passe oublié?',
    'auth.createAccount': 'Créer un compte',
    'auth.newPassword': 'Nouveau mot de passe',
    'auth.confirmPassword': 'Confirmer le mot de passe',
    
    // Profile
    'profile.title': 'Mon Profil',
    'profile.streak': 'Série Actuelle',
    'profile.achievements': 'Succès',
    'profile.stats': 'Statistiques',
    'profile.ranking': 'Classement',
    'profile.settings': 'Paramètres',
    'profile.signOut': 'Se déconnecter',
    'profile.visitor': 'Visiteur',
    'profile.guestMode': 'Mode visiteur',
    'profile.guestModeDescription': 'Vous naviguez en tant que visiteur. Créez un compte pour sauvegarder votre progression, vos succès et participer au classement.',
    'profile.viewNotes': 'Voir les Notes',
    'profile.fullName': 'Nom complet',
    'profile.nickname': 'Pseudo (pour le classement)',
    'profile.country': 'Pays',
    'profile.birthYear': 'Année de naissance',
    'profile.phone': 'Téléphone',
    'profile.readingProgress': 'Ma Progression de Lecture',
    'profile.completedBooks': 'Livres Terminés',
    'profile.chaptersRead': 'Chapitres Lus',
    'profile.versesRead': 'Versets Lus',
    'profile.points': 'points',
    'profile.updated': 'Profil mis à jour',
    'profile.updateSuccess': 'Vos informations ont été mises à jour avec succès.',
    'profile.updateError': 'Impossible de mettre à jour votre profil. Réessayez.',
    'profile.errorMessage': "Une erreur s'est produite lors de la mise à jour de votre profil.",
    'profile.createAccountPrompt': 'Créez un compte pour sauvegarder votre progression et participer au classement !',
    'profile.guestAccount': 'Compte Temporaire',
    
    // Settings
    'settings.title': 'Paramètres',
    'settings.description': 'Personnalisez votre expérience',
    'settings.language': 'Langue',
    'settings.theme': 'Thème',
    'settings.notifications': 'Notifications',
    'settings.bibleVersion': 'Version de la Bible',
    'settings.systemLanguage': 'Utiliser la langue du système',
    'settings.systemLanguageDescription': 'Détecter automatiquement la langue de l\'appareil',
    'settings.notificationsDescription': 'Recevoir des rappels de lecture quotidiens',
    'settings.autoScroll': 'Défilement automatique',
    'settings.autoScrollDescription': 'Défiler automatiquement pendant la lecture',
    'settings.updateError': 'Impossible de mettre à jour le paramètre.',
    
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
    
    // Validation
    'validation.nicknameRequired': 'Le pseudo est obligatoire',
    'validation.minCharacters': 'Minimum 3 caractères',
    'validation.invalidEmail': 'Email invalide',
    'validation.passwordMatch': 'Les mots de passe ne correspondent pas'
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
    'common.saving': 'جاري الحفظ...',
    'common.cancel': 'إلغاء',
    'common.close': 'إغلاق',
    'common.share': 'مشاركة',
    'common.view': 'عرض',
    'common.edit': 'تعديل',
    'common.delete': 'حذف',
    'common.error': 'خطأ',
    
    // Auth
    'auth.login': 'تسجيل الدخول',
    'auth.signup': 'إنشاء حساب',
    'auth.logout': 'تسجيل الخروج',
    'auth.email': 'البريد الإلكتروني',
    'auth.password': 'كلمة المرور',
    'auth.name': 'الاسم',
    'auth.forgotPassword': 'نسيت كلمة المرور؟',
    'auth.createAccount': 'إنشاء حساب',
    'auth.newPassword': 'كلمة مرور جديدة',
    'auth.confirmPassword': 'تأكيد كلمة المرور',
    
    // Profile
    'profile.title': 'ملفي الشخصي',
    'profile.streak': 'التتابع الحالي',
    'profile.achievements': 'الإنجازات',
    'profile.stats': 'الإحصائيات',
    'profile.ranking': 'التصنيف',
    'profile.settings': 'الإعدادات',
    'profile.signOut': 'تسجيل الخروج',
    'profile.visitor': 'زائر',
    'profile.guestMode': 'وضع الزائر',
    'profile.guestModeDescription': 'أنت تتصفح كزائر. قم بإنشاء حساب لحفظ تقدمك وإنجازاتك والمشاركة في التصنيف.',
    'profile.viewNotes': 'عرض الملاحظات',
    'profile.fullName': 'الاسم الكامل',
    'profile.nickname': 'اللقب (للتصنيف)',
    'profile.country': 'البلد',
    'profile.birthYear': 'سنة الميلاد',
    'profile.phone': 'رقم الهاتف',
    'profile.readingProgress': 'تقدم القراءة الخاص بي',
    'profile.completedBooks': 'الكتب المكتملة',
    'profile.chaptersRead': 'الفصول المقروءة',
    'profile.versesRead': 'الآيات المقروءة',
    'profile.points': 'نقاط',
    'profile.updated': 'تم تحديث الملف الشخصي',
    'profile.updateSuccess': 'تم تحديث معلوماتك بنجاح.',
    'profile.updateError': 'تعذر تحديث ملفك الشخصي. حاول مرة أخرى.',
    'profile.errorMessage': 'حدث خطأ أثناء تحديث ملفك الشخصي.',
    'profile.createAccountPrompt': 'أنشئ حسابًا لحفظ تقدمك والمشاركة في التصنيف!',
    'profile.guestAccount': 'حساب مؤقت',
    
    // Settings
    'settings.title': 'الإعدادات',
    'settings.description': 'خصص تجربتك',
    'settings.language': 'اللغة',
    'settings.theme': 'المظهر',
    'settings.notifications': 'الإشعارات',
    'settings.bibleVersion': 'نسخة الكتاب المقدس',
    'settings.systemLanguage': 'استخدام لغة النظام',
    'settings.systemLanguageDescription': 'اكتشاف لغة الجهاز تلقائيًا',
    'settings.notificationsDescription': 'تلقي تذكيرات القراءة اليومية',
    'settings.autoScroll': 'التمرير التلقائي',
    'settings.autoScrollDescription': 'التمرير تلقائيًا أثناء القراءة',
    'settings.updateError': 'تعذر تحديث الإعداد.',
    
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
    
    // Validation
    'validation.nicknameRequired': 'اللقب مطلوب',
    'validation.minCharacters': '3 أحرف كحد أدنى',
    'validation.invalidEmail': 'بريد إلكتروني غير صالح',
    'validation.passwordMatch': 'كلمات المرور غير متطابقة'
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
