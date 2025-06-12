
import StreakDisplay from '@/components/achievements/StreakDisplay';

interface StreakSectionProps {
  currentStreak: number;
  longestStreak: number;
}

const StreakSection = ({ currentStreak, longestStreak }: StreakSectionProps) => {
  return (
    <div className="card" style={{
      backgroundColor: '#f8f5ea',
      border: '1px solid rgba(156, 142, 99, 0.25)',
      borderRadius: '0.75rem'
    }}>
      <StreakDisplay currentStreak={currentStreak} longestStreak={longestStreak} />
    </div>
  );
};

export default StreakSection;
