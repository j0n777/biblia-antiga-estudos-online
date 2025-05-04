import { useState, useEffect, useRef } from 'react';
import { BibleChapter as BibleChapterType } from '@/types/bible.types';
import { Check, Bookmark, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import BibleVerse from './BibleVerse';

interface BibleChapterProps {
  chapter: BibleChapterType;
  scrollToVerse?: number | null;
  onVerseAction?: (verseNumber: number) => void;
  isVerseSelected?: (verseNumber: number) => boolean;
  fontSize?: 'small' | 'medium' | 'large';
}

const BibleChapter = ({ 
  chapter, 
  scrollToVerse = null,
  onVerseAction,
  isVerseSelected,
  fontSize = 'medium'
}: BibleChapterProps) => {
  const [selectedVerseNumber, setSelectedVerseNumber] = useState<number | null>(null);
  const verseRefs = useRef<{[key: number]: HTMLDivElement | null}>({});
  
  useEffect(() => {
    // Scroll to verse if specified
    if (scrollToVerse && verseRefs.current[scrollToVerse]) {
      setTimeout(() => {
        verseRefs.current[scrollToVerse]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setSelectedVerseNumber(scrollToVerse);
      }, 500);
    }
  }, [chapter, scrollToVerse]);

  const handleVerseClick = (verseNumber: number) => {
    setSelectedVerseNumber(selectedVerseNumber === verseNumber ? null : verseNumber);
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'small': 
        return 'text-sm';
      case 'large':
        return 'text-lg';
      case 'medium':
      default:
        return 'text-base';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h1 className="font-oldstyle text-2xl text-scripture-heading">
          {chapter.book_name}
        </h1>
        <p className="text-muted-foreground text-sm">
          {chapter.version?.name}
        </p>
      </div>
      
      <div className="verse-container">
        <h2 className="font-oldstyle text-xl text-scripture-heading mb-4">
          Capítulo {chapter.chapter_number}
        </h2>
        
        <div className={`space-y-1 ${getFontSizeClass()}`}>
          {chapter.verses.map((verse) => (
            <div 
              key={verse.id} 
              ref={el => verseRefs.current[verse.verse_number] = el}
              className={`flex gap-2 group p-1 rounded-md ${
                selectedVerseNumber === verse.verse_number ? 'bg-amber-100/80 dark:bg-amber-800/20' : ''
              }`}
              onClick={() => handleVerseClick(verse.verse_number)}
            >
              <BibleVerse 
                book={chapter.book_name}
                chapter={chapter.chapter_number}
                verse={verse}
                isSelected={selectedVerseNumber === verse.verse_number}
              />
              
              {selectedVerseNumber === verse.verse_number && (
                <div className="flex items-start mt-1 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onVerseAction) {
                              onVerseAction(verse.verse_number);
                            }
                          }}
                        >
                          {isVerseSelected && isVerseSelected(verse.verse_number) ? (
                            <Check size={14} className="text-green-600" />
                          ) : (
                            <Bookmark size={14} />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {isVerseSelected && isVerseSelected(verse.verse_number) 
                          ? 'Versículo salvo' 
                          : 'Salvar versículo'}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0 text-xs ml-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle sharing
                          }}
                        >
                          <Share2 size={14} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        Compartilhar
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BibleChapter;
