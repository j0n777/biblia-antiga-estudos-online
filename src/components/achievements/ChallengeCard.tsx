
import { Clock, CheckCircle } from 'lucide-react';
import { DailyChallenge } from '@/types/bible.types';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTimeRemaining } from '@/utils/timeUtils';

interface ChallengeCardProps {
  challenge: DailyChallenge;
  onComplete: (challengeId: string) => void;
}

const ChallengeCard = ({ challenge, onComplete }: ChallengeCardProps) => {
  const { t } = useLanguage();
  const progressValue = challenge.progress || 0;

  return (
    <Card className="p-4 rounded-xl overflow-hidden border-parchment-dark/20 bg-parchment-light/60">
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
            onClick={() => onComplete(challenge.id)}
          >
            {t('challenges.claim') || 'Reivindicar'}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default ChallengeCard;
