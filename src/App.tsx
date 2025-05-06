
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "next-themes";
import HomePage from './pages/Index';
import ReadPage from './pages/Read';
import SearchPage from './pages/Search';
import ProfilePage from './pages/Profile';
import AuthPage from './pages/Auth';
import CommunityPage from './pages/Community';
import NotFoundPage from './pages/NotFound';
import { Toaster } from '@/components/ui/toaster';
import { supabase } from '@/integrations/supabase/client';
import { importInitialVersions } from './services/BibleImportService';
import OnboardingWizard from './components/onboarding/OnboardingWizard';
import { getUserProfile, updateUserProfile } from './services/ProfileService';
import { UserProfile } from './types/bible.types';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Verificar se já temos dados bíblicos
        const { data: versions, error } = await supabase
          .from('bible_versions')
          .select('id')
          .limit(1);
          
        if (error) {
          console.error('Error checking Bible versions:', error);
        } else if (!versions?.length) {
          console.log('No Bible versions found, initializing data...');
          await importInitialVersions();
        }
        
        // Carregar perfil do usuário
        const profile = await getUserProfile();
        setUserProfile(profile);
        
        // Verificar se é a primeira utilização
        if (profile && !profile.has_completed_onboarding) {
          setShowOnboarding(true);
        }
      } catch (err) {
        console.error('Error during initialization:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeApp();
  }, []);
  
  const handleProfileUpdate = async () => {
    const profile = await getUserProfile();
    setUserProfile(profile);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg">Carregando...</p>
      </div>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/read" element={<ReadPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      
      {showOnboarding && (
        <OnboardingWizard 
          open={showOnboarding} 
          onOpenChange={setShowOnboarding}
          profile={userProfile}
          onProfileUpdate={handleProfileUpdate}
        />
      )}
      
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
