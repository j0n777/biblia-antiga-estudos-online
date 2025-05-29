
import { Trophy } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

type ReadingStreakProps = {
  currentStreak: number;
  longestStreak: number;
  goalProgress: number;
};

const ReadingStreak = ({ currentStreak, longestStreak, goalProgress }: ReadingStreakProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="parchment-container space-y-4 rounded-xl">
      <div className="flex justify-between items-center">
        <h3 className="font-oldstyle text-lg text-scripture-heading">{t('profile.readingStreak') || 'Sequência de Leitura'}</h3>
        <span className="text-sm font-medium text-ancient-gold">{currentStreak} {t('profile.days') || 'dias'}</span>
      </div>
      
      <div className="flex items-center justify-center gap-2">
        {[1, 2, 3, 4, 5, 6, 7].map((day) => (
          <div 
            key={day} 
            className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center border-2 font-medium text-sm",
              day <= currentStreak % 7 || day === 7 && currentStreak % 7 === 0 && currentStreak > 0
                ? "border-ancient-gold bg-ancient-gold/20 text-ancient-gold"
                : "border-muted bg-muted/50 text-muted-foreground"
            )}
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* Meta Diária com barra de progresso visual */}
      <div className="bg-parchment-light/50 rounded-xl p-4 border border-parchment-dark/10">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-oldstyle text-scripture-heading font-medium">{t('profile.dailyGoal') || 'Meta Diária'}</h4>
          <span className="text-sm font-bold text-ancient-gold">{goalProgress}%</span>
        </div>
        <Progress 
          value={goalProgress} 
          className="h-3 bg-muted/50 rounded-full" 
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-muted-foreground">Progresso de hoje</span>
          <span className="text-xs text-scripture-text font-medium">
            {goalProgress >= 100 ? 'Meta concluída!' : 'Continue lendo...'}
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-2 pt-2">
        <Trophy size={18} className="text-ancient-gold" />
        <span className="text-sm">
          {t('profile.bestStreak') || 'Melhor sequência'}: <strong className="text-ancient-gold">{longestStreak} {t('profile.days') || 'dias'}</strong>
        </span>
      </div>
    </div>
  );
};

export default ReadingStreak;
