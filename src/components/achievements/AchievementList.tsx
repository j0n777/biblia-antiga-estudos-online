
import { useState, useEffect } from 'react';
import { getUserAchievements } from '@/services/AchievementService';
import { Achievement, AchievementCategory } from '@/types/bible.types';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Trophy, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type AchievementListProps = {
  showLocked?: boolean;
  showAll?: boolean;
};

const AchievementList = ({ showLocked = true, showAll = false }: AchievementListProps) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      const data = await getUserAchievements();
      setAchievements(data);
      setIsLoading(false);
    };

    fetchAchievements();
  }, []);

  if (isLoading) {
    return <div className="parchment-container p-4">Carregando conquistas...</div>;
  }

  // Filter achievements based on active tab
  const filterAchievements = (category: string | null): Achievement[] => {
    const filtered = achievements.filter(achievement => {
      // First filter by category
      const matchesCategory = category === 'all' || achievement.category === category;
      
      // Then filter by unlock status if not showing all
      const matchesUnlockStatus = showAll || (showLocked || achievement.unlocked);
      
      return matchesCategory && matchesUnlockStatus;
    });
    
    // Sort unlocked first, then by progress/category
    return filtered.sort((a, b) => {
      // Unlocked ones first
      if (a.unlocked && !b.unlocked) return -1;
      if (!a.unlocked && b.unlocked) return 1;
      
      // Then sort by category
      return 0;
    });
  };

  // Get display count of total achievements
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  
  // Generate tabs for filtering by category
  const categories: {id: string, label: string}[] = [
    { id: 'all', label: 'Todas' },
    { id: 'book', label: 'Livros' },
    { id: 'testament', label: 'Testamentos' },
    { id: 'streak', label: 'Sequências' },
    { id: 'milestone', label: 'Marcos' },
    { id: 'challenge', label: 'Desafios' }
  ];

  const displayedAchievements = filterAchievements(activeTab);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-oldstyle text-lg text-scripture-heading flex items-center gap-2">
          <Trophy size={18} className="text-ancient-gold" />
          Conquistas <span className="text-sm text-muted-foreground">({unlockedCount}/{totalCount})</span>
        </h3>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-parchment-light mb-4">
          {categories.map(cat => (
            <TabsTrigger key={cat.id} value={cat.id}>
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map(cat => (
          <TabsContent key={cat.id} value={cat.id} className="space-y-3">
            {displayedAchievements.length === 0 ? (
              <Card className="parchment-container">
                <CardContent className="pt-6 text-center text-muted-foreground">
                  {cat.id === 'all' 
                    ? "Nenhuma conquista disponível" 
                    : `Nenhuma conquista de ${cat.label.toLowerCase()} disponível`}
                </CardContent>
              </Card>
            ) : (
              displayedAchievements.map((achievement) => (
                <Card 
                  key={achievement.id} 
                  className={`parchment-container ${!achievement.unlocked ? 'opacity-70' : ''}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`achievement-badge ${achievement.unlocked ? 'bg-ancient-gold' : 'bg-muted'}`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-oldstyle text-scripture-heading">
                            {achievement.name}
                          </h4>
                          <span className="text-sm text-muted-foreground">
                            {achievement.points} XP
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        
                        {achievement.unlockedAt ? (
                          <p className="text-xs text-ancient-brown mt-1 flex items-center gap-1">
                            <Clock size={12} />
                            Conquistado {formatDistanceToNow(achievement.unlockedAt, { addSuffix: true, locale: ptBR })}
                          </p>
                        ) : (achievement.progress !== undefined && achievement.maxProgress !== undefined) ? (
                          <div className="mt-2 space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>Progresso</span>
                              <span>{achievement.progress}/{achievement.maxProgress}</span>
                            </div>
                            <Progress 
                              value={(achievement.progress / achievement.maxProgress) * 100} 
                              className="h-1.5 bg-muted"
                            />
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default AchievementList;
