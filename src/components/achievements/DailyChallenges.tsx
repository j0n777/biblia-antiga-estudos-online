
import { useState, useEffect } from 'react';
import { Trophy, Clock, CheckCircle } from 'lucide-react';
import { getDailyChallenges, markChallengeComplete } from '@/services/ChallengeService';
import { Challenge, DailyChallenge, UserProfile } from '@/types/bible.types';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { getUserProfile } from '@/services/ProfileService';
import ReadingStreak from '@/components/achievements/ReadingStreak';

// Helper function to get the time remaining
const getTimeRemaining = (expiryTime: string): string => {
  const now = new Date();
  const expiry = new Date(expiryTime);
  const diffMs = expiry.getTime() - now.getTime();
  
  if (diffMs <= 0) return 'Expired';
  
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}m`;
};

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
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full mb-4" />
        {[1, 2].map(i => (
          <Card key={i} className="p-4 rounded-xl">
            <div className="flex justify-between items-start mb-3">
              <div className="flex gap-2 items-center">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div>
                  <Skeleton className="h-5 w-28 mb-2" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </div>
              <Skeleton className="h-8 w-20" />
            </div>
            <Skeleton className="h-2 w-full mt-3" />
          </Card>
        ))}
      </div>
    );
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
        
        {challenges.length === 0 ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center p-4 rounded-full bg-parchment-dark/20 mb-4">
              <Trophy className="h-6 w-6 text-ancient-gold" />
            </div>
            <p className="text-lg font-medium text-scripture-text">{t('challenges.noChallenges')}</p>
            <p className="text-sm text-muted-foreground">{t('challenges.checkBack')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {challenges.map((challenge) => {
              const progressValue = challenge.progress || 0;
              
              return (
                <Card key={challenge.id} className="p-4 rounded-xl overflow-hidden border-parchment-dark/20 bg-parchment-light/60">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex gap-3 items-start">
                      <div className="mt-1 bg-parchment-dark/20 w-10 h-10 rounded-full flex items-center justify-center text-ancient-gold">
                        {challenge.icon || "📖"}
                      </div>
                      <div>
                        <h3 className="font-medium text-ancient-brown mb-1">
                          {challenge.title}
                        </h3>
                        <p className="text-sm text-scripture-text/80">
                          {challenge.description}
                        </p>
                      </div>
                    </div>
                    
                    {challenge.is_completed ? (
                      <div className="flex items-center text-ancient-gold text-sm">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        <span>{t('challenges.completed') || 'Concluído'}</span>
                      </div>
                    ) : challenge.expires_at ? (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{getTimeRemaining(challenge.expires_at)}</span>
                      </div>
                    ) : null}
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-ancient-brown mb-1">
                      <span>{progressValue}% {t('challenges.complete') || 'concluído'}</span>
                      <span>{challenge.points} XP</span>
                    </div>
                    <Progress 
                      value={progressValue} 
                      className="h-2 bg-parchment-dark/20" 
                    />
                    
                    {!challenge.is_completed && progressValue >= 100 && (
                      <Button 
                        variant="outline"
                        size="sm"
                        className="w-full mt-3 text-sm bg-ancient-gold/20 border-ancient-gold/30 text-ancient-brown hover:bg-ancient-gold/30"
                        onClick={() => completeChallenge(challenge.id)}
                      >
                        {t('challenges.claim') || 'Reivindicar'}
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyChallenges;
