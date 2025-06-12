
import { useState, useEffect } from 'react';
import { getDailyChallenges, markChallengeComplete } from '@/services/ChallengeService';
import { DailyChallenge, UserProfile } from '@/types/bible.types';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { getUserProfile } from '@/services/ProfileService';
import ReadingStreak from '@/components/achievements/ReadingStreak';
import ChallengesList from './ChallengesList';
import ChallengesLoading from './ChallengesLoading';

const DailyChallenges = () => {
  const [challenges, setChallenges] = useState<DailyChallenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const { t } = useLanguage();
  
  // Load challenges and user profile
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [challengesData, userProfile] = await Promise.all([
          getDailyChallenges(),
          getUserProfile()
        ]);
        
        setChallenges(challengesData);
        setProfile(userProfile);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Mark challenge as complete
  const completeChallenge = async (challengeId: string) => {
    try {
      const success = await markChallengeComplete(challengeId);
      
      if (success) {
        // Update local state
        setChallenges(prev => prev.map(challenge => 
          challenge.id === challengeId
            ? { ...challenge, is_completed: true }
            : challenge
        ));
        
        toast({
          title: t('challenges.completedTitle'),
          description: t('challenges.completedMessage'),
        });
      }
    } catch (error) {
      console.error('Error completing challenge:', error);
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: t('challenges.errorCompleting'),
      });
    }
  };
  
  if (isLoading) {
    return <ChallengesLoading />;
  }
  
  return (
    <div className="space-y-6">
      {/* Reading Streak information */}
      {profile && (
        <ReadingStreak 
          currentStreak={profile.streak_count} 
          longestStreak={profile.streak_record} 
          goalProgress={profile.daily_reading_goal ? 
            Math.min(100, Math.round((profile.streak_count / profile.daily_reading_goal) * 100)) : 
            0
          } 
        />
      )}

      {/* Daily Challenges */}
      <div className="space-y-4">
        <h3 className="font-medium text-lg text-scripture-heading">{t('challenges.dailyChallenges') || 'Desafios Diários'}</h3>
        <ChallengesList 
          challenges={challenges} 
          onCompleteChallenge={completeChallenge} 
        />
      </div>
    </div>
  );
};

export default DailyChallenges;
