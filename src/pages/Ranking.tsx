
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

const RankingPage = () => {
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
            <h1 className="text-2xl font-oldstyle text-scripture-heading">{t('nav.ranking')}</h1>
          </div>
        </div>

        {!isAuthenticated && (
          <Alert className="mb-6 bg-ancient-gold/10 border-ancient-gold/40 rounded-xl">
            <div className="flex items-start">
              <Medal className="h-5 w-5 text-ancient-gold mt-1" />
              <div className="ml-3">
                <AlertTitle className="text-ancient-brown text-base">{t('ranking.guestModeTitle')}</AlertTitle>
                <AlertDescription className="text-sm">
                  {t('ranking.guestModeDescription')}
                  <div className="mt-2">
                    <Button
                      onClick={handleCreateAccount}
                      className="bg-ancient-gold hover:bg-ancient-gold/90 text-white"
                    >
                      {t('auth.createAccount')}
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
              <h2 className="text-xl font-oldstyle text-scripture-heading">{t('ranking.challenges')}</h2>
            </div>
            <div className="parchment-container rounded-xl">
              <DailyChallenges />
            </div>
          </div>
          
          {/* Leaderboard Section */}
          <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center gap-2 mb-4">
              <Users size={20} className="text-ancient-gold" />
              <h2 className="text-xl font-oldstyle text-scripture-heading">{t('ranking.leaderboard')}</h2>
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
