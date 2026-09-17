import { useState, useEffect, Component, ReactNode } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/Index';
import ReadPage from './pages/Read';
import SearchPage from './pages/Search';
import ProfilePage from './pages/Profile';
import AuthPage from './pages/Auth';
import CommunityPage from './pages/Community';
import AdminImportPage from './pages/AdminImport';
import NotFoundPage from './pages/NotFound';
import { Toaster } from '@/components/ui/toaster';
import { supabase } from '@/integrations/supabase/client';
import OnboardingWizard from './components/onboarding/OnboardingWizard';
import { getUserProfile } from './services/ProfileService';
import { UserProfile } from './types/bible.types';

// ---- Error Boundary global ----
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen p-6 text-center bg-bible-background">
          <div className="text-5xl mb-4">📖</div>
          <h1 className="text-xl font-semibold mb-2 text-bible-title">Algo inesperado aconteceu</h1>
          <p className="text-sm text-gray-500 mb-4">
            {this.state.error?.message || 'Erro desconhecido'}
          </p>
          <button
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            onClick={() => window.location.reload()}
          >
            Recarregar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Verifica sessão ativa antes de tentar carregar perfil
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          const profile = await getUserProfile();
          setUserProfile(profile);
          // Mostra onboarding apenas para usuários autenticados sem perfil completo
          if (!profile || !profile.has_completed_onboarding) {
            setShowOnboarding(true);
          }
        }
        // Usuário não autenticado → carrega normalmente sem perfil
      } catch (err) {
        console.error('[App] Erro durante inicialização:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();

    // Escuta mudanças de autenticação em tempo real
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const profile = await getUserProfile();
          setUserProfile(profile);
          if (!profile || !profile.has_completed_onboarding) {
            setShowOnboarding(true);
          }
        } else if (event === 'SIGNED_OUT') {
          setUserProfile(null);
          setShowOnboarding(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleProfileUpdate = async () => {
    const profile = await getUserProfile();
    setUserProfile(profile);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-bible-background gap-3">
        <div className="text-4xl animate-pulse">📖</div>
        <p className="text-bible-title font-serif text-lg">Carregando...</p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/read" element={<ReadPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/admin-import" element={<AdminImportPage />} />
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
    </ErrorBoundary>
  );
}

export default App;
