import React, { useState, useEffect, useRef } from 'react';
import { BookContent, BibleChapter as BibleChapterType } from '@/types/bible.types';
import { getBookContent } from '@/services/BibleDataService';
import BibleVerseComponent from './BibleVerse';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/components/ThemeProvider';
import { getUserProfile } from '@/services/ProfileService';
import { determineBestBibleVersion } from '@/utils/language-utils';

interface BibleChapterProps {
  bookId?: string;
  chapterNumber?: number;
  chapter?: BibleChapterType;
  scrollToVerse?: number | null;
  onVerseAction?: (verseNumber: number) => Promise<void> | void;
  isVerseSelected?: (verseNumber: number) => boolean;
  fontSize?: 'large' | 'extra-large' | 'huge';
  versionId?: string;
}

const BibleChapter: React.FC<BibleChapterProps> = ({ 
  bookId, 
  chapterNumber, 
  chapter,
  scrollToVerse,
  onVerseAction,
  isVerseSelected,
  fontSize = 'large',
  versionId
}) => {
  const [chapterContent, setChapterContent] = useState<BookContent | null>(null);
  const [selectedVerseId, setSelectedVerseId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  
  // Use ref to track fetch status
  const isFetchingRef = useRef<boolean>(false);
  
  useEffect(() => {
    // Skip if we already have chapter directly provided
    if (chapter) {
      // Format directly provided chapter as BookContent
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
    
    // Skip if missing required props
    if (!bookId || !chapterNumber) {
      return;
    }
    
    // Skip if already fetching
    if (isFetchingRef.current) {
      return;
    }
    
    const fetchChapterContent = async () => {
      try {
        isFetchingRef.current = true;
        
        // Get user's preferred Bible version
        const userProfile = await getUserProfile();
        
        // Use explicitly provided versionId, or determine best one based on user profile
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
      case 'large':
        return 'text-lg';
      case 'extra-large':
        return 'text-xl';
      case 'huge':
        return 'text-2xl';
      default:
        return 'text-lg';
    }
  };
  
  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center p-4">
        <div className="w-16 h-16 bg-parchment-dark/20 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">📖</span>
        </div>
        <p className="text-scripture-heading font-medium mb-2">{loadError}</p>
        <p className="text-sm text-muted-foreground">
          {t('bible.tryAnotherChapter')}
        </p>
      </div>
    );
  }
  
  if (!chapterContent) {
    return (
      <div className="animate-pulse flex flex-col items-center justify-center h-[50vh]">
        <div className="w-12 h-12 rounded-full bg-parchment-dark/40 mb-4"></div>
        <div className="h-4 w-36 bg-parchment-dark/40 rounded mb-2"></div>
        <div className="h-3 w-24 bg-parchment-dark/30 rounded"></div>
      </div>
    );
  }

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
