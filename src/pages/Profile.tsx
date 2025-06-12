
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileContent from '@/components/profile/ProfileContent';
import ProfileTabs from '@/components/profile/ProfileTabs';
import ProfileActions from '@/components/profile/ProfileActions';
import HistoryDialog from '@/components/profile/HistoryDialog';
import OnboardingWizard from '@/components/onboarding/OnboardingWizard';
import { getUserAchievements } from '@/services/AchievementService';
import { getUserProfile } from '@/services/ProfileService';
import { getSavedVerses } from '@/services/VersesService';
import { getLastThreeReadings } from '@/services/reading';
import { UserProfile, SavedVerse, ReadingHistory, Achievement } from '@/types/bible.types';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { getBibleBooks } from '../services/BibleDataService';
import { User } from 'lucide-react';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('conquistas');
  const [achievements, setAchievements] = useState<Achievement[]>([]);
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
        <div className="page-header">
          <div className="flex items-center gap-2">
            <User size={24} className="text-ancient-gold" />
            <h1 className="text-2xl font-oldstyle text-scripture-heading">Perfil</h1>
          </div>
        </div>
        <div className="page-content">
          <div className="content-box" style={{ backgroundColor: '#f8f5ea', border: '1px solid rgba(156, 142, 99, 0.25)', borderRadius: '0.75rem', boxShadow: '0 2px 8px rgba(92, 63, 23, 0.06)' }}>
            <div className="h-96 flex items-center justify-center">
              <p>{t('common.loading')}</p>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <ProfileHeader
        profile={profile}
        isAuthenticated={isAuthenticated}
        onProfileUpdate={handleProfileUpdate}
        onShowOnboarding={() => setShowOnboarding(true)}
      />
      
      <div className="page-content">
        <div className="content-box" style={{ backgroundColor: '#f8f5ea', border: '1px solid rgba(156, 142, 99, 0.25)', borderRadius: '0.75rem', boxShadow: '0 2px 8px rgba(92, 63, 23, 0.06)' }}>
          <ProfileContent
            profile={profile}
            isAuthenticated={isAuthenticated}
            savedVerses={savedVerses}
            recentReadings={recentReadings}
            bookNames={bookNames}
            onOpenHistoryDialog={() => setShowHistoryDialog(true)}
            onCreateAccount={handleCreateAccount}
            onReadVerse={handleReadVerse}
            onOpenChapter={handleOpenChapter}
          />
          
          <ProfileTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            achievements={achievements}
          />
          
          <ProfileActions
            isAuthenticated={isAuthenticated}
            onSignOut={handleSignOut}
            onCreateAccount={handleCreateAccount}
          />
        </div>
      </div>
      
      <HistoryDialog 
        open={showHistoryDialog}
        onOpenChange={setShowHistoryDialog}
      />
      
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
