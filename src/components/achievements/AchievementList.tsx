
import { useState } from 'react';
import { Achievement } from '@/types/bible.types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Lock, Trophy, Star, Award } from 'lucide-react';
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

  const getProgressPercentage = (achievement: Achievement) => {
    if (!achievement.total || achievement.total === 0) return 0;
    return Math.min((achievement.progress || 0) / achievement.total * 100, 100);
  };

  const getAchievementIcon = (achievement: Achievement) => {
    if (achievement.earned) {
      return achievement.icon || <Trophy className="h-5 w-5 text-ancient-gold" />;
    }
    return <Lock className="h-5 w-5 text-muted-foreground" />;
  };

  return (
    <div className="space-y-4">
      {/* Category Filter - Only show on ViewAllAchievements */}
      {achievements.length > 6 && (
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category.key}
              variant={selectedCategory === category.key ? "default" : "outline"}
              className={cn(
                "cursor-pointer transition-colors text-xs",
                selectedCategory === category.key 
                  ? "bg-ancient-gold text-white hover:bg-ancient-gold/90" 
                  : "hover:bg-ancient-gold/10"
              )}
              onClick={() => setSelectedCategory(category.key)}
            >
              {category.label}
            </Badge>
          ))}
        </div>
      )}

      {/* Achievements Grid */}
      <div className="grid gap-3">
        {filteredAchievements.map((achievement) => (
          <Card key={achievement.id} className={cn(
            "p-3 transition-all duration-300",
            achievement.earned 
              ? "bg-gradient-to-r from-ancient-gold/15 to-ancient-brown/10 border-ancient-gold/50" 
              : "bg-gradient-to-r from-muted/30 to-muted/10 border-muted-foreground/20"
          )}>
            <div className="flex items-start gap-3">
              <div className={cn(
                "p-2 rounded-lg transition-colors flex-shrink-0",
                achievement.earned 
                  ? "bg-ancient-gold/20" 
                  : "bg-muted/60"
              )}>
                {getAchievementIcon(achievement)}
              </div>
              
              <div className="flex-1 space-y-2 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1 min-w-0">
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
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-xs font-medium flex-shrink-0",
                      achievement.earned 
                        ? "bg-ancient-gold/20 border-ancient-gold/40 text-ancient-gold" 
                        : "bg-muted/50"
                    )}
                  >
                    <Award className="h-2 w-2 mr-1" />
                    {achievement.points}
                  </Badge>
                </div>
                
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {achievement.description}
                </p>
                
                {!achievement.earned && achievement.progress !== undefined && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">
                        {achievement.progress || 0}/{achievement.total}
                      </span>
                      <span className="font-medium text-ancient-gold">
                        {Math.round(getProgressPercentage(achievement))}%
                      </span>
                    </div>
                    <Progress 
                      value={getProgressPercentage(achievement)} 
                      className="h-1.5 bg-muted"
                    />
                  </div>
                )}
                
                {achievement.earned && achievement.earned_at && (
                  <span className="text-xs text-muted-foreground">
                    {new Date(achievement.earned_at).toLocaleDateString('pt-BR')}
                  </span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredAchievements.length === 0 && (
        <Card className="p-6">
          <div className="text-center text-muted-foreground">
            <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <h3 className="font-semibold mb-1 text-sm">Nenhuma conquista encontrada</h3>
            <p className="text-xs">Nenhuma conquista encontrada nesta categoria.</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AchievementList;
