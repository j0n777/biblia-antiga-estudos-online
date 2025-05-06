
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
    <div className="parchment-container space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-oldstyle text-lg text-scripture-heading">{t('profile.readingStreak') || 'Sequência de Leitura'}</h3>
        <span className="text-sm text-muted-foreground">{currentStreak} {t('profile.days') || 'dias'}</span>
      </div>
      
      <div className="flex items-center justify-center gap-2">
        {[1, 2, 3, 4, 5, 6, 7].map((day) => (
          <div 
            key={day} 
            className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center border",
              day <= currentStreak % 7 || day === 7 && currentStreak % 7 === 0 && currentStreak > 0
                ? "border-ancient-gold bg-ancient-gold/10 text-ancient-gold"
                : "border-muted bg-muted/50 text-muted-foreground"
            )}
          >
            {day}
          </div>
        ))}
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{t('profile.dailyGoal') || 'Meta diária'}</span>
          <span>{goalProgress}%</span>
        </div>
        <Progress value={goalProgress} className="h-2 bg-muted" />
      </div>
      
      <div className="flex items-center gap-2">
        <Trophy size={18} className="text-ancient-gold" />
        <span className="text-sm">
          {t('profile.bestStreak') || 'Melhor sequência'}: <strong>{longestStreak} {t('profile.days') || 'dias'}</strong>
        </span>
      </div>
    </div>
  );
};

export default ReadingStreak;
