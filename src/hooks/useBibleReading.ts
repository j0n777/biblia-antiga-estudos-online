
import { useState, useEffect, useCallback, useRef } from 'react';
import { BibleBook, BibleChapter, BibleVersion } from '@/types/bible.types';
import { getAllBooks, getAllVersions } from '@/services/BibleDataService';
import { useReadingPosition } from './bible/useReadingPosition';
import { useChapterNavigation } from './bible/useChapterNavigation';
import { useVerseManagement } from './bible/useVerseManagement';
import { useChapterLoader } from './bible/useChapterLoader';

interface UseBibleReadingProps {
  defaultVersion?: string;
}

/**
 * Main hook that orchestrates all Bible reading functionality
 */
export const useBibleReading = ({ defaultVersion = 'kja' }: UseBibleReadingProps = {}) => {
  const [books, setBooks] = useState<BibleBook[]>([]);
  const [versions, setVersions] = useState<BibleVersion[]>([]);
  const [booksLoaded, setBooksLoaded] = useState<boolean>(false);
  const [currentReadingVerse, setCurrentReadingVerse] = useState<number>(1);
  const dataLoadedRef = useRef<boolean>(false);

  // Load books and versions only once
  useEffect(() => {
    if (dataLoadedRef.current) {
      return;
    }
    
    const loadBooksAndVersions = async () => {
      try {
        console.log('Loading Bible books and versions...');
        dataLoadedRef.current = true;
        
        // Load books and versions concurrently
        const [booksData, versionsData] = await Promise.all([
          getAllBooks(defaultVersion),
          getAllVersions()
        ]);
        
        if (booksData && booksData.length > 0) {
          console.log(`Loaded ${booksData.length} books successfully`);
          setBooks(booksData);
        } else {
          console.warn('No books data returned - using fallback data');
          const fallbackBooks: BibleBook[] = [
            { 
              book_id: 'gn',
              name: 'Genesis',
              testament: 'old',
              chapters_count: 50,
              position: 1,
              version_id: defaultVersion,
              order: 1
            }
          ];
          setBooks(fallbackBooks);
        }
        
        if (versionsData && versionsData.length > 0) {
          setVersions(versionsData);
        } else {
          const fallbackVersions: BibleVersion[] = [
            {
              id: 'kja',
              name: 'King James',
              language: 'en',
              language_name: 'English'
            }
          ];
          setVersions(fallbackVersions);
        }
        
        // Mark books as loaded only after state has been updated
        setBooksLoaded(true);
      } catch (error) {
        console.error('Error loading books and versions:', error);
        
        // Provide fallback data on error
        const fallbackBooks: BibleBook[] = [
          { 
            book_id: 'gn',
            name: 'Genesis',
            testament: 'old',
            chapters_count: 50,
            position: 1,
            version_id: defaultVersion,
            order: 1
          }
        ];
        setBooks(fallbackBooks);
        
        const fallbackVersions: BibleVersion[] = [
          {
            id: 'kja',
            name: 'King James',
            language: 'en',
            language_name: 'English'
          }
        ];
        setVersions(fallbackVersions);
        
        setBooksLoaded(true);
        dataLoadedRef.current = false; // Allow retrying on error
      }
    };
    
    loadBooksAndVersions();
  }, [defaultVersion]);

  // Initialize reading position after books are loaded
  const {
    bookId,
    chapterNumber,
    versionId,
    scrollToVerse,
    isInitialLoad,
    setBookId,
    setChapterNumber,
    setVersionId,
    setScrollToVerse,
    setCurrentReadingVerse: setReadingVerse
  } = useReadingPosition({ 
    defaultVersion, 
    books,
    booksLoaded
  });
  
  // Chapter navigation logic
  const {
    handleBookChange: navigationHandleBookChange,
    handleChapterChange: navigationHandleChapterChange,
    handlePreviousChapter,
    handleNextChapter
  } = useChapterNavigation({
    books,
    initialBookId: bookId,
    initialChapterNumber: chapterNumber
  });

  // Verse management logic with useCallback to prevent unnecessary rerenders
  const {
    isVerseSelected: verseIsSelected,
    handleSaveVerse: verseSaveVerse,
  } = useVerseManagement({
    initialBookId: bookId,
    initialChapterNumber: chapterNumber
  });
  
  // Load chapter data with proper dependencies
  const { chapter, isLoading } = useChapterLoader({
    bookId,
    chapterNumber,
    versionId,
    scrollToVerse,
    isInitialLoad
  });
  
  // Handle current verse change
  const handleCurrentVerseChange = useCallback((verseNumber: number) => {
    setCurrentReadingVerse(verseNumber);
    setReadingVerse(verseNumber);
  }, [setReadingVerse]);
  
  // Wrapper functions with useCallback to prevent unnecessary rerenders
  const handleBookChange = useCallback((newBookId: string, specificChapter?: number) => {
    const result = navigationHandleBookChange(newBookId, specificChapter);
    if (result) {
      setBookId(result.newBookId);
      setChapterNumber(result.newChapterNumber);
      setScrollToVerse(1);
      setCurrentReadingVerse(1);
    }
  }, [navigationHandleBookChange, setBookId, setChapterNumber, setScrollToVerse]);

  const handleChapterChange = useCallback((newChapterNumber: number) => {
    const result = navigationHandleChapterChange(newChapterNumber);
    if (result) {
      setChapterNumber(result.newChapterNumber);
      setScrollToVerse(1);
      setCurrentReadingVerse(1);
    }
  }, [navigationHandleChapterChange, setChapterNumber, setScrollToVerse]);

  const handleVersionChange = useCallback((newVersionId: string) => {
    setVersionId(newVersionId);
  }, [setVersionId]);

  const handleSaveVerse = useCallback(async (verseNumber: number) => {
    return await verseSaveVerse(bookId, chapterNumber, verseNumber, versionId);
  }, [verseSaveVerse, bookId, chapterNumber, versionId]);

  const isVerseSelected = useCallback((verseNumber: number) => {
    return verseIsSelected(bookId, chapterNumber, verseNumber);
  }, [verseIsSelected, bookId, chapterNumber]);

  return {
    bookId,
    chapterNumber,
    versionId,
    books,
    versions,
    chapter,
    isLoading,
    isInitialLoad,
    scrollToVerse,
    currentReadingVerse,
    setScrollToVerse,
    handlePreviousChapter,
    handleNextChapter,
    handleBookChange,
    handleChapterChange,
    handleVersionChange,
    handleSaveVerse,
    isVerseSelected,
    onCurrentVerseChange: handleCurrentVerseChange
  };
};
