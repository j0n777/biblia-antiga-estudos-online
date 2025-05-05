
import React, { useState, useEffect } from 'react';
import { BookContent, BibleChapter as BibleChapterType, BibleVerse as BibleVerseType } from '@/types/bible.types';
import { getBookContent } from '@/services/BibleDataService';
import BibleVerseComponent from './BibleVerse';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from 'next-themes';

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
  
  useEffect(() => {
    const fetchChapterContent = async () => {
      if (bookId && chapterNumber) {
        try {
          const content = await getBookContent(bookId, chapterNumber);
          setChapterContent(content);
        } catch (error) {
          console.error("Error fetching chapter content:", error);
          setChapterContent(null);
        }
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
  
  useEffect(() => {
    // Scroll to verse if specified
    if (scrollToVerse && chapterContent) {
      setTimeout(() => {
        const verseElement = document.getElementById(`verse-${scrollToVerse}`);
        if (verseElement) {
          verseElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300); // Small delay to ensure rendering is complete
    }
  }, [scrollToVerse, chapterContent]);

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
    return (
      <div className="animate-pulse flex flex-col items-center justify-center h-[50vh]">
        <div className="w-12 h-12 rounded-full bg-parchment-dark/40 mb-4"></div>
        <div className="h-4 w-36 bg-parchment-dark/40 rounded mb-2"></div>
        <div className="h-3 w-24 bg-parchment-dark/30 rounded"></div>
      </div>
    );
  }

  const renderVerse = (verse: BibleVerseType) => {
    const isSelected = isVerseSelected ? isVerseSelected(verse.verse_number) : selectedVerseId === verse.id;
    const isHighlighted = scrollToVerse === verse.verse_number;
    
    return (
      <div 
        id={`verse-${verse.verse_number}`} 
        key={verse.id} 
        className={`mb-3 p-2 rounded-lg transition-all ${isHighlighted ? 'bg-amber-100/50 dark:bg-amber-900/20' : ''}`}
      >
        <BibleVerseComponent 
          verse={verse}
          isHighlighted={isSelected}
          onVerseClick={() => handleVerseClick(verse.verse_number)}
        />
      </div>
    );
  };
  
  return (
    <div className="px-2 py-4 md:px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold font-oldstyle text-scripture-heading">
          {chapterContent.book_name} {chapterContent.chapter_number}
        </h1>
      </div>
      
      <div className="pb-20">
        <div className={`font-ancient ${getFontSizeClass()} text-scripture-text dark:text-scripture-text-dark px-2 py-2`}>
          {chapterContent.verses && chapterContent.verses.length > 0 ? (
            <div className="space-y-1">
              {chapterContent.verses.map(renderVerse)}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-parchment-dark/20 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">📖</span>
              </div>
              <p>{t('bible.tryAnotherChapter')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BibleChapter;
