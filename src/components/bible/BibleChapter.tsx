import React, { useState, useEffect, useRef } from 'react';
import { BookContent, BibleChapter as BibleChapterType } from '@/types/bible.types';
import { getBookContent } from '@/services/BibleDataService';
import BibleVerseComponent from './BibleVerse';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/components/ThemeProvider';
import { getUserProfile } from '@/services/ProfileService';
import { determineBestBibleVersion } from '@/utils/language-utils';
import { useVerseVisibility } from '@/hooks/bible/useVerseVisibility';
import { saveReadingPosition } from '@/services';
import { trackReading } from '@/services/reading/ReadingHistoryService';

interface BibleChapterProps {
  bookId?: string;
  chapterNumber?: number;
  chapter?: BibleChapterType;
  scrollToVerse?: number | null;
  onVerseAction?: (verseNumber: number) => Promise<void> | void;
  isVerseSelected?: (verseNumber: number) => boolean;
  fontSize?: 'large' | 'extra-large' | 'huge';
  versionId?: string;
  onCurrentVerseChange?: (verseNumber: number) => void;
}

const BibleChapter: React.FC<BibleChapterProps> = ({ 
  bookId, 
  chapterNumber, 
  chapter,
  scrollToVerse,
  onVerseAction,
  isVerseSelected,
  fontSize = 'large',
  versionId,
  onCurrentVerseChange
}) => {
  const [chapterContent, setChapterContent] = useState<BookContent | null>(null);
  const [selectedVerseId, setSelectedVerseId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [currentReadingVerse, setCurrentReadingVerse] = useState<number>(1);
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  
  const isFetchingRef = useRef<boolean>(false);
  const verseElementsRef = useRef<Map<number, HTMLElement>>(new Map());
  
  const handleVerseVisible = React.useCallback((verseNumber: number) => {
    if (verseNumber !== currentReadingVerse) {
      setCurrentReadingVerse(verseNumber);
      if (onCurrentVerseChange) {
        onCurrentVerseChange(verseNumber);
      }
      
      if (bookId && chapterNumber && versionId) {
        saveReadingPosition(versionId, bookId, chapterNumber, verseNumber);
        trackReading(versionId, bookId, chapterNumber, verseNumber, 'scroll');
      }
    }
  }, [currentReadingVerse, onCurrentVerseChange, bookId, chapterNumber, versionId]);
  
  const { observeVerse, unobserveVerse } = useVerseVisibility({
    onVerseVisible: handleVerseVisible
  });
  
  useEffect(() => {
    if (chapter) {
      const contentWithId = {
        id: chapter.id || `${chapter.book_id}-${chapter.chapter_number}`,
        book_id: chapter.book_id,
        book_name: chapter.book_name,
        chapter_number: chapter.chapter_number,
        verses: chapter.verses || []
      };
      setChapterContent(contentWithId);
      setLoadError(null);
      return;
    }
    
    if (!bookId || !chapterNumber) {
      return;
    }
    
    if (isFetchingRef.current) {
      return;
    }
    
    const fetchChapterContent = async () => {
      try {
        isFetchingRef.current = true;
        
        const userProfile = await getUserProfile();
        const bibleVersionId = versionId || 
          determineBestBibleVersion(userProfile, language);
        
        console.log(`Loading chapter content: ${bookId} ${chapterNumber} (${bibleVersionId})`);
        
        const content = await getBookContent(bookId, chapterNumber, bibleVersionId);
        setChapterContent(content);
        setLoadError(null);
      } catch (error) {
        console.error("Error fetching chapter content:", error);
        setChapterContent(null);
        setLoadError(`Não foi possível carregar o capítulo. Tente outra versão da Bíblia.`);
      } finally {
        isFetchingRef.current = false;
      }
    };
    
    fetchChapterContent();
  }, [bookId, chapterNumber, chapter, language, versionId]);
  
  useEffect(() => {
    if (scrollToVerse && chapterContent) {
      setTimeout(() => {
        const verseElement = document.getElementById(`verse-${scrollToVerse}`);
        if (verseElement) {
          verseElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  }, [scrollToVerse, chapterContent]);

  useEffect(() => {
    if (chapterContent && chapterContent.verses) {
      const timeout = setTimeout(() => {
        chapterContent.verses.forEach(verse => {
          const element = document.getElementById(`verse-${verse.verse_number}`);
          if (element) {
            verseElementsRef.current.set(verse.verse_number, element);
            observeVerse(element, verse.verse_number);
          }
        });
      }, 500);

      return () => {
        clearTimeout(timeout);
        verseElementsRef.current.forEach((element) => {
          unobserveVerse(element);
        });
        verseElementsRef.current.clear();
      };
    }
  }, [chapterContent, observeVerse, unobserveVerse]);

  const handleVerseSelect = (verseId: string) => {
    setSelectedVerseId(verseId === selectedVerseId ? null : verseId);
  };
  
  const handleVerseClick = async (verseNumber: number) => {
    if (bookId && chapterNumber && versionId) {
      await trackReading(versionId, bookId, chapterNumber, verseNumber, 'click');
    }
    
    if (onVerseAction) {
      await onVerseAction(verseNumber);
    }
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'large':
        return 'text-lg leading-8';
      case 'extra-large':
        return 'text-xl leading-9';
      case 'huge':
        return 'text-2xl leading-10';
      default:
        return 'text-lg leading-8';
    }
  };
  
  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center p-4">
        <div className="w-16 h-16 bg-bible-title/20 rounded-xl flex items-center justify-center mb-4">
          <span className="text-2xl">📖</span>
        </div>
        <p className="text-bible-title font-medium mb-2">{loadError}</p>
        <p className="text-sm text-bible-subtitle">
          {t('bible.tryAnotherChapter')}
        </p>
      </div>
    );
  }
  
  if (!chapterContent) {
    return (
      <div className="animate-pulse flex flex-col items-center justify-center h-[50vh]">
        <div className="w-12 h-12 rounded-xl bg-bible-title/40 mb-4"></div>
        <div className="h-4 w-36 bg-bible-title/40 rounded-lg mb-2"></div>
        <div className="h-3 w-24 bg-bible-title/30 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="px-3 pb-6">
      <div className="pb-20">
        <div className={`${getFontSizeClass()} text-gray-800 font-serif leading-relaxed`}>
          {chapterContent?.verses && chapterContent.verses.length > 0 ? (
            <div className="space-y-1">
              {chapterContent.verses.map((verse, index) => {
                const isSelected = isVerseSelected ? isVerseSelected(verse.verse_number) : selectedVerseId === verse.id;
                const isHighlighted = scrollToVerse === verse.verse_number;
                const isCurrentlyReading = currentReadingVerse === verse.verse_number;
                const isFirstVerse = index === 0;
                
                return (
                  <BibleVerseComponent
                    key={verse.id}
                    verse={verse}
                    isHighlighted={isSelected}
                    onVerseClick={() => handleVerseClick(verse.verse_number)}
                    fontSize={fontSize}
                    isFirstVerse={isFirstVerse}
                  />
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-bible-title/20 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">📖</span>
              </div>
              <p className="text-bible-title">{t('bible.tryAnotherChapter')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BibleChapter;
