
import { useState } from 'react';
import { BibleVerse as BibleVerseType, WordDefinition } from '@/types/bible.types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Star, Languages, Share2, Info, Copy, Highlighter } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export interface BibleVerseProps {
  verse: BibleVerseType;
  isHighlighted?: boolean;
  onVerseClick?: () => Promise<void> | void;
}

const BibleVerse = ({ verse, isHighlighted = false, onVerseClick }: BibleVerseProps) => {
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  
  const handleCopyVerse = () => {
    navigator.clipboard.writeText(`${verse.verse_number}. ${verse.text}`);
    toast({
      description: 'Versículo copiado para a área de transferência.',
    });
    setIsActionsOpen(false);
  };
  
  const handleHighlightVerse = async () => {
    if (onVerseClick) {
      await onVerseClick();
    }
    setIsActionsOpen(false);
  };
  
  const handleShareVerse = () => {
    const shareText = `${verse.verse_number}. ${verse.text}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Compartilhar versículo',
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast({
        description: 'Versículo copiado para a área de transferência.',
      });
    }
    
    setIsActionsOpen(false);
  };
  
  // Word definition handler for original language study
  const WordDefinition = ({ word }: { word: WordDefinition }) => {
    return (
      <div className="p-2 max-w-xs">
        <div className="mb-2">
          <span className="text-sm font-semibold">Original:</span>{' '}
          <span className="text-sm font-serif">{word.original_word || '---'}</span>
        </div>
        <div className="mb-2">
          <span className="text-sm font-semibold">Transliteração:</span>{' '}
          <span className="text-sm">{word.transliteration || '---'}</span>
        </div>
        <div className="mb-2">
          <span className="text-sm font-semibold">Strong:</span>{' '}
          <span className="text-sm">{word.strongs_number || '---'}</span>
        </div>
        <div>
          <span className="text-sm font-semibold">Definição:</span>
          <p className="text-sm">{word.definition || '---'}</p>
        </div>
      </div>
    );
  };
  
  return (
    <div 
      className={`group relative py-1 px-2 rounded transition-colors ${
        isHighlighted ? 'bg-amber-100/80 dark:bg-amber-900/30' : 'hover:bg-gray-100/50 dark:hover:bg-gray-800/20'
      }`}
    >
      <div className="flex">
        <span className="text-scripture-verse-number font-semibold mr-2 mt-0.5 text-xs">
          {verse.verse_number}
        </span>
        <div className="flex-grow">{verse.text}</div>
        <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Popover open={isActionsOpen} onOpenChange={setIsActionsOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent side="top" align="end" className="w-48 p-2">
              <div className="flex flex-col space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start"
                  onClick={handleCopyVerse}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  <span>Copiar</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`justify-start ${isHighlighted ? 'text-amber-600' : ''}`}
                  onClick={handleHighlightVerse}
                >
                  <Highlighter className="mr-2 h-4 w-4" />
                  <span>{isHighlighted ? 'Destacado' : 'Destacar'}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start"
                  onClick={handleShareVerse}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  <span>Compartilhar</span>
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default BibleVerse;
