import React, { useState, useEffect } from 'react';
import { BookContent, BibleChapter as BibleChapterType, BibleVerse as BibleVerseType } from '@/types/bible.types';
import { getBookContent } from '@/services/BibleDataService';
import BibleVerseComponent from './BibleVerse';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from 'next-themes';
import { useIsMobile } from '@/hooks/use-mobile';
import { getUserProfile } from '@/services/ProfileService';

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
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const fetchChapterContent = async () => {
      if (bookId && chapterNumber) {
        try {
          // Get user's preferred Bible version
          const userProfile = await getUserProfile();
          const versionId = userProfile.preferred_bible_version || 
            (language === 'en' ? 'kjv' : language === 'es' ? 'rvr' : language === 'fr' ? 'apee' : 'kja');
          
          const content = await getBookContent(bookId, chapterNumber, versionId);
          setChapterContent(content);
        } catch (error) {
          console.error("Error fetching chapter content:", error);
          setChapterContent(null);
        }
      } else if (chapter) {
        // If we have a chapter object directly, format it as BookContent
        const contentWithId = {
          id: chapter.id || `${chapter.book_id}-${chapter.chapter_number}`,
          book_id: chapter.book_id,
          book_name: chapter.book_name,
          chapter_number: chapter.chapter_number,
          verses: chapter.verses || []
        };
        setChapterContent(contentWithId);
      }
    };
    
    fetchChapterContent();
  }, [bookId, chapterNumber, chapter, language]);
  
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
        className={`mb-3 p-1 rounded-lg transition-all ${isHighlighted ? 'bg-amber-100/50 dark:bg-amber-900/20' : ''}`}
      >
        <BibleVerseComponent 
          verse={verse}
          isHighlighted={isSelected}
          onVerseClick={() => onVerseAction && onVerseAction(verse.verse_number)}
        />
      </div>
    );
  };
  
  return (
    <div className="px-1 py-4 md:px-2">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold font-oldstyle text-scripture-heading">
          {chapterContent.book_name} {chapterContent.chapter_number}
        </h1>
      </div>
      
      <div className="pb-20">
        <div className={`font-ancient ${getFontSizeClass()} text-scripture-text dark:text-scripture-text px-1 py-1 md:px-2 md:py-2`}>
          {chapterContent.verses && chapterContent.verses.length > 0 ? (
            <div className="space-y-1">
              {chapterContent.verses.map((verse) => {
                const isSelected = isVerseSelected ? isVerseSelected(verse.verse_number) : selectedVerseId === verse.id;
                const isHighlighted = scrollToVerse === verse.verse_number;
                
                return (
                  <div 
                    id={`verse-${verse.verse_number}`} 
                    key={verse.id} 
                    className={`mb-3 p-1 rounded-lg transition-all ${isHighlighted ? 'bg-amber-100/50 dark:bg-amber-900/20' : ''}`}
                  >
                    <BibleVerseComponent 
                      verse={verse}
                      isHighlighted={isSelected}
                      onVerseClick={() => onVerseAction && onVerseAction(verse.verse_number)}
                    />
                  </div>
                );
              })}
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
