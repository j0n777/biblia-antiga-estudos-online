
import { useState, useEffect } from 'react';
import { BibleChapter } from '@/types/bible.types';
import { getChapter } from '@/services/BibleDataService';
import { saveReadingPosition } from '@/services';
import { trackReading } from '@/services';
import { useSearchParams } from 'react-router-dom';

interface UseChapterLoaderProps {
  bookId: string;
  chapterNumber: number;
  versionId: string;
  scrollToVerse: number | null;
  isInitialLoad: boolean;
}

/**
 * Hook responsible for loading chapter content and tracking reading progress
 * Handles:
 * - Fetching chapter data from API
 * - Tracking reading progress
 * - Updating URL parameters
 * - Saving reading position to storage
 */
export const useChapterLoader = ({
  bookId,
  chapterNumber,
  versionId,
  scrollToVerse,
  isInitialLoad
}: UseChapterLoaderProps) => {
  const [chapter, setChapter] = useState<BibleChapter | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    // Only load chapter after we've initialized the reading position
    if (!isInitialLoad && bookId) {
      loadChapter();
    }
  }, [bookId, chapterNumber, versionId, isInitialLoad]);

  // Update URL when reading position changes
  useEffect(() => {
    if (!isInitialLoad && bookId) {
      const verseParam = scrollToVerse ? String(scrollToVerse) : '1';
      setSearchParams({ 
        book: bookId, 
        chapter: chapterNumber.toString(),
        version: versionId,
        verse: verseParam
      }, { replace: true });
    }
  }, [bookId, chapterNumber, versionId, scrollToVerse, setSearchParams, isInitialLoad]);

  /**
   * Load chapter content and track reading progress
   * Updates user's reading history and position
   */
  const loadChapter = async () => {
    setIsLoading(true);
    try {
      console.log(`Loading chapter: ${bookId} ${chapterNumber} (${versionId})`);
      
      // Load chapter data
      const chapterData = await getChapter(bookId, chapterNumber, versionId);
      setChapter(chapterData);
      
      // Track reading progress - use the scrollToVerse value (as number) or default to 1
      await trackReading(
        versionId, 
        bookId, 
        chapterNumber, 
        scrollToVerse || 1
      );
      
      // Save reading position to storage
      await saveReadingPosition(
        versionId, 
        bookId, 
        chapterNumber, 
        scrollToVerse || 1
      );
      
    } catch (error) {
      console.error('Error loading data:', error);
      setChapter(null);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    chapter,
    isLoading,
    loadChapter
  };
};
