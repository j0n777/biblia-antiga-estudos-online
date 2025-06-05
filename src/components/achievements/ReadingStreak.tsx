
import StreakDisplay from './StreakDisplay';

type ReadingStreakProps = {
  currentStreak: number;
  longestStreak: number;
  goalProgress: number;
};

const ReadingStreak = ({ currentStreak, longestStreak, goalProgress }: ReadingStreakProps) => {
  return (
    <StreakDisplay 
      currentStreak={currentStreak}
      longestStreak={longestStreak}
    />
  );
};

export default ReadingStreak;
