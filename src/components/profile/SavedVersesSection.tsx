
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
      <Card className="p-6 mb-6 bg-gradient-to-br from-parchment-light to-parchment border-ancient-gold/20">
        <div className="text-center py-8">
          <Bookmark className="h-12 w-12 mx-auto mb-4 text-ancient-gold/60" />
          <h3 className="font-oldstyle text-lg text-scripture-heading mb-2">
            Salve seus versículos favoritos
          </h3>
          <p className="text-sm text-muted-foreground">
            Versículos salvos aparecerão aqui
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 mb-6 bg-gradient-to-br from-parchment-light to-parchment border-ancient-gold/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-oldstyle text-lg text-scripture-heading flex items-center gap-2">
          <Heart size={18} className="text-ancient-gold" />
          {t('profile.savedVerses')}
        </h3>
        <Button 
          variant="link" 
          className="text-sm text-ancient-gold hover:text-ancient-gold/80"
          onClick={onViewAllVerses}
        >
          Ver todos
        </Button>
      </div>
      
      <div className="space-y-3">
        {savedVerses.map((verse) => (
          <Card 
            key={verse.id} 
            className="p-4 bg-white/80 border-ancient-gold/30 hover:bg-ancient-gold/5 transition-colors cursor-pointer group"
            onClick={() => onReadVerse(verse.book_id, verse.chapter_number, verse.verse_number)}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-10 h-10 bg-ancient-gold/20 rounded-lg flex items-center justify-center group-hover:bg-ancient-gold/30 transition-colors">
                  <Bookmark size={16} className="text-ancient-gold" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-ancient-brown">
                      {bookNames[verse.book_id] || verse.book_id} {verse.chapter_number}:{verse.verse_number}
                    </span>
                    {verse.highlight_color && (
                      <div 
                        className="w-3 h-3 rounded-full border border-white shadow-sm" 
                        style={{backgroundColor: verse.highlight_color}}
                      ></div>
                    )}
                  </div>
                  {verse.note && (
                    <p className="text-sm text-gray-600 italic">"{verse.note}"</p>
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
