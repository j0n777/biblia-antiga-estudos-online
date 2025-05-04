
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { TooltipProvider } from '@/components/ui/tooltip';
import AchievementList from '../achievements/AchievementList';

// Define the interface for the component props
interface ViewAllAchievementsProps {
  showAll?: boolean;
}

const ViewAllAchievements = ({ showAll = true }: ViewAllAchievementsProps) => {
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
            <AchievementList showAll={showAll} />
          </TooltipProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewAllAchievements;
