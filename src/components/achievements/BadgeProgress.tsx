
import { Badge } from "@/components/ui/badge";

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
  // Display just the most recent or in-progress badges
  const displayBadges = badges.slice(0, 3);
  
  return (
    <div className="parchment-container space-y-4">
      <h3 className="font-oldstyle text-lg text-scripture-heading">Conquistas Recentes</h3>
      
      <div className="grid grid-cols-3 gap-4">
        {displayBadges.map((badge) => (
          <div key={badge.id} className="flex flex-col items-center">
            <div 
              className={`achievement-badge ${
                badge.unlocked ? 'bg-ancient-gold' : 'bg-muted text-muted-foreground opacity-50'
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
          className="bg-transparent border-parchment-darker/30 text-scripture-heading hover:text-ancient-gold"
          asChild
        >
          <a href="/profile">Ver todas</a>
        </Badge>
      </div>
    </div>
  );
};

export default BadgeProgress;
