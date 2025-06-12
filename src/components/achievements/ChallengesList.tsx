
import { Trophy } from 'lucide-react';
import { DailyChallenge } from '@/types/bible.types';
import { useLanguage } from '@/contexts/LanguageContext';
import ChallengeCard from './ChallengeCard';

interface ChallengesListProps {
  challenges: DailyChallenge[];
  onCompleteChallenge: (challengeId: string) => void;
}

const ChallengesList = ({ challenges, onCompleteChallenge }: ChallengesListProps) => {
  const { t } = useLanguage();

  if (challenges.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center p-4 rounded-full bg-parchment-dark/20 mb-4">
          <Trophy className="h-6 w-6 text-ancient-gold" />
        </div>
        <p className="text-lg font-medium text-scripture-text">{t('challenges.noChallenges')}</p>
        <p className="text-sm text-muted-foreground">{t('challenges.checkBack')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {challenges.map((challenge) => (
        <ChallengeCard
          key={challenge.id}
          challenge={challenge}
          onComplete={onCompleteChallenge}
        />
      ))}
    </div>
  );
};

export default ChallengesList;
