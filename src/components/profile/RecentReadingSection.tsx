
import { Button } from '@/components/ui/button';
import { Clock, BookOpen } from 'lucide-react';
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
    return (
      <div className="p-4">
        <div className="subtitle-box mb-3">
          <Clock size={16} className="text-ancient-gold" />
          <h3 className="subtitle-text">{t('profile.recentReading') || "Leituras Recentes"}</h3>
        </div>
        
        <div className="text-center py-6">
          <BookOpen className="h-8 w-8 mx-auto mb-2 text-ancient-gold/60" />
          <h4 className="mb-1 font-oldstyle text-bible-title">
            Comece sua jornada de leitura
          </h4>
          <p className="text-secondary text-sm">
            Suas leituras recentes aparecerão aqui
          </p>
        </div>
      </div>
    );
  }

  const limitedReadings = recentReadings.slice(0, 2);

  return (
    <div className="p-4">
      <div className="subtitle-box mb-3">
        <Clock size={16} className="text-ancient-gold" />
        <h3 className="subtitle-text">{t('profile.recentReading') || "Leituras Recentes"}</h3>
        <div className="flex-1"></div>
        <Button 
          variant="link" 
          className="text-xs text-ancient-gold hover:text-ancient-gold/80 p-0 h-auto" 
          onClick={onViewAllHistory}
        >
          Ver todas
        </Button>
      </div>
      
      <div className="space-y-2">
        {limitedReadings.map((history, index) => {
          const bookId = typeof history.book_id === 'string' ? history.book_id.toLowerCase() : String(history.book_id).toLowerCase();
          const displayName = bookNames[bookId] || String(history.book_id) || t('bible.unknown') || "Desconhecido";
          const chapterNum = history.chapter_number || history.chapter || 1;
          const readingDate = new Date(history.timestamp || history.created_at);
          const formattedDate = readingDate.toLocaleDateString('pt-BR', { 
            day: '2-digit', 
            month: 'short' 
          });

          return (
            <div 
              key={`${bookId}-${chapterNum}-${index}`} 
              className="bg-ancient-gold/10 p-3 rounded-lg hover:bg-ancient-gold/15 transition-colors cursor-pointer group border border-ancient-gold/20" 
              onClick={() => onOpenChapter(bookId, chapterNum)}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-ancient-gold/30 rounded-lg flex items-center justify-center group-hover:bg-ancient-gold/40 transition-colors">
                    <BookOpen size={14} className="text-ancient-gold" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-ancient-brown block">
                      {displayName}
                    </span>
                    <span className="text-xs text-secondary">
                      {formattedDate}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-ancient-gold font-medium">
                  Cap. {chapterNum}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentReadingSection;
