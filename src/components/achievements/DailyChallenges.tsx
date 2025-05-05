
import { useState, useEffect } from 'react';
import { getDailyChallenges, markChallengeComplete } from '@/services/ChallengeService';
import { Challenge } from '@/types/bible.types';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';
import { BookOpen, Star } from 'lucide-react';

const DailyChallenges = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  
  useEffect(() => {
    const loadChallenges = async () => {
      const dailyChallenges = await getDailyChallenges();
      setChallenges(dailyChallenges);
    };
    
    loadChallenges();
  }, []);
  
  const handleReadChallenge = (challenge: Challenge) => {
    // Navigate to the specific chapter for reading challenges
    if (challenge.type === 'read' && challenge.data?.book_id && challenge.data?.chapter) {
      navigate(`/read?book=${challenge.data.book_id}&chapter=${challenge.data.chapter}`);
    }
  };
  
  const handleCompleteChallenge = async (challengeId: string) => {
    const success = await markChallengeComplete(challengeId);
    
    if (success) {
      // Update challenges list to reflect completion
      setChallenges(challenges.map(challenge => 
        challenge.id === challengeId 
          ? { ...challenge, completed: true } 
          : challenge
      ));
      
      toast({
        title: t('challenges.completed'),
        description: t('challenges.xpEarned', { points: 10 }),
      });
    }
  };
  
  if (challenges.length === 0) {
    return (
      <div className="py-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-parchment-dark/20 rounded-full flex items-center justify-center">
            <Star className="h-8 w-8 text-ancient-gold/70" />
          </div>
        </div>
        <h3 className="text-lg font-medium mb-2">{t('challenges.noChallenges')}</h3>
        <p className="text-muted-foreground text-sm">{t('challenges.checkBackLater')}</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 p-1">
      {challenges.map((challenge) => (
        <div 
          key={challenge.id}
          className={`p-4 rounded-lg border transition-all duration-300 ${
            challenge.completed 
              ? 'bg-ancient-gold/10 border-ancient-gold/30' 
              : 'bg-parchment-light/50 border-parchment-dark/20 hover:border-ancient-gold/30'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 ${
              challenge.completed ? 'bg-ancient-gold/20' : 'bg-parchment/70'
            }`}>
              {challenge.icon || (
                challenge.type === 'read' ? <BookOpen size={28} className="text-ancient-brown" /> : <Star size={28} className="text-ancient-gold" />
              )}
            </div>
            
            <div className="flex-grow">
              <h3 className="text-lg font-oldstyle text-scripture-heading mb-1">
                {challenge.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                {challenge.description}
              </p>
              
              <div className="flex justify-between items-center">
                <div className="flex-grow max-w-[60%]">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progresso</span>
                    <span>
                      {challenge.progress || 0}/{challenge.target}
                    </span>
                  </div>
                  <Progress 
                    value={(challenge.progress || 0) * 100 / challenge.target} 
                    className={`h-2 ${challenge.completed ? 'bg-ancient-gold/30' : 'bg-parchment-dark/20'}`}
                    indicatorClassName={`${challenge.completed ? 'bg-ancient-gold' : 'bg-ancient-brown'}`}
                  />
                </div>
                
                <div className="text-right ml-4">
                  <span className="block font-semibold text-ancient-gold">
                    {challenge.points} XP
                  </span>
                  {challenge.type === 'read' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className={`mt-1 text-sm ${
                        challenge.completed 
                          ? 'bg-ancient-gold/10 text-ancient-gold border-ancient-gold/30' 
                          : 'bg-parchment border-parchment-dark/30 hover:border-ancient-gold/50'
                      }`}
                      onClick={() => handleReadChallenge(challenge)}
                    >
                      {t('challenges.readNow')}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DailyChallenges;
