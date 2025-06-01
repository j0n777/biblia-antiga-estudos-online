
import { useState } from 'react';
import { BibleVerse as BibleVerseType, WordDefinition } from '@/types/bible.types';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import { Copy, Share2, Highlighter } from 'lucide-react';
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
  const { t } = useLanguage();
  
  const handleCopyVerse = () => {
    navigator.clipboard.writeText(`${verse.verse_number}. ${verse.text}`);
    toast({
      description: t('bible.verseCopied') || 'Versículo copiado',
    });
  };
  
  const handleHighlightVerse = async () => {
    if (onVerseClick) {
      await onVerseClick();
    }
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
  };
  
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div 
          id={`verse-${verse.verse_number}`}
          className={`transition-all duration-200 rounded-xl cursor-pointer ${
            isHighlighted ? 'bg-yellow-100/60 p-2' : 'hover:bg-gray-50/50 p-2'
          }`}
          onClick={onVerseClick}
        >
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
            <span className="text-gray-800">
              {verse.text}
            </span>
          </span>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48 bg-bible-controls rounded-xl border border-gray-300 shadow-lg">
        <ContextMenuItem 
          onClick={handleCopyVerse}
          className="rounded-xl cursor-pointer"
        >
          <Copy className="mr-2 h-4 w-4" />
          <span>{t('bible.copy') || 'Copiar'}</span>
        </ContextMenuItem>
        <ContextMenuItem 
          onClick={handleHighlightVerse}
          className={`rounded-xl cursor-pointer ${isHighlighted ? 'text-amber-600' : ''}`}
        >
          <Highlighter className="mr-2 h-4 w-4" />
          <span>{isHighlighted ? (t('bible.removeHighlight') || 'Remover destaque') : (t('bible.highlight') || 'Destacar')}</span>
        </ContextMenuItem>
        <ContextMenuItem 
          onClick={handleShareVerse}
          className="rounded-xl cursor-pointer"
        >
          <Share2 className="mr-2 h-4 w-4" />
          <span>{t('bible.share') || 'Compartilhar'}</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default BibleVerse;
