import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BookContent } from '@/types/bible.types';
import { getBookContent } from '@/services/BibleDataService';
import BibleVerse from './BibleVerse';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from 'next-themes';
import FontSizeControl from './FontSizeControl';
import { ScrollArea } from "@/components/ui/scroll-area"

interface BibleChapterProps {
  bookId: string;
  chapterNumber: number;
}

const BibleChapter: React.FC<BibleChapterProps> = ({ bookId, chapterNumber }) => {
  const [chapterContent, setChapterContent] = useState<BookContent | null>(null);
  const [selectedVerseId, setSelectedVerseId] = useState<string | null>(null);
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  
  useEffect(() => {
    const fetchChapterContent = async () => {
      const content = await getBookContent(bookId, chapterNumber);
      setChapterContent(content);
    };
    
    fetchChapterContent();
  }, [bookId, chapterNumber]);
  
  const handleVerseSelect = (verseId: string) => {
    setSelectedVerseId(verseId === selectedVerseId ? null : verseId);
  };
  
  const handleFontSizeChange = (size: 'small' | 'medium' | 'large') => {
    setFontSize(size);
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
    const isSelected = selectedVerseId === verse.id;
    
    return (
      <div key={verse.id} className="mb-2">
        <BibleVerse 
          verse={verse} 
          isSelected={isSelected} 
        />
      </div>
    );
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold font-oldstyle text-scripture-heading dark:text-scripture-heading-dark">
          {chapterContent.book_name} {chapterNumber}
        </h1>
        
        <FontSizeControl onFontSizeChange={handleFontSizeChange} />
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
