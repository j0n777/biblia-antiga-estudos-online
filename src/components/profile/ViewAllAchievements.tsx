
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AchievementList from '../achievements/AchievementList';
import { getUserAchievements } from '@/services/AchievementService';
import { Achievement } from '@/types/bible.types';

// Define the interface for the component props
interface ViewAllAchievementsProps {
  showCompleted?: boolean;
}

const ViewAllAchievements = ({ showCompleted = true }: ViewAllAchievementsProps) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'completed' | 'pending'>('all');

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const userAchievements = await getUserAchievements();
        setAchievements(userAchievements);
      } catch (error) {
        console.error('Error fetching achievements:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  const filteredAchievements = achievements.filter(achievement => {
    if (activeFilter === 'completed') return achievement.earned;
    if (activeFilter === 'pending') return !achievement.earned;
    return true;
  });

  const completedCount = achievements.filter(a => a.earned).length;
  const totalXP = achievements
    .filter(a => a.earned)
    .reduce((sum, a) => sum + a.points, 0);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Badge 
          variant="outline" 
          className="bg-transparent border-parchment-darker/30 text-scripture-heading hover:text-ancient-gold cursor-pointer"
        >
          Ver todas
        </Badge>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-parchment-light">
        <DialogHeader>
          <DialogTitle className="font-oldstyle text-xl">Todas as Conquistas</DialogTitle>
          <DialogDescription>
            Desbloqueie conquistas lendo a Bíblia regularmente e ganhe XP para subir no ranking
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          {/* Statistics Summary */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-ancient-gold/10 rounded-xl">
            <div className="text-center">
              <div className="text-2xl font-bold text-ancient-brown">{completedCount}</div>
              <div className="text-xs text-muted-foreground">Conquistadas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-ancient-brown">{achievements.length}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-ancient-gold">{totalXP}</div>
              <div className="text-xs text-muted-foreground">XP Ganho</div>
            </div>
          </div>

          {/* Filter Tabs */}
          <Tabs value={activeFilter} onValueChange={(v) => setActiveFilter(v as any)} className="w-full">
            <TabsList className="grid grid-cols-3 bg-parchment-light/80">
              <TabsTrigger value="all">Todas ({achievements.length})</TabsTrigger>
              <TabsTrigger value="completed">Conquistadas ({completedCount})</TabsTrigger>
              <TabsTrigger value="pending">Pendentes ({achievements.length - completedCount})</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeFilter} className="mt-4">
              <TooltipProvider>
                {isLoading ? (
                  <div className="text-center py-8">
                    <p>Carregando conquistas...</p>
                  </div>
                ) : (
                  <AchievementList 
                    achievements={filteredAchievements} 
                    showCompleted={showCompleted} 
                  />
                )}
              </TooltipProvider>
            </TabsContent>
          </Tabs>
          
          {/* XP Earning Tips */}
          <div className="mt-6 p-4 bg-parchment-dark/5 rounded-xl">
            <h4 className="font-semibold text-scripture-heading mb-2">💡 Como ganhar mais XP:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Leia diariamente para manter sua sequência</li>
              <li>• Complete livros inteiros da Bíblia</li>
              <li>• Salve versículos importantes</li>
              <li>• Participe dos desafios diários</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewAllAchievements;
