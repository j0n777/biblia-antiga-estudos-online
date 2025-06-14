
import StreakDisplay from '@/components/achievements/StreakDisplay';
import { Flame, Trophy } from 'lucide-react';

interface StreakSectionProps {
  currentStreak: number;
  longestStreak: number;
}

const StreakSection = ({ currentStreak, longestStreak }: StreakSectionProps) => {
  return (
    <div className="card relative overflow-hidden">
      <div className="absolute top-4 right-4">
        <Flame className="h-6 w-6 text-orange-500 animate-bounce" />
      </div>
      <div className="absolute -top-8 -left-8 w-16 h-16 bg-gradient-to-br from-orange-200 to-red-200 rounded-full opacity-20"></div>
      <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full opacity-15"></div>
      <StreakDisplay currentStreak={currentStreak} longestStreak={longestStreak} />
    </div>
  );
};

export default StreakSection;
