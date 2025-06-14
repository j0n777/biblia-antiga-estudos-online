
import BadgeProgress from '@/components/achievements/BadgeProgress';
import { Achievement } from '@/types/bible.types';
import { Star, Award } from 'lucide-react';

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
    <div className="card relative overflow-hidden">
      <div className="absolute top-4 right-4">
        <Award className="h-6 w-6 text-purple-500 animate-pulse" />
      </div>
      <div className="absolute -top-6 -right-6 w-14 h-14 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-20"></div>
      <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-15"></div>
      <div className="absolute top-8 left-8">
        <Star className="h-4 w-4 text-yellow-400 animate-spin" style={{ animationDuration: '3s' }} />
      </div>
      <BadgeProgress badges={badges} />
    </div>
  );
};

export default BadgeSection;
