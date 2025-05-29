import React, { createContext, useContext, useState, useEffect } from 'react';

interface Translations {
  [key: string]: string;
}

interface LanguageContextProps {
  language: string;
  setLanguage: (language: string) => void;
  translations: Translations;
}

const LanguageContext = createContext<LanguageContextProps>({
  language: 'pt',
  setLanguage: () => {},
  translations: {}
});

const translationsData: { [key: string]: Translations } = {
  pt: {
    'common.loading': 'Carregando...',
    'bible.selectBook': 'Selecionar Livro',
    'bible.oldTestament': 'Antigo Testamento',
    'bible.newTestament': 'Novo Testamento',
    'bible.selectChapter': 'Selecionar Capítulo',
    'bible.chapterNotFound': 'Capítulo não encontrado',
    'bible.tryAnotherChapter': 'Por favor selecione outro livro ou capítulo.',
    'bible.verseSaved': 'Versículo Salvo!',
    'profile.title': 'Perfil',
    'profile.achievements': 'Conquistas',
    'profile.stats': 'Estatísticas',
    'auth.signOut': 'Sair',
    'auth.createAccount': 'Criar Conta',
    'readingHistory.title': 'Histórico de Leitura',
    'readingHistory.noReadings': 'Nenhum histórico de leitura encontrado.',
    'readingHistory.date': 'Data',
    'readingHistory.book': 'Livro',
    'readingHistory.chapter': 'Capítulo',
    'readingHistory.verse': 'Versículo',
    'readingHistory.actions': 'Ações',
    'readingHistory.view': 'Visualizar',
    'readingHistory.clearHistory': 'Limpar Histórico',
    'readingHistory.clearConfirmation': 'Tem certeza que deseja limpar seu histórico de leitura?',
    'readingHistory.clearConfirmationYes': 'Sim, Limpar',
    'readingHistory.clearConfirmationNo': 'Não, Cancelar',
    'savedVerses.title': 'Versículos Salvos',
    'savedVerses.noVerses': 'Nenhum versículo salvo encontrado.',
    'savedVerses.book': 'Livro',
    'savedVerses.chapter': 'Capítulo',
    'savedVerses.verse': 'Versículo',
    'savedVerses.actions': 'Ações',
    'savedVerses.read': 'Ler',
    'settings.title': 'Configurações',
    'settings.displayName': 'Nome de Exibição',
    'settings.nickname': 'Apelido',
    'settings.email': 'Email',
    'settings.preferredLanguage': 'Idioma Preferido',
    'settings.preferredBibleVersion': 'Versão da Bíblia Preferida',
    'settings.dailyReadingGoal': 'Meta de Leitura Diária (minutos)',
    'settings.save': 'Salvar',
    'settings.cancel': 'Cancelar',
    'settings.success': 'Configurações salvas com sucesso!',
    'settings.error': 'Erro ao salvar as configurações.',
    'onboarding.welcome': 'Bem-vindo(a)!',
    'onboarding.steps.one': 'Explore a Bíblia',
    'onboarding.steps.two': 'Salve seus versículos favoritos',
    'onboarding.steps.three': 'Acompanhe seu progresso',
    'onboarding.getStarted': 'Começar',
    'onboarding.next': 'Próximo',
    'onboarding.finish': 'Finalizar',
    'guestMode.title': 'Modo Convidado',
    'guestMode.description': 'Você está usando o aplicativo no modo convidado. Crie uma conta para salvar seu progresso e configurações.',
    'guestMode.createAccount': 'Criar Conta',
    'statistics.title': 'Estatísticas',
    'statistics.totalReadings': 'Leituras Totais',
    'statistics.versesSaved': 'Versículos Salvos',
    'statistics.longestStreak': 'Maior Sequência de Dias Lendo',
    'statistics.currentStreak': 'Sequência Atual de Dias Lendo',
    'statistics.noData': 'Nenhum dado estatístico disponível.',
    'statistics.minutesReadToday': 'Minutos Lidos Hoje',
    'statistics.dailyGoal': 'Meta Diária',
    'statistics.minutes': 'minutos',
    'statistics.goalMet': 'Meta Cumprida!',
    'statistics.keepGoing': 'Continue Lendo!',
  },
  en: {
    'common.loading': 'Loading...',
    'bible.selectBook': 'Select Book',
    'bible.oldTestament': 'Old Testament',
    'bible.newTestament': 'New Testament',
    'bible.selectChapter': 'Select Chapter',
    'bible.chapterNotFound': 'Chapter not found',
    'bible.tryAnotherChapter': 'Please select another book or chapter.',
    'bible.verseSaved': 'Verse Saved!',
    'profile.title': 'Profile',
    'profile.achievements': 'Achievements',
    'profile.stats': 'Statistics',
    'auth.signOut': 'Sign Out',
    'auth.createAccount': 'Create Account',
    'readingHistory.title': 'Reading History',
    'readingHistory.noReadings': 'No reading history found.',
    'readingHistory.date': 'Date',
    'readingHistory.book': 'Book',
    'readingHistory.chapter': 'Chapter',
    'readingHistory.verse': 'Verse',
    'readingHistory.actions': 'Actions',
    'readingHistory.view': 'View',
    'readingHistory.clearHistory': 'Clear History',
    'readingHistory.clearConfirmation': 'Are you sure you want to clear your reading history?',
    'readingHistory.clearConfirmationYes': 'Yes, Clear',
    'readingHistory.clearConfirmationNo': 'No, Cancel',
    'savedVerses.title': 'Saved Verses',
    'savedVerses.noVerses': 'No saved verses found.',
    'savedVerses.book': 'Book',
    'savedVerses.chapter': 'Chapter',
    'savedVerses.verse': 'Verse',
    'savedVerses.actions': 'Actions',
    'savedVerses.read': 'Read',
    'settings.title': 'Settings',
    'settings.displayName': 'Display Name',
    'settings.nickname': 'Nickname',
    'settings.email': 'Email',
    'settings.preferredLanguage': 'Preferred Language',
    'settings.preferredBibleVersion': 'Preferred Bible Version',
    'settings.dailyReadingGoal': 'Daily Reading Goal (minutes)',
    'settings.save': 'Save',
    'settings.cancel': 'Cancel',
    'settings.success': 'Settings saved successfully!',
    'settings.error': 'Error saving settings.',
     'onboarding.welcome': 'Welcome!',
    'onboarding.steps.one': 'Explore the Bible',
    'onboarding.steps.two': 'Save your favorite verses',
    'onboarding.steps.three': 'Track your progress',
    'onboarding.getStarted': 'Get Started',
    'onboarding.next': 'Next',
    'onboarding.finish': 'Finish',
    'guestMode.title': 'Guest Mode',
    'guestMode.description': 'You are using the app in guest mode. Create an account to save your progress and settings.',
    'guestMode.createAccount': 'Create Account',
    'statistics.title': 'Statistics',
    'statistics.totalReadings': 'Total Readings',
    'statistics.versesSaved': 'Verses Saved',
    'statistics.longestStreak': 'Longest Reading Streak',
    'statistics.currentStreak': 'Current Reading Streak',
    'statistics.noData': 'No statistics data available.',
    'statistics.minutesReadToday': 'Minutes Read Today',
    'statistics.dailyGoal': 'Daily Goal',
    'statistics.minutes': 'minutes',
    'statistics.goalMet': 'Goal Met!',
    'statistics.keepGoing': 'Keep Reading!',
  },
  es: {
    'common.loading': 'Cargando...',
    'bible.selectBook': 'Seleccionar Libro',
    'bible.oldTestament': 'Antiguo Testamento',
    'bible.newTestament': 'Nuevo Testamento',
    'bible.selectChapter': 'Seleccionar Capítulo',
    'bible.chapterNotFound': 'Capítulo no encontrado',
    'bible.tryAnotherChapter': 'Por favor, seleccione otro libro o capítulo.',
    'bible.verseSaved': '¡Versículo Guardado!',
     'profile.title': 'Perfil',
    'profile.achievements': 'Logros',
    'profile.stats': 'Estadísticas',
    'auth.signOut': 'Cerrar Sesión',
    'auth.createAccount': 'Crear Cuenta',
     'readingHistory.title': 'Historial de Lectura',
    'readingHistory.noReadings': 'No se encontró historial de lectura.',
    'readingHistory.date': 'Fecha',
    'readingHistory.book': 'Libro',
    'readingHistory.chapter': 'Capítulo',
    'readingHistory.verse': 'Versículo',
    'readingHistory.actions': 'Acciones',
    'readingHistory.view': 'Ver',
    'readingHistory.clearHistory': 'Borrar Historial',
    'readingHistory.clearConfirmation': '¿Está seguro de que desea borrar su historial de lectura?',
    'readingHistory.clearConfirmationYes': 'Sí, Borrar',
    'readingHistory.clearConfirmationNo': 'No, Cancelar',
    'savedVerses.title': 'Versículos Guardados',
    'savedVerses.noVerses': 'No se encontraron versículos guardados.',
    'savedVerses.book': 'Libro',
    'savedVerses.chapter': 'Capítulo',
    'savedVerses.verse': 'Versículo',
    'savedVerses.actions': 'Acciones',
    'savedVerses.read': 'Leer',
    'settings.title': 'Configuraciones',
    'settings.displayName': 'Nombre para Mostrar',
    'settings.nickname': 'Apodo',
    'settings.email': 'Correo Electrónico',
    'settings.preferredLanguage': 'Idioma Preferido',
    'settings.preferredBibleVersion': 'Versión de la Biblia Preferida',
    'settings.dailyReadingGoal': 'Meta de Lectura Diaria (minutos)',
    'settings.save': 'Guardar',
    'settings.cancel': 'Cancelar',
    'settings.success': '¡Configuraciones guardadas exitosamente!',
    'settings.error': 'Error al guardar las configuraciones.',
     'onboarding.welcome': '¡Bienvenido!',
    'onboarding.steps.one': 'Explora la Biblia',
    'onboarding.steps.two': 'Guarda tus versículos favoritos',
    'onboarding.steps.three': 'Sigue tu progreso',
    'onboarding.getStarted': 'Empezar',
    'onboarding.next': 'Siguiente',
    'onboarding.finish': 'Finalizar',
    'guestMode.title': 'Modo Invitado',
    'guestMode.description': 'Estás usando la aplicación en modo invitado. Crea una cuenta para guardar tu progreso y configuraciones.',
    'guestMode.createAccount': 'Crear Cuenta',
    'statistics.title': 'Estadísticas',
    'statistics.totalReadings': 'Lecturas Totales',
    'statistics.versesSaved': 'Versículos Guardados',
    'statistics.longestStreak': 'Racha de Lectura Más Larga',
    'statistics.currentStreak': 'Racha de Lectura Actual',
    'statistics.noData': 'No hay datos estadísticos disponibles.',
    'statistics.minutesReadToday': 'Minutos Leídos Hoy',
    'statistics.dailyGoal': 'Meta Diaria',
    'statistics.minutes': 'minutos',
    'statistics.goalMet': '¡Meta Alcanzada!',
    'statistics.keepGoing': '¡Sigue Leyendo!',
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<string>('pt');
  const [translations, setTranslations] = useState<Translations>(translationsData.pt);

  const loadTranslations = () => {
    if (translationsData[language]) {
      setTranslations(translationsData[language]);
    } else {
      console.warn(`No translations found for language: ${language}`);
      setTranslations(translationsData['en']);
      setLanguage('en');
    }
  };

  useEffect(() => {
    loadTranslations();
  }, [language]);

  const value: LanguageContextProps = {
    language,
    setLanguage,
    translations
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return {
    language: context.language,
    setLanguage: context.setLanguage,
    t: (key: string) => context.translations[key] || key,
  };
};
