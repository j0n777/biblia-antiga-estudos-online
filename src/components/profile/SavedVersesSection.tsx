
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bookmark } from 'lucide-react';
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
    return null;
  }

  return (
    <div className="mb-6">
      <h3 className="font-oldstyle text-lg text-scripture-heading flex items-center gap-2 mb-3">
        <Bookmark size={18} className="text-ancient-gold" />
        {t('profile.savedVerses')}
      </h3>
      
      <div className="space-y-2">
        {savedVerses.map((verse) => (
          <Card key={verse.id} className="p-3 bg-parchment-light border-ancient-gold/20 hover:bg-parchment-light/80">
            <button 
              className="w-full text-left"
              onClick={() => onReadVerse(verse.book_id, verse.chapter_number, verse.verse_number)}
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold text-ancient-brown">
                  {bookNames[verse.book_id] || verse.book_id} {verse.chapter_number}:{verse.verse_number}
                </span>
                
                {verse.highlight_color && (
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{backgroundColor: verse.highlight_color}}
                  ></div>
                )}
              </div>
              {verse.note && <p className="text-sm mt-1 text-gray-600">{verse.note}</p>}
            </button>
          </Card>
        ))}
        
        <div className="text-center pt-2">
          <Button 
            variant="link" 
            className="text-sm text-ancient-brown"
            onClick={onViewAllVerses}
          >
            {t('profile.viewAllVerses')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SavedVersesSection;
