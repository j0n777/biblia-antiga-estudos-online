
import { useState } from 'react';
import { Achievement } from '@/types/bible.types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Lock, Trophy, Star, Award, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AchievementListProps {
  achievements?: Achievement[];
  showCompleted?: boolean;
}

const AchievementList = ({ achievements = [], showCompleted = true }: AchievementListProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { key: 'all', label: 'Todas' },
    { key: 'book', label: 'Livros' },
    { key: 'streak', label: 'Sequência' },
    { key: 'milestone', label: 'Marcos' },
    { key: 'special', label: 'Especiais' }
  ];

  const filteredAchievements = achievements.filter(achievement => {
    const categoryMatch = selectedCategory === 'all' || achievement.category === selectedCategory;
    const completionMatch = showCompleted || !achievement.earned;
    return categoryMatch && completionMatch;
  });

  // Sort achievements: completed first, then by progress descending, then by points
  const sortedAchievements = filteredAchievements.sort((a, b) => {
    // First priority: completed achievements first
    if (a.earned && !b.earned) return -1;
    if (!a.earned && b.earned) return 1;
    
    // Second priority: for incomplete achievements, sort by progress percentage
    if (!a.earned && !b.earned) {
      const aProgress = a.total ? (a.progress || 0) / a.total : 0;
      const bProgress = b.total ? (b.progress || 0) / b.total : 0;
      if (aProgress !== bProgress) return bProgress - aProgress;
    }
    
    // Third priority: sort by points (higher first)
    return b.points - a.points;
  });

  const getProgressPercentage = (achievement: Achievement) => {
    if (!achievement.total || achievement.total === 0) return 0;
    return Math.min((achievement.progress || 0) / achievement.total * 100, 100);
  };

  const getAchievementIcon = (achievement: Achievement) => {
    if (achievement.earned) {
      return <Trophy className="h-4 w-4 text-ancient-gold" />;
    }
    return <Lock className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className="space-y-3">
      {/* Category Filter - Only show on ViewAllAchievements */}
      {achievements.length > 6 && (
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category.key}
              variant={selectedCategory === category.key ? "default" : "outline"}
              className={cn(
                "cursor-pointer transition-colors text-xs h-6 px-2",
                selectedCategory === category.key 
                  ? "bg-ancient-gold text-white hover:bg-ancient-gold/90" 
                  : "hover:bg-ancient-gold/10 border-ancient-gold/30"
              )}
              onClick={() => setSelectedCategory(category.key)}
            >
              {category.label}
            </Badge>
          ))}
        </div>
      )}

      {/* Achievements Grid */}
      <div className="space-y-2">
        {sortedAchievements.map((achievement) => (
          <Card 
            key={achievement.id} 
            className={cn(
              "p-3 transition-all duration-200 border-0 shadow-sm",
              achievement.earned 
                ? "bg-gradient-to-r from-ancient-gold/20 to-ancient-brown/10" 
                : "bg-gradient-to-r from-muted/40 to-muted/20"
            )}
          >
            <div className="flex items-center gap-3">
              {/* Icon */}
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                achievement.earned 
                  ? "bg-ancient-gold/30" 
                  : "bg-muted/60"
              )}>
                {getAchievementIcon(achievement)}
              </div>
              
              {/* Content */}
              <div className="flex-1 space-y-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <h3 className={cn(
                      "font-semibold text-sm truncate",
                      achievement.earned ? "text-ancient-brown" : "text-muted-foreground"
                    )}>
                      {achievement.title}
                    </h3>
                    {achievement.earned && (
                      <Star className="h-3 w-3 text-ancient-gold fill-ancient-gold flex-shrink-0" />
                    )}
                  </div>
                  
                  {/* Points Badge */}
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-xs font-medium flex-shrink-0 h-5 px-1.5",
                      achievement.earned 
                        ? "bg-ancient-gold/20 border-ancient-gold/40 text-ancient-gold" 
                        : "bg-muted/50 border-muted text-muted-foreground"
                    )}
                  >
                    <Award className="h-2 w-2 mr-0.5" />
                    {achievement.points}
                  </Badge>
                </div>
                
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {achievement.description}
                </p>
                
                {/* Progress Bar for incomplete achievements */}
                {!achievement.earned && achievement.progress !== undefined && achievement.total && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Target className="h-2.5 w-2.5" />
                        {achievement.progress || 0}/{achievement.total}
                      </span>
                      <span className="font-medium text-ancient-gold">
                        {Math.round(getProgressPercentage(achievement))}%
                      </span>
                    </div>
                    <Progress 
                      value={getProgressPercentage(achievement)} 
                      className="h-1.5 bg-muted/60"
                    />
                  </div>
                )}
                
                {/* Completion Date */}
                {achievement.earned && achievement.earned_at && (
                  <span className="text-xs text-muted-foreground">
                    Conquistado em {new Date(achievement.earned_at).toLocaleDateString('pt-BR')}
                  </span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {sortedAchievements.length === 0 && (
        <Card className="p-6 bg-gradient-to-r from-muted/30 to-muted/10">
          <div className="text-center text-muted-foreground">
            <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <h3 className="font-semibold mb-1 text-sm">Nenhuma conquista encontrada</h3>
            <p className="text-xs">Continue lendo para desbloquear conquistas!</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AchievementList;
