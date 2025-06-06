
import { Card } from '@/components/ui/card';
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
      <Card className="p-6 mb-6 bg-gradient-to-br from-parchment-light to-parchment border-ancient-gold/20">
        <div className="text-center py-8">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-ancient-gold/60" />
          <h3 className="font-oldstyle text-lg text-scripture-heading mb-2">
            Comece sua jornada de leitura
          </h3>
          <p className="text-sm text-muted-foreground">
            Suas leituras recentes aparecerão aqui
          </p>
        </div>
      </Card>
    );
  }

  const limitedReadings = recentReadings.slice(0, 5);

  return (
    <Card className="p-6 mb-6 bg-gradient-to-br from-parchment-light to-parchment border-ancient-gold/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-oldstyle text-lg text-scripture-heading flex items-center gap-2">
          <Clock size={18} className="text-ancient-gold" />
          {t('profile.recentReading') || "Leituras Recentes"}
        </h3>
        <Button 
          variant="link" 
          className="text-sm text-ancient-gold hover:text-ancient-gold/80"
          onClick={onViewAllHistory}
        >
          Ver todas
        </Button>
      </div>
      
      <div className="space-y-3">
        {limitedReadings.map((history, index) => {
          const bookId = typeof history.book_id === 'string' 
            ? history.book_id.toLowerCase() 
            : String(history.book_id).toLowerCase();
          
          const displayName = bookNames[bookId] || String(history.book_id) || t('bible.unknown') || "Desconhecido";
          const chapterNum = history.chapter_number || history.chapter || 1;
          
          return (
            <Card 
              key={`${bookId}-${chapterNum}-${index}`} 
              className="p-4 bg-white/80 border-ancient-gold/30 hover:bg-ancient-gold/5 transition-colors cursor-pointer group"
              onClick={() => onOpenChapter(bookId, chapterNum)}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-ancient-gold/20 rounded-lg flex items-center justify-center group-hover:bg-ancient-gold/30 transition-colors">
                    <BookOpen size={16} className="text-ancient-gold" />
                  </div>
                  <div>
                    <span className="font-semibold text-ancient-brown block">
                      {displayName} {chapterNum}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(history.timestamp || history.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-ancient-gold font-medium">
                  Capítulo {chapterNum}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </Card>
  );
};

export default RecentReadingSection;
