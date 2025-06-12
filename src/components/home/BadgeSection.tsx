
import BadgeProgress from '@/components/achievements/BadgeProgress';
import { Achievement } from '@/types/bible.types';

interface BadgeSectionProps {
  achievements: Achievement[];
}

const BadgeSection = ({ achievements }: BadgeSectionProps) => {
  // Convert achievements to badge format for BadgeProgress component
  const badges = achievements.slice(0, 3).map(achievement => ({
    id: achievement.id,
    name: achievement.title,
    description: achievement.description,
    progress: achievement.progress || 0,
    maxProgress: achievement.total || 1,
    unlocked: achievement.earned || false,
    icon: achievement.icon
  }));

  return (
    <div className="card" style={{
      backgroundColor: '#f8f5ea',
      border: '1px solid rgba(156, 142, 99, 0.25)',
      borderRadius: '0.75rem'
    }}>
      <BadgeProgress badges={badges} />
    </div>
  );
};

export default BadgeSection;
