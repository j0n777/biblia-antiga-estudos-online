
import { useState, useEffect, useRef } from 'react';
import { BibleChapter } from '@/types/bible.types';
import { getChapter } from '@/services/BibleDataService';
import { saveReadingPosition } from '@/services';

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
  
  // Use refs to prevent infinite loops and track load state
  const isLoadingRef = useRef<boolean>(false);
  const prevPropsRef = useRef<{
    bookId: string; 
    chapterNumber: number; 
    versionId: string;
  } | null>(null);
  
  // This effect controls when to load the chapter
  useEffect(() => {
    // Skip if we're still in initial loading state
    if (isInitialLoad) {
      return;
    }
    
    // Skip if no valid bookId or chapter number
    if (!bookId || chapterNumber <= 0) {
      return;
    }
    
    // Prevent concurrent loads using the ref
    if (isLoadingRef.current) {
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
      isLoadingRef.current = true;
      setIsLoading(true);
      
      // Update ref with current props to prevent unnecessary reloads
      prevPropsRef.current = {
        bookId,
        chapterNumber,
        versionId
      };
      
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
      
      // Save reading position with verse number as a number
      const verseToSave = scrollToVerse ? Number(scrollToVerse) : 1;
      
      // Save reading position to storage
      await saveReadingPosition(
        versionId, 
        bookId, 
        chapterNumber, 
        verseToSave
      );
      
    } catch (error) {
      console.error('Error loading chapter data:', error);
      setChapter(null);
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false; // Reset loading flag
    }
  };

  return {
    chapter,
    isLoading,
    loadChapter
  };
};
