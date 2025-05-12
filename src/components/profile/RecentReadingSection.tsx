
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import { ReadingHistory } from '@/types/bible.types';
import { useLanguage } from '@/contexts/LanguageContext';

interface RecentReadingSectionProps {
  recentReadings: ReadingHistory[];
  bookNames: Record<string, string>;
  onViewAllHistory: () => void;
  onOpenChapter: (bookId: string, chapter: number) => void;
}

const RecentReadingSection = ({ 
  recentReadings, 
  bookNames, 
  onViewAllHistory, 
  onOpenChapter 
}: RecentReadingSectionProps) => {
  const { t } = useLanguage();

  if (recentReadings.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <h3 className="font-oldstyle text-lg text-scripture-heading flex items-center gap-2 mb-3">
        <Clock size={18} className="text-ancient-gold" />
        {t('profile.recentReading')}
      </h3>
      
      <div className="space-y-2">
        {recentReadings.map((history, index) => (
          <Card 
            key={`${history.book_id}-${history.chapter}-${index}`} 
            className="p-3 bg-parchment-light border-ancient-gold/20 hover:bg-parchment-light/80"
          >
            <button 
              className="w-full text-left"
              onClick={() => onOpenChapter(history.book_id, history.chapter)}
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold text-ancient-brown">
                  {bookNames[history.book_id] || history.book_id} {history.chapter}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(history.timestamp).toLocaleDateString()}
                </span>
              </div>
            </button>
          </Card>
        ))}
        
        <div className="text-center pt-2">
          <Button 
            variant="link" 
            className="text-sm text-ancient-brown"
            onClick={onViewAllHistory}
          >
            {t('profile.viewAllHistory')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecentReadingSection;
