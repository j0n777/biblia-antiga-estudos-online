
import { useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { WordDefinition } from '@/services/BibleService';
import { useInView } from 'react-intersection-observer';

export type BibleVerseProps = {
  verse: {
    id: string;
    verse_number: number;
    text: string;
  };
  originalText?: {
    text: string;
    transliteration?: string;
    language: string;
  };
  wordDefinitions?: Record<string, WordDefinition>;
  className?: string;
  displayVerseNumber?: boolean;
  onInView?: () => void;
};

const BibleVerse = ({ 
  verse, 
  originalText, 
  wordDefinitions, 
  className,
  displayVerseNumber = true,
  onInView
}: BibleVerseProps) => {
  // Set up intersection observer to detect when verse is visible
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true
  });

  // Call onInView callback when verse comes into view
  useEffect(() => {
    if (inView && onInView) {
      onInView();
    }
  }, [inView, onInView]);

  // Split the verse text into words to make them individually selectable
  const words = verse.text.split(' ');

  return (
    <div className={cn("my-2 flex", className)} ref={ref}>
      {displayVerseNumber && (
        <span className="verse-number mr-2 text-ancient-red font-oldstyle">{verse.verse_number}</span>
      )}
      <span className="scripture-text">
        {words.map((word, index) => {
          // Remove punctuation for word lookup but keep it for display
          const cleanWord = word.replace(/[.,;:!?()\[\]{}""''-]/g, '').toLowerCase();
          const hasPunctuation = word !== cleanWord + (word.match(/[.,;:!?()\[\]{}""''-]$/)?.[0] || '');
          const wordDefinition = wordDefinitions?.[cleanWord];

          // For words that have definitions available, wrap them in Popover
          if (wordDefinition) {
            return (
              <Popover key={`${verse.verse_number}-word-${index}`}>
                <PopoverTrigger asChild>
                  <span className="cursor-pointer hover:text-ancient-brown hover:underline hover:underline-offset-2">
                    {word}{" "}
                  </span>
                </PopoverTrigger>
                <PopoverContent className="parchment-container w-72 max-w-screen-sm">
                  <div className="space-y-2">
                    <h4 className="font-oldstyle text-lg font-semibold text-ancient-brown">
                      {wordDefinition.original}
                    </h4>
                    {wordDefinition.transliteration && (
                      <p className="text-sm italic text-muted-foreground">
                        {wordDefinition.transliteration}
                      </p>
                    )}
                    <div className="h-px bg-parchment-darker/30 my-2" />
                    <p className="text-sm">{wordDefinition.definition}</p>
                    {wordDefinition.strongsNumber && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Strong's: #{wordDefinition.strongsNumber}
                      </p>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            );
          }
          
          return (
            <span key={`${verse.verse_number}-word-${index}`}>
              {word}{" "}
            </span>
          );
        })}
      </span>
    </div>
  );
};

export default BibleVerse;
