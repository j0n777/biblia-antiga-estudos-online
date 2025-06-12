import { Button } from '@/components/ui/button';
import { Bookmark, Heart } from 'lucide-react';
import { SavedVerse } from '@/types/bible.types';
import { useLanguage } from '@/contexts/LanguageContext';
interface SavedVersesSectionProps {
  savedVerses: SavedVerse[];
  bookNames: Record<string, string>;
  onViewAllVerses: () => void;
  onReadVerse: (bookId: string, chapterNumber: number, verseNumber: number) => void;
}
const SavedVersesSection = ({
  savedVerses,
  bookNames,
  onViewAllVerses,
  onReadVerse
}: SavedVersesSectionProps) => {
  const {
    t
  } = useLanguage();
  if (savedVerses.length === 0) {
    return <div className="card p-4 mb-3">
        <div className="text-center py-4">
          <Bookmark className="h-6 w-6 mx-auto mb-2 text-ancient-gold/60" />
          <h3 className="mb-1 font-oldstyle text-bible-title">
            Salve seus versículos favoritos
          </h3>
          <p className="text-secondary">
            Versículos salvos aparecerão aqui
          </p>
        </div>
      </div>;
  }
  const limitedVerses = savedVerses.slice(0, 2);
  return <div className="space-y-3 py-[12px] px-[16px]">
      <div className="subtitle-box">
        <Heart size={16} className="text-ancient-gold" />
        <h3 className="subtitle-text">{t('profile.savedVerses')}</h3>
        <div className="flex-1"></div>
        <Button variant="link" className="text-xs text-ancient-gold hover:text-ancient-gold/80 p-0 h-auto" onClick={onViewAllVerses}>
          Ver todos
        </Button>
      </div>
      
      <div className="space-y-2">
        {limitedVerses.map(verse => <div key={verse.id} className="card p-3 hover:bg-ancient-gold/5 transition-colors cursor-pointer group" onClick={() => onReadVerse(verse.book_id, verse.chapter_number, verse.verse_number)}>
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-2 flex-1">
                <div className="w-6 h-6 bg-ancient-gold/20 rounded-lg flex items-center justify-center group-hover:bg-ancient-gold/30 transition-colors mt-0.5">
                  <Bookmark size={10} className="text-ancient-gold" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-ancient-brown">
                      {bookNames[verse.book_id] || verse.book_id} {verse.chapter_number}:{verse.verse_number}
                    </span>
                    {verse.highlight_color && <div className="w-2 h-2 rounded-full border border-white shadow-sm" style={{
                  backgroundColor: verse.highlight_color
                }}></div>}
                  </div>
                  {verse.note && <p className="text-secondary italic line-clamp-2">"{verse.note}"</p>}
                </div>
              </div>
            </div>
          </div>)}
      </div>
    </div>;
};
export default SavedVersesSection;