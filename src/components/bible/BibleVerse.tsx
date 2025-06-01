
import { useState } from 'react';
import { BibleVerse as BibleVerseType, WordDefinition } from '@/types/bible.types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Star, Languages, Share2, Info, Copy, Highlighter } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

export interface BibleVerseProps {
  verse: BibleVerseType;
  isHighlighted?: boolean;
  onVerseClick?: () => Promise<void> | void;
  fontSize?: 'large' | 'extra-large' | 'huge';
  isFirstVerse?: boolean;
}

const BibleVerse = ({ 
  verse, 
  isHighlighted = false, 
  onVerseClick, 
  fontSize = 'large', 
  isFirstVerse = false 
}: BibleVerseProps) => {
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const { t } = useLanguage();
  
  const handleCopyVerse = () => {
    navigator.clipboard.writeText(`${verse.verse_number}. ${verse.text}`);
    toast({
      description: t('bible.verseCopied') || 'Versículo copiado',
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
        title: t('bible.shareVerse') || 'Compartilhar versículo',
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast({
        description: t('bible.verseCopied') || 'Versículo copiado',
      });
    }
    
    setIsActionsOpen(false);
  };
  
  return (
    <div 
      id={`verse-${verse.verse_number}`}
      className={`group relative transition-all duration-200 rounded-xl ${
        isHighlighted ? 'bg-yellow-100/60 p-2' : 'hover:bg-gray-50/50 p-2'
      }`}
    >
      <div className="flex">
        <span className="inline">
          {isFirstVerse && (
            <span className="float-left text-6xl font-bold text-bible-subtitle mr-3 mt-1 leading-none font-serif">
              {verse.verse_number}
            </span>
          )}
          {!isFirstVerse && (
            <span className="text-sm font-bold text-bible-subtitle align-super mr-1">
              {verse.verse_number}
            </span>
          )}
          <span 
            className="cursor-pointer text-gray-800"
            onClick={onVerseClick}
          >
            {verse.text}
          </span>
        </span>
        <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <Popover open={isActionsOpen} onOpenChange={setIsActionsOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6 rounded-xl">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent side="top" align="end" className="w-48 p-2 bg-bible-controls rounded-xl border border-gray-300">
              <div className="flex flex-col space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start rounded-xl"
                  onClick={handleCopyVerse}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  <span>{t('bible.copy') || 'Copiar'}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`justify-start rounded-xl ${isHighlighted ? 'text-amber-600' : ''}`}
                  onClick={handleHighlightVerse}
                >
                  <Highlighter className="mr-2 h-4 w-4" />
                  <span>{isHighlighted ? (t('bible.removeHighlight') || 'Remover destaque') : (t('bible.highlight') || 'Destacar')}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start rounded-xl"
                  onClick={handleShareVerse}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  <span>{t('bible.share') || 'Compartilhar'}</span>
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
