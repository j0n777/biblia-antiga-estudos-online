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
  const {
    t
  } = useLanguage();
  if (recentReadings.length === 0) {
    return <div className="card p-4 mb-3">
        <div className="text-center py-4">
          <BookOpen className="h-6 w-6 mx-auto mb-2 text-ancient-gold/60" />
          <h3 className="mb-1 font-oldstyle text-bible-title">
            Comece sua jornada de leitura
          </h3>
          <p className="text-secondary">
            Suas leituras recentes aparecerão aqui
          </p>
        </div>
      </div>;
  }
  const limitedReadings = recentReadings.slice(0, 2);
  return <div className="space-y-3 py-[12px] px-[16px]">
      <div className="subtitle-box">
        <Clock size={16} className="text-ancient-gold" />
        <h3 className="subtitle-text">{t('profile.recentReading') || "Leituras Recentes"}</h3>
        <div className="flex-1"></div>
        <Button variant="link" className="text-xs text-ancient-gold hover:text-ancient-gold/80 p-0 h-auto" onClick={onViewAllHistory}>
          Ver todas
        </Button>
      </div>
      
      <div className="space-y-2">
        {limitedReadings.map((history, index) => {
        const bookId = typeof history.book_id === 'string' ? history.book_id.toLowerCase() : String(history.book_id).toLowerCase();
        const displayName = bookNames[bookId] || String(history.book_id) || t('bible.unknown') || "Desconhecido";
        const chapterNum = history.chapter_number || history.chapter || 1;
        return <div key={`${bookId}-${chapterNum}-${index}`} className="card p-3 hover:bg-ancient-gold/5 transition-colors cursor-pointer group" onClick={() => onOpenChapter(bookId, chapterNum)}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-ancient-gold/20 rounded-lg flex items-center justify-center group-hover:bg-ancient-gold/30 transition-colors">
                    <BookOpen size={10} className="text-ancient-gold" />
                  </div>
                  <div>
                    <span className="text-sm text-ancient-brown block">
                      {displayName} {chapterNum}
                    </span>
                    <span className="text-secondary">
                      {new Date(history.timestamp || history.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
                <div className="text-secondary text-ancient-gold">
                  Cap. {chapterNum}
                </div>
              </div>
            </div>;
      })}
      </div>
    </div>;
};
export default RecentReadingSection;