
import { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Trophy, Award, Users, Medal } from 'lucide-react';
import DailyChallenges from '@/components/achievements/DailyChallenges';
import Leaderboard from '@/components/achievements/Leaderboard';
import { getUserProfile } from '@/services';
import { UserProfile } from '@/types/bible.types';
import { useLanguage } from '@/contexts/LanguageContext';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const RankingPage = () => {
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
        <div className="py-6 px-2">
          <div className="h-96 flex items-center justify-center">
            <div className="w-8 h-8 border-t-2 border-ancient-gold rounded-full animate-spin mb-2"></div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="py-6 px-2">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Trophy size={24} className="text-ancient-gold" />
            <h1 className="text-2xl font-oldstyle text-scripture-heading">Ranking</h1>
          </div>
        </div>

        {!isAuthenticated && (
          <Alert className="mb-6 bg-ancient-gold/10 border-ancient-gold/40 rounded-xl">
            <div className="flex items-start">
              <Medal className="h-5 w-5 text-ancient-gold mt-1" />
              <div className="ml-3">
                <AlertTitle className="text-ancient-brown text-base">Modo Visitante</AlertTitle>
                <AlertDescription className="text-sm">
                  Você está navegando como visitante. Crie uma conta para salvar seu progresso, conquistas e participar no ranking.
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

        <div className="space-y-6">
          {/* Daily Challenges Section */}
          <div className="animate-slide-up">
            <div className="flex items-center gap-2 mb-4">
              <Award size={20} className="text-ancient-gold" />
              <h2 className="text-xl font-oldstyle text-scripture-heading">Desafios Diários</h2>
            </div>
            <div className="parchment-container rounded-xl">
              <DailyChallenges />
            </div>
          </div>
          
          {/* Leaderboard Section */}
          <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center gap-2 mb-4">
              <Users size={20} className="text-ancient-gold" />
              <h2 className="text-xl font-oldstyle text-scripture-heading">Classificação</h2>
            </div>
            <div className="parchment-container rounded-xl p-4">
              <Leaderboard />
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default RankingPage;
