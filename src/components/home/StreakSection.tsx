
import StreakDisplay from '@/components/achievements/StreakDisplay';

interface StreakSectionProps {
  currentStreak: number;
  longestStreak: number;
}

const StreakSection = ({ currentStreak, longestStreak }: StreakSectionProps) => {
  return (
    <div className="card">
      <StreakDisplay currentStreak={currentStreak} longestStreak={longestStreak} />
    </div>
  );
};

export default StreakSection;
