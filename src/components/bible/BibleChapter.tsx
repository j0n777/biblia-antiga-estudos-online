
import React, { useState } from 'react';
import { BookContent, BibleChapter as BibleChapterType } from '@/types/bible.types';
import { getBookContent } from '@/services/BibleDataService';
import BibleVerse from './BibleVerse';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from 'next-themes';
import { ScrollArea } from "@/components/ui/scroll-area"

interface BibleChapterProps {
  bookId?: string;
  chapterNumber?: number;
  chapter?: BibleChapterType;
  scrollToVerse?: number | null;
  onVerseAction?: (verseNumber: number) => Promise<void> | void;
  isVerseSelected?: (verseNumber: number) => boolean;
  fontSize?: 'small' | 'medium' | 'large';
}

const BibleChapter: React.FC<BibleChapterProps> = ({ 
  bookId, 
  chapterNumber, 
  chapter,
  scrollToVerse,
  onVerseAction,
  isVerseSelected,
  fontSize = 'medium'
}) => {
  const [chapterContent, setChapterContent] = useState<BookContent | null>(null);
  const [selectedVerseId, setSelectedVerseId] = useState<string | null>(null);
  const { t } = useLanguage();
  const { theme } = useTheme();
  
  React.useEffect(() => {
    const fetchChapterContent = async () => {
      if (bookId && chapterNumber) {
        const content = await getBookContent(bookId, chapterNumber);
        setChapterContent(content);
      } else if (chapter) {
        // If we have a chapter object directly, format it as BookContent
        setChapterContent({
          book_id: chapter.book_id,
          book_name: chapter.book_name,
          chapter_number: chapter.chapter_number,
          verses: chapter.verses
        });
      }
    };
    
    fetchChapterContent();
  }, [bookId, chapterNumber, chapter]);
  
  const handleVerseSelect = (verseId: string) => {
    setSelectedVerseId(verseId === selectedVerseId ? null : verseId);
  };
  
  const handleVerseClick = async (verseNumber: number) => {
    if (onVerseAction) {
      await onVerseAction(verseNumber);
    }
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'small':
        return 'text-sm';
      case 'medium':
        return 'text-base';
      case 'large':
        return 'text-lg';
      default:
        return 'text-base';
    }
  };
  
  if (!chapterContent) {
    return <div>{t('loading')}...</div>;
  }

  const renderVerse = (verse: any) => {
    const isSelected = isVerseSelected ? isVerseSelected(verse.verse_number) : selectedVerseId === verse.id;
    
    return (
      <div key={verse.id} className="mb-2">
        <BibleVerse 
          verse={verse} 
          isHighlighted={isSelected}
          onVerseClick={() => handleVerseClick(verse.verse_number)}
        />
      </div>
    );
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold font-oldstyle text-scripture-heading dark:text-scripture-heading-dark">
          {chapterContent.book_name} {chapterContent.chapter_number}
        </h1>
      </div>
      
      <ScrollArea className="h-[calc(100vh-200px)] w-full rounded-md border">
        <div className={`font-garamond text-scripture-text dark:text-scripture-text-dark ${getFontSizeClass()} py-2 px-4`}>
          {chapterContent.verses.map(renderVerse)}
        </div>
      </ScrollArea>
    </div>
  );
};

export default BibleChapter;
