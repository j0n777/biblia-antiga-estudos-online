
import { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Users, Medal } from 'lucide-react';
import { getUserProfile } from '@/services';
import { UserProfile } from '@/types/bible.types';
import { useLanguage } from '@/contexts/LanguageContext';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import CommunityDesktopNav from '@/components/community/CommunityDesktopNav';
import CommunityMobileNav from '@/components/community/CommunityMobileNav';
import CommunityContent from '@/components/community/CommunityContent';

const CommunityPage = () => {
  const [activeTab, setActiveTab] = useState<'challenges' | 'leaderboard' | 'prayers'>('challenges');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      const userProfile = await getUserProfile();
      setProfile(userProfile);
      setIsAuthenticated(userProfile?.id.startsWith('guest-') ? false : true);
      setIsLoading(false);
    };
    fetchProfile();
  }, []);

  const handleCreateAccount = () => {
    navigate("/auth");
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="page-header">
          <div className="flex items-center gap-2">
            <Users size={24} className="text-ancient-gold" />
            <h1 className="text-2xl font-oldstyle text-scripture-heading">Comunidade</h1>
          </div>
        </div>
        <div className="page-content">
          <div className="h-96 flex items-center justify-center" style={{ backgroundColor: '#f8f5ea', border: '1px solid rgba(156, 142, 99, 0.25)', borderRadius: '0.75rem', boxShadow: '0 2px 8px rgba(92, 63, 23, 0.06)', padding: '1.5rem', marginBottom: '1rem' }}>
            <div className="w-8 h-8 border-t-2 border-ancient-gold rounded-full animate-spin mb-2"></div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="page-header">
        <div className="flex items-center gap-2 py-[12px] px-[16px]">
          <Users size={24} className="text-ancient-gold" />
          <h1 className="text-2xl font-oldstyle text-scripture-heading">Comunidade</h1>
        </div>
      </div>

      <div className="page-content space-y-4">
        {!isAuthenticated && (
          <Alert className="rounded-xl" style={{ backgroundColor: '#f8f5ea', border: '1px solid rgba(156, 142, 99, 0.4)' }}>
            <div className="flex items-start">
              <Medal className="h-5 w-5 text-ancient-gold mt-1" />
              <div className="ml-3">
                <AlertTitle className="text-ancient-brown text-base">Modo Visitante</AlertTitle>
                <AlertDescription className="text-sm">
                  Você está navegando como visitante. Crie uma conta para salvar seu progresso, conquistas e participar na comunidade.
                  <div className="mt-2">
                    <Button
                      onClick={handleCreateAccount}
                      className="bg-ancient-gold hover:bg-ancient-gold/90 text-white"
                    >
                      Criar Conta
                    </Button>
                  </div>
                </AlertDescription>
              </div>
            </div>
          </Alert>
        )}

        <div className="grid md:grid-cols-[250px_1fr] gap-6" style={{ backgroundColor: '#f8f5ea', border: '1px solid rgba(156, 142, 99, 0.25)', borderRadius: '0.75rem', boxShadow: '0 2px 8px rgba(92, 63, 23, 0.06)', padding: '1.5rem' }}>
          <CommunityDesktopNav activeTab={activeTab} onTabChange={setActiveTab} />
          <CommunityMobileNav activeTab={activeTab} onTabChange={setActiveTab} />
          <CommunityContent activeTab={activeTab} profile={profile} />
        </div>
      </div>
    </PageLayout>
  );
};

export default CommunityPage;
