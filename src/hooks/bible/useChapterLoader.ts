
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
  
  // Use refs to prevent infinite loops and track previous values
  const prevPropsRef = useRef<{
    bookId: string; 
    chapterNumber: number; 
    versionId: string;
  } | null>(null);
  
  const loadingRef = useRef<boolean>(false);
  
  // This effect controls URL updates when reading position changes
  useEffect(() => {
    if (isInitialLoad || !bookId) {
      return; // Skip URL updates during initial load
    }
    
    // Don't update URL params during loading to prevent loops
    if (loadingRef.current) {
      return;
    }
    
    const verseParam = scrollToVerse ? String(scrollToVerse) : '1';
    
    // Use replace instead of push to avoid creating browser history entries
    setSearchParams({ 
      book: bookId, 
      chapter: chapterNumber.toString(),
      version: versionId,
      verse: verseParam
    }, { replace: true });
  }, [bookId, chapterNumber, versionId, scrollToVerse, setSearchParams, isInitialLoad]);

  // This effect controls when to load the chapter
  useEffect(() => {
    // Skip if we're still in initial loading state
    if (isInitialLoad) {
      return;
    }
    
    // Skip if already loading
    if (loadingRef.current) {
      return;
    }
    
    // Skip if no valid bookId or chapter number
    if (!bookId || chapterNumber <= 0) {
      return;
    }
    
    // Check if props have changed since last load
    const prevProps = prevPropsRef.current;
    const hasPropsChanged = !prevProps || 
      prevProps.bookId !== bookId || 
      prevProps.chapterNumber !== chapterNumber || 
      prevProps.versionId !== versionId;
      
    if (hasPropsChanged) {
      console.log(`Loading chapter data: ${bookId} ${chapterNumber} (${versionId})`);
      
      // Set loading flag to prevent concurrent loads
      loadingRef.current = true;
      setIsLoading(true);
      
      // Load chapter data
      loadChapter();
    }
  }, [bookId, chapterNumber, versionId, isInitialLoad]);

  /**
   * Load chapter content and track reading progress
   * Updates user's reading history and position
   */
  const loadChapter = async () => {
    try {
      console.log(`Fetching chapter: ${bookId} ${chapterNumber}`);
      
      // Load chapter data
      const chapterData = await getChapter(bookId, chapterNumber, versionId);
      setChapter(chapterData);
      
      // Update ref with current props to prevent unnecessary reloads
      prevPropsRef.current = {
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
      console.error('Error loading chapter data:', error);
      setChapter(null);
    } finally {
      setIsLoading(false);
      loadingRef.current = false; // Reset loading flag
    }
  };

  return {
    chapter,
    isLoading,
    loadChapter
  };
};
