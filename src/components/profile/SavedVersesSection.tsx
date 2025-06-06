
import { Card } from '@/components/ui/card';
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
  const { t } = useLanguage();

  if (savedVerses.length === 0) {
    return (
      <Card className="p-4 mb-4 bg-gradient-to-br from-parchment-light to-parchment border-ancient-gold/20">
        <div className="text-center py-6">
          <Bookmark className="h-8 w-8 mx-auto mb-3 text-ancient-gold/60" />
          <h3 className="font-oldstyle text-base text-scripture-heading mb-1">
            Salve seus versículos favoritos
          </h3>
          <p className="text-xs text-muted-foreground">
            Versículos salvos aparecerão aqui
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 mb-4 bg-gradient-to-br from-parchment-light to-parchment border-ancient-gold/20">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-oldstyle text-base text-scripture-heading flex items-center gap-2">
          <Heart size={16} className="text-ancient-gold" />
          {t('profile.savedVerses')}
        </h3>
        <Button 
          variant="link" 
          className="text-xs text-ancient-gold hover:text-ancient-gold/80 p-0 h-auto"
          onClick={onViewAllVerses}
        >
          Ver todos
        </Button>
      </div>
      
      <div className="space-y-2">
        {savedVerses.map((verse) => (
          <Card 
            key={verse.id} 
            className="p-3 bg-white/80 border-ancient-gold/30 hover:bg-ancient-gold/5 transition-colors cursor-pointer group"
            onClick={() => onReadVerse(verse.book_id, verse.chapter_number, verse.verse_number)}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-2 flex-1">
                <div className="w-7 h-7 bg-ancient-gold/20 rounded-lg flex items-center justify-center group-hover:bg-ancient-gold/30 transition-colors mt-0.5">
                  <Bookmark size={12} className="text-ancient-gold" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-ancient-brown text-sm">
                      {bookNames[verse.book_id] || verse.book_id} {verse.chapter_number}:{verse.verse_number}
                    </span>
                    {verse.highlight_color && (
                      <div 
                        className="w-2 h-2 rounded-full border border-white shadow-sm" 
                        style={{backgroundColor: verse.highlight_color}}
                      ></div>
                    )}
                  </div>
                  {verse.note && (
                    <p className="text-xs text-gray-600 italic line-clamp-2">"{verse.note}"</p>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
};

export default SavedVersesSection;
