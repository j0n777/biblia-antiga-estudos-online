
import { Flame, Trophy, Target } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
  className?: string;
}

const StreakDisplay = ({ currentStreak, longestStreak, className }: StreakDisplayProps) => {
  const { t } = useLanguage();
  
  // Calculate streak level based on milestones
  const getStreakLevel = (streak: number) => {
    if (streak >= 365) return { level: 'Lendário', color: 'text-purple-500', bgColor: 'bg-purple-500/20' };
    if (streak >= 180) return { level: 'Mestre', color: 'text-blue-500', bgColor: 'bg-blue-500/20' };
    if (streak >= 90) return { level: 'Experiente', color: 'text-green-500', bgColor: 'bg-green-500/20' };
    if (streak >= 30) return { level: 'Dedicado', color: 'text-yellow-500', bgColor: 'bg-yellow-500/20' };
    if (streak >= 7) return { level: 'Iniciante', color: 'text-orange-500', bgColor: 'bg-orange-500/20' };
    return { level: 'Novo', color: 'text-gray-500', bgColor: 'bg-gray-500/20' };
  };

  const streakInfo = getStreakLevel(currentStreak);
  const nextMilestone = getNextMilestone(currentStreak);

  return (
    <Card className={cn("p-6 bg-gradient-to-br from-ancient-gold/10 to-ancient-brown/10 border-ancient-gold/20", className)}>
      <div className="space-y-4">
        {/* Main streak display */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Flame className={cn("h-8 w-8", streakInfo.color)} />
            <h3 className="text-2xl font-oldstyle text-scripture-heading">Sequência de Leitura</h3>
          </div>
          
          <div className="space-y-1">
            <div className="text-6xl font-bold text-ancient-gold">
              {currentStreak}
            </div>
            <div className="text-lg text-scripture-text">
              {currentStreak === 1 ? 'dia' : 'dias'} consecutivos
            </div>
            <div className={cn("inline-flex px-3 py-1 rounded-full text-sm font-medium", streakInfo.bgColor, streakInfo.color)}>
              {streakInfo.level}
            </div>
          </div>
        </div>

        {/* Progress to next milestone */}
        {nextMilestone && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Próxima meta:</span>
              <span className="font-medium text-ancient-brown">{nextMilestone.target} dias</span>
            </div>
            <div className="w-full bg-parchment-dark/20 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-ancient-gold to-ancient-brown h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((currentStreak / nextMilestone.target) * 100, 100)}%` }}
              />
            </div>
            <div className="text-xs text-center text-muted-foreground">
              {nextMilestone.target - currentStreak} dias para "{nextMilestone.title}"
            </div>
          </div>
        )}

        {/* Record and stats */}
        <div className="flex justify-between items-center pt-4 border-t border-parchment-dark/20">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-ancient-gold" />
            <div className="text-sm">
              <div className="text-muted-foreground">Melhor sequência</div>
              <div className="font-bold text-ancient-brown">{longestStreak} dias</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-ancient-gold" />
            <div className="text-sm text-right">
              <div className="text-muted-foreground">Meta diária</div>
              <div className="font-bold text-green-600">✓ Concluída</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

function getNextMilestone(currentStreak: number) {
  const milestones = [
    { target: 7, title: 'Semana Sagrada' },
    { target: 14, title: 'Duas Semanas Devotas' },
    { target: 30, title: 'Mês de Fé' },
    { target: 60, title: 'Dois Meses Dedicados' },
    { target: 90, title: 'Três Meses Fiéis' },
    { target: 120, title: 'Quatro Meses Constantes' },
    { target: 180, title: 'Meio Ano Devoto' },
    { target: 365, title: 'Ano Completo' }
  ];

  return milestones.find(milestone => milestone.target > currentStreak) || null;
}

export default StreakDisplay;
