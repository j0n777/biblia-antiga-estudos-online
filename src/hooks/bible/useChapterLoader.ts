
import { useState, useEffect, useRef } from 'react';
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
  const [loadingStarted, setLoadingStarted] = useState<boolean>(false);
  const loadedRef = useRef<{bookId: string, chapterNumber: number, versionId: string} | null>(null);

  // This effect controls when to load the chapter
  useEffect(() => {
    const shouldLoadChapter = 
      !isInitialLoad && // Don't load until initial position is set
      bookId && // Must have a valid book ID
      chapterNumber > 0 && // Must have a valid chapter number
      !loadingStarted; // Prevent duplicate loads
    
    // Only load if params have changed
    const hasChanged = !loadedRef.current || 
      loadedRef.current.bookId !== bookId || 
      loadedRef.current.chapterNumber !== chapterNumber || 
      loadedRef.current.versionId !== versionId;
      
    if (shouldLoadChapter && hasChanged) {
      console.log(`Starting to load chapter: ${bookId} ${chapterNumber}`);
      setLoadingStarted(true);
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
    try {
      setIsLoading(true);
      console.log(`Loading chapter data: ${bookId} ${chapterNumber} (${versionId})`);
      
      // Load chapter data
      const chapterData = await getChapter(bookId, chapterNumber, versionId);
      setChapter(chapterData);
      
      // Update the loadedRef to track what we've loaded
      loadedRef.current = {
        bookId,
        chapterNumber,
        versionId
      };
      
      // Track reading progress - convert scrollToVerse to number or default to 1
      const verseToTrack = scrollToVerse || 1;
      
      // Track reading progress
      await trackReading(
        versionId, 
        bookId, 
        chapterNumber, 
        verseToTrack
      );
      
      // Save reading position to storage
      await saveReadingPosition(
        versionId, 
        bookId, 
        chapterNumber, 
        verseToTrack
      );
      
    } catch (error) {
      console.error('Error loading data:', error);
      setChapter(null);
    } finally {
      setIsLoading(false);
      setLoadingStarted(false); // Reset loading state to allow future loads
    }
  };

  return {
    chapter,
    isLoading,
    loadChapter
  };
};
