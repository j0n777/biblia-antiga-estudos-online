
import { CardContent } from '@/components/ui/card';
import { LineChart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const StatisticsTab = () => {
  const { t } = useLanguage();
  
  return (
    <div className="card overflow-hidden">
      <CardContent className="p-4 space-y-4">
        <h3 className="font-oldstyle text-lg text-scripture-heading flex items-center gap-2">
          <LineChart size={18} className="text-primary" />
          {t('profile.readingProgress')}
        </h3>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center mb-1">
            <h4 className="text-sm font-oldstyle">{t('bible.oldTestament')}</h4>
            <span className="text-xs text-muted-foreground">23%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-ancient-brown" style={{ width: '23%' }}></div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center mb-1">
            <h4 className="text-sm font-oldstyle">{t('bible.newTestament')}</h4>
            <span className="text-xs text-muted-foreground">45%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-ancient-brown" style={{ width: '45%' }}></div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="text-center">
            <p className="text-2xl font-oldstyle text-ancient-brown">12</p>
            <p className="text-xs text-muted-foreground">{t('profile.booksCompleted')}</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-oldstyle text-ancient-brown">247</p>
            <p className="text-xs text-muted-foreground">{t('profile.chaptersRead')}</p>
          </div>
          <div className="text-center col-span-2">
            <p className="text-2xl font-oldstyle text-ancient-brown">3521</p>
            <p className="text-xs text-muted-foreground">{t('profile.versesRead')}</p>
          </div>
        </div>
      </CardContent>
    </div>
  );
};

export default StatisticsTab;
