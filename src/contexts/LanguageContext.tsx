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
