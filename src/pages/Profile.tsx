
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AchievementList from '@/components/achievements/AchievementList';
import SettingsDialog from '@/components/profile/SettingsDialog';
import HistoryDialog from '@/components/profile/HistoryDialog';
import OnboardingWizard from '@/components/onboarding/OnboardingWizard';
import { getUserAchievements } from '@/services/AchievementService';
import { getUserProfile } from '@/services/ProfileService';
import { getSavedVerses } from '@/services/VersesService';
import { getLastThreeReadings } from '@/services/reading';
import { UserProfile, SavedVerse, ReadingHistory } from '@/types/bible.types';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { getBibleBooks } from '../services/BibleDataService';
import UserHeader from '@/components/profile/UserHeader';
import RecentReadingSection from '@/components/profile/RecentReadingSection';
import SavedVersesSection from '@/components/profile/SavedVersesSection';
import StatisticsTab from '@/components/profile/StatisticsTab';
import GuestModeAlert from '@/components/profile/GuestModeAlert';
import { User } from 'lucide-react';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('conquistas');
  const [achievements, setAchievements] = useState([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [savedVerses, setSavedVerses] = useState<SavedVerse[]>([]);
  const [bookNames, setBookNames] = useState<Record<string, string>>({});
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [recentReadings, setRecentReadings] = useState<ReadingHistory[]>([]);
  
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  
  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
      setIsLoading(false);
    };
    
    checkAuth();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });
    
    return () => subscription.unsubscribe();
  }, []);
  
  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      const userAchievements = await getUserAchievements();
      const userProfile = await getUserProfile();
      const userSavedVerses = await getSavedVerses();
      const lastReadings = await getLastThreeReadings();
      
      // Carregar somente 3 versículos salvos recentes para exibição
      const recentVerses = userSavedVerses.slice(0, 3);
      
      // Obter nomes dos livros
      const books = await getBibleBooks();
      
      // Create book name lookup
      const bookNameLookup: Record<string, string> = {};
      books.forEach(book => {
        bookNameLookup[book.book_id] = book.name;
      });
      
      setAchievements(userAchievements);
      setProfile(userProfile);
      setSavedVerses(recentVerses);
      setRecentReadings(lastReadings);
      setBookNames(bookNameLookup);
      
      // Check if onboarding should be shown
      if (isAuthenticated && userProfile && !userProfile.has_completed_onboarding) {
        setShowOnboarding(true);
      }
    };
    
    if (isLoading === false) {
      fetchUserData();
    }
  }, [isLoading, language, isAuthenticated]);
  
  const handleProfileUpdate = async () => {
    const userProfile = await getUserProfile();
    setProfile(userProfile);
    
    // Check if onboarding was just completed
    if (userProfile?.has_completed_onboarding) {
      setShowOnboarding(false);
    }
  };
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('guestProfile');
    navigate('/');
  };

  const handleCreateAccount = () => {
    navigate('/auth');
  };
  
  const handleReadVerse = (bookId: string, chapterNumber: number, verseNumber: number) => {
    navigate(`/read?book=${bookId}&chapter=${chapterNumber}&verse=${verseNumber}`);
  };
  
  const handleOpenChapter = (bookId: string, chapter: number) => {
    navigate(`/read?book=${bookId}&chapter=${chapter}`);
  };
  
  // Loading state
  if (isLoading) {
    return (
      <PageLayout>
        <div className="page-container">
          <div className="h-96 flex items-center justify-center">
            <p>{t('common.loading')}</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Header with consistent styling */}
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User size={24} className="text-ancient-gold" />
            <h1 className="text-2xl font-oldstyle text-scripture-heading">{t('profile.title') || "Perfil"}</h1>
          </div>
          <div className="flex gap-2">
            {isAuthenticated && profile && (
              <Button 
                variant="outline" 
                onClick={() => setShowOnboarding(true)}
                className="text-sm rounded-xl"
              >
                Configurar Onboarding
              </Button>
            )}
            <SettingsDialog profile={profile} onProfileUpdate={handleProfileUpdate} />
          </div>
        </div>
      </div>
      
      {/* Content in styled box with consistent margins */}
      <div className="page-content">
        <div className="content-box">
          {!isAuthenticated && <GuestModeAlert onCreateAccount={handleCreateAccount} />}
          
          <UserHeader 
            profile={profile}
            isAuthenticated={isAuthenticated}
            onOpenHistoryDialog={() => setShowHistoryDialog(true)}
            onCreateAccount={handleCreateAccount}
          />
          
          <RecentReadingSection 
            recentReadings={recentReadings}
            bookNames={bookNames}
            onViewAllHistory={() => setShowHistoryDialog(true)}
            onOpenChapter={handleOpenChapter}
          />
          
          <SavedVersesSection 
            savedVerses={savedVerses}
            bookNames={bookNames}
            onViewAllVerses={() => setShowHistoryDialog(true)}
            onReadVerse={handleReadVerse}
          />
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList className="w-full bg-parchment-light rounded-xl">
              <TabsTrigger value="conquistas" className="flex-1 rounded-xl">{t('profile.achievements') || "Conquistas"}</TabsTrigger>
              <TabsTrigger value="estatisticas" className="flex-1 rounded-xl">{t('profile.stats') || "Estatísticas"}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="conquistas" className="mt-4 space-y-4">
              <AchievementList />
            </TabsContent>
            
            <TabsContent value="estatisticas" className="mt-4 space-y-4">
              <StatisticsTab />
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 flex justify-center">
            {isAuthenticated ? (
              <Button variant="outline" className="rounded-xl" onClick={handleSignOut}>
                {t('auth.signOut') || "Sair"}
              </Button>
            ) : (
              <Button 
                className="bg-ancient-gold text-white hover:bg-ancient-gold/90 rounded-xl"
                onClick={handleCreateAccount}
              >
                {t('auth.createAccount') || "Criar Conta"}
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* History Dialog */}
      <HistoryDialog 
        open={showHistoryDialog}
        onOpenChange={setShowHistoryDialog}
      />
      
      {/* Onboarding Wizard */}
      <OnboardingWizard
        open={showOnboarding}
        onOpenChange={setShowOnboarding}
        profile={profile}
        onProfileUpdate={handleProfileUpdate}
      />
    </PageLayout>
  );
};

export default ProfilePage;
