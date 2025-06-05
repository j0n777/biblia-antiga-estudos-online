
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { TooltipProvider } from '@/components/ui/tooltip';
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
      <DialogContent className="max-w-lg max-h-screen overflow-y-auto bg-parchment-light">
        <DialogHeader>
          <DialogTitle className="font-oldstyle">Todas as Conquistas</DialogTitle>
          <DialogDescription>
            Desbloqueie conquistas lendo a Bíblia regularmente
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <TooltipProvider>
            {isLoading ? (
              <div className="text-center py-8">
                <p>Carregando conquistas...</p>
              </div>
            ) : (
              <AchievementList achievements={achievements} showCompleted={showCompleted} />
            )}
          </TooltipProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewAllAchievements;
