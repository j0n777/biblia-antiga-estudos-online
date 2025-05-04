
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Achievement } from '@/types/bible.types';
import { getUserAchievements } from '@/services/AchievementService';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import { Progress } from '../ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';

interface AchievementListProps {
  showAll?: boolean;
}

const AchievementList = ({ showAll = true }: AchievementListProps) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'books' | 'testaments' | 'streaks' | 'milestones' | 'challenges'>('all');
  
  const { t } = useLanguage();

  useEffect(() => {
    const fetchAchievements = async () => {
      setLoading(true);
      const data = await getUserAchievements();
      setAchievements(data);
      setLoading(false);
    };

    fetchAchievements();
  }, []);

  const filteredAchievements = achievements.filter(achievement => {
    if (filter === 'all') return true;
    if (filter === 'books') return achievement.category === 'book';
    if (filter === 'testaments') return achievement.category === 'testament';
    if (filter === 'streaks') return achievement.category === 'streak';
    if (filter === 'milestones') return achievement.category === 'milestone';
    if (filter === 'challenges') return achievement.category === 'challenge';
    return true;
  });

  const handleFilterChange = (newFilter: 'all' | 'books' | 'testaments' | 'streaks' | 'milestones' | 'challenges') => {
    setFilter(newFilter);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="parchment-container">
            <CardContent className="p-0">
              <div className="p-4 flex gap-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
                <Skeleton className="h-5 w-12" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter tabs */}
      <div className="flex overflow-x-auto py-2 space-x-2 no-scrollbar">
        <button
          onClick={() => handleFilterChange('all')}
          className={`px-3 py-1.5 rounded-full whitespace-nowrap text-sm ${filter === 'all' ? 'bg-ancient-brown text-white' : 'bg-parchment-light'}`}
        >
          {t('profile.all')}
        </button>
        <button
          onClick={() => handleFilterChange('books')}
          className={`px-3 py-1.5 rounded-full whitespace-nowrap text-sm ${filter === 'books' ? 'bg-ancient-brown text-white' : 'bg-parchment-light'}`}
        >
          {t('bible.book')}
        </button>
        <button
          onClick={() => handleFilterChange('testaments')}
          className={`px-3 py-1.5 rounded-full whitespace-nowrap text-sm ${filter === 'testaments' ? 'bg-ancient-brown text-white' : 'bg-parchment-light'}`}
        >
          {t('bible.testament')}
        </button>
        <button
          onClick={() => handleFilterChange('streaks')}
          className={`px-3 py-1.5 rounded-full whitespace-nowrap text-sm ${filter === 'streaks' ? 'bg-ancient-brown text-white' : 'bg-parchment-light'}`}
        >
          {t('profile.streak')}
        </button>
        <button
          onClick={() => handleFilterChange('milestones')}
          className={`px-3 py-1.5 rounded-full whitespace-nowrap text-sm ${filter === 'milestones' ? 'bg-ancient-brown text-white' : 'bg-parchment-light'}`}
        >
          {t('profile.milestones')}
        </button>
        <button
          onClick={() => handleFilterChange('challenges')}
          className={`px-3 py-1.5 rounded-full whitespace-nowrap text-sm ${filter === 'challenges' ? 'bg-ancient-brown text-white' : 'bg-parchment-light'}`}
        >
          {t('profile.challenges')}
        </button>
      </div>

      {/* Achievements grid */}
      <div className="grid grid-cols-2 gap-4">
        {filteredAchievements.map((achievement) => (
          <Card key={achievement.id} className={`parchment-container ${!achievement.unlocked && 'opacity-70'}`}>
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center">
                <div className={`h-16 w-16 rounded-full flex items-center justify-center text-xl ${achievement.unlocked ? 'bg-ancient-gold text-white' : 'bg-gray-300 text-gray-500'}`}>
                  {achievement.icon}
                </div>
                
                <h3 className="mt-3 font-oldstyle text-ancient-brown">
                  {achievement.name}
                </h3>
                
                <p className="text-xs mt-1 text-muted-foreground">
                  {achievement.description}
                </p>
                
                {(achievement.progress !== undefined && achievement.total !== undefined) && (
                  <div className="w-full mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span>{achievement.progress} / {achievement.total}</span>
                      <span>{Math.round((achievement.progress / achievement.total) * 100)}%</span>
                    </div>
                    <Progress value={(achievement.progress / achievement.total) * 100} className="h-1.5" />
                  </div>
                )}
                
                <div className="mt-2">
                  <Badge variant="outline" className="bg-ancient-brown/10">
                    {achievement.points} XP
                  </Badge>
                </div>
                
                {achievement.unlockedAt && (
                  <span className="text-xs mt-2 text-muted-foreground">
                    {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredAchievements.length === 0 && (
          <div className="col-span-2 py-8 text-center">
            <p className="text-muted-foreground">{t('achievements.none')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AchievementList;
