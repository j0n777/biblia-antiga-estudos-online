
import { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Medal, Award, Users } from 'lucide-react';
import ReadingStreak from '@/components/achievements/ReadingStreak';
import DailyChallenges from '@/components/achievements/DailyChallenges';
import Leaderboard from '@/components/achievements/Leaderboard';
import { getUserProfile } from '@/services/AchievementService';
import { UserProfile } from '@/types/bible.types';
import { useLanguage } from '@/contexts/LanguageContext';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

const RankingPage = () => {
  const [activeTab, setActiveTab] = useState('desafios');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  const { t } = useLanguage();
  
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
    window.location.href = "/auth";
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="py-6">
          <div className="h-96 flex items-center justify-center">
            <p>{t('common.loading')}</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Trophy size={24} className="text-ancient-gold" />
            <h1 className="text-2xl font-oldstyle text-scripture-heading">{t('ranking.title') || 'Ranking'}</h1>
          </div>
        </div>

        {!isAuthenticated && (
          <Alert className="mb-6 bg-ancient-gold/10 border-ancient-gold/40">
            <div className="flex items-start">
              <Medal className="h-5 w-5 text-ancient-gold mt-1" />
              <div className="ml-3">
                <AlertTitle className="text-ancient-brown text-base">{t('ranking.guestModeTitle') || 'Modo Visitante'}</AlertTitle>
                <AlertDescription className="text-sm">
                  {t('ranking.guestModeDescription') || 'Crie uma conta para salvar seu progresso e participar do ranking de leitores.'}
                  <div className="mt-2">
                    <Button
                      onClick={handleCreateAccount}
                      className="bg-ancient-gold hover:bg-ancient-gold/90 text-white"
                    >
                      {t('auth.createAccount') || 'Criar Conta'}
                    </Button>
                  </div>
                </AlertDescription>
              </div>
            </div>
          </Alert>
        )}

        <ReadingStreak
          currentStreak={profile?.streak_count || 0}
          longestStreak={profile?.streak_count || 0}
          goalProgress={75}
        />

        <div className="mt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full bg-parchment-light">
              <TabsTrigger value="desafios" className="flex-1">
                <Award size={16} className="mr-2" />
                {t('ranking.challenges') || 'Desafios'}
              </TabsTrigger>
              <TabsTrigger value="ranking" className="flex-1">
                <Users size={16} className="mr-2" />
                {t('ranking.leaderboard') || 'Classificação'}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="desafios" className="mt-4">
              <DailyChallenges />
            </TabsContent>

            <TabsContent value="ranking" className="mt-4">
              <Leaderboard />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageLayout>
  );
};

export default RankingPage;
