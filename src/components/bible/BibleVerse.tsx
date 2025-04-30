import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export type BibleVerseProps = {
  verse: {
    number: number;
    text: string;
  };
  originalText?: {
    text: string;
    transliteration?: string;
    language: 'hebrew' | 'greek' | 'aramaic';
  };
  wordDefinitions?: Record<string, {
    original: string;
    transliteration?: string;
    definition: string;
    strongsNumber?: string;
  }>;
  className?: string;
};

const BibleVerse = ({ verse, originalText, wordDefinitions, className }: BibleVerseProps) => {
  // Split the verse text into words to make them individually selectable
  const words = verse.text.split(' ');

  return (
    <div className={cn("my-2", className)}>
      <span className="verse-number">{verse.number}</span>{" "}
      <span className="scripture-text">
        {words.map((word, index) => {
          // Remove punctuation for word lookup but keep it for display
          const cleanWord = word.replace(/[.,;:!?()\[\]{}""''-]/g, '').toLowerCase();
          const hasPunctuation = word !== cleanWord + (word.match(/[.,;:!?()\[\]{}""''-]$/)?.[0] || '');
          const wordDefinition = wordDefinitions?.[cleanWord];

          // For words that have definitions available, wrap them in Popover
          if (wordDefinition) {
            return (
              <Popover key={index}>
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
            <span key={index}>
              {word}{" "}
            </span>
          );
        })}
      </span>
    </div>
  );
};

export default BibleVerse;
