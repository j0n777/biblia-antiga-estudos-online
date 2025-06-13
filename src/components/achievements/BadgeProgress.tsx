
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';

type BadgeType = {
  id: string;
  name: string;
  description: string;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  icon: string;
};

type BadgeProgressProps = {
  badges: BadgeType[];
};

const BadgeProgress = ({ badges }: BadgeProgressProps) => {
  const navigate = useNavigate();
  
  // Show completed badges first, then in-progress ones
  const sortedBadges = badges.sort((a, b) => {
    if (a.unlocked && !b.unlocked) return -1;
    if (!a.unlocked && b.unlocked) return 1;
    return b.progress - a.progress;
  });
  
  // Display up to 6 badges instead of just 3
  const displayBadges = sortedBadges.slice(0, 6);
  
  return (
    <div className="card space-y-4 p-4">
      <h3 className="font-oldstyle text-lg text-scripture-heading">Conquistas Recentes</h3>
      
      <div className="grid grid-cols-3 gap-4">
        {displayBadges.map((badge) => (
          <div key={badge.id} className="flex flex-col items-center">
            <div 
              className={`w-12 h-12 rounded-full flex items-center justify-center text-lg transition-colors ${
                badge.unlocked ? 'bg-ancient-gold text-white' : 'bg-muted text-muted-foreground opacity-50'
              }`}
            >
              {badge.icon}
            </div>
            <span className="text-xs mt-1 text-center font-medium">{badge.name}</span>
            {!badge.unlocked && (
              <span className="text-xs text-muted-foreground text-center">
                {badge.progress}/{badge.maxProgress}
              </span>
            )}
          </div>
        ))}
      </div>
      
      <div className="flex justify-center">
        <Badge 
          variant="outline" 
          className="bg-transparent border-parchment-darker/30 text-scripture-heading hover:text-ancient-gold cursor-pointer"
          onClick={() => navigate('/profile')}
        >
          Ver todas
        </Badge>
      </div>
    </div>
  );
};

export default BadgeProgress;
