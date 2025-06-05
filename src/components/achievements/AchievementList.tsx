
import { useState } from 'react';
import { Achievement } from '@/types/bible.types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Lock, Trophy } from 'lucide-react';
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

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Badge
            key={category.key}
            variant={selectedCategory === category.key ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedCategory(category.key)}
          >
            {category.label}
          </Badge>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredAchievements.map((achievement) => (
          <Card key={achievement.id} className={cn(
            "p-4 transition-all duration-200",
            achievement.earned 
              ? "bg-gradient-to-br from-ancient-gold/20 to-ancient-brown/10 border-ancient-gold/40" 
              : "bg-muted/50 border-muted-foreground/20"
          )}>
            <div className="flex items-start gap-3">
              <div className={cn(
                "text-2xl p-2 rounded-lg",
                achievement.earned ? "bg-ancient-gold/20" : "bg-muted"
              )}>
                {achievement.earned ? achievement.icon : <Lock className="h-6 w-6 text-muted-foreground" />}
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className={cn(
                    "font-semibold text-sm",
                    achievement.earned ? "text-ancient-brown" : "text-muted-foreground"
                  )}>
                    {achievement.title}
                  </h3>
                  {achievement.earned && (
                    <Trophy className="h-4 w-4 text-ancient-gold" />
                  )}
                </div>
                
                <p className="text-xs text-muted-foreground">
                  {achievement.description}
                </p>
                
                {!achievement.earned && achievement.progress !== undefined && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>{achievement.progress || 0}/{achievement.total}</span>
                      <span>{Math.round(getProgressPercentage(achievement))}%</span>
                    </div>
                    <Progress value={getProgressPercentage(achievement)} className="h-2" />
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <Badge variant="outline" className="text-xs">
                    {achievement.points} XP
                  </Badge>
                  {achievement.earned && achievement.earned_at && (
                    <span className="text-xs text-muted-foreground">
                      {new Date(achievement.earned_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredAchievements.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Nenhuma conquista encontrada nesta categoria.</p>
        </div>
      )}
    </div>
  );
};

export default AchievementList;
