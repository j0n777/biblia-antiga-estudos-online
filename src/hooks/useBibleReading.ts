
import { useState, useEffect, useCallback, useRef } from 'react';
import { BibleBook, BibleChapter, BibleVersion } from '@/types/bible.types';
import { getAllBooks, getAllVersions } from '@/services/BibleDataService';
import { useReadingPosition } from './bible/useReadingPosition';
import { useChapterNavigation } from './bible/useChapterNavigation';
import { useVerseManagement } from './bible/useVerseManagement';
import { useChapterLoader } from './bible/useChapterLoader';
import { useSearchParams } from 'react-router-dom';

interface UseBibleReadingProps {
  defaultVersion?: string;
}

/**
 * Main hook that orchestrates all Bible reading functionality
 */
export const useBibleReading = ({ defaultVersion = 'kja' }: UseBibleReadingProps = {}) => {
  const [books, setBooks] = useState<BibleBook[]>([]);
  const [versions, setVersions] = useState<BibleVersion[]>([]);
  const [searchParams] = useSearchParams();
  const [booksLoaded, setBooksLoaded] = useState<boolean>(false);
  const dataLoadedRef = useRef<boolean>(false);

  // Load books and versions from the data service only once
  useEffect(() => {
    // Skip if already loaded
    if (dataLoadedRef.current) {
      return;
    }
    
    const loadBooksAndVersions = async () => {
      try {
        console.log('Loading Bible books and versions...');
        dataLoadedRef.current = true;
        
        // Use a default array if getAllBooks returns null or empty
        const booksData = await getAllBooks(defaultVersion);
        if (booksData && booksData.length > 0) {
          console.log(`Loaded ${booksData.length} books successfully`);
          setBooks(booksData);
        } else {
          // Provide fallback data if loading fails
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
            },
            { 
              book_id: 'ex',
              name: 'Exodus',
              testament: 'old',
              chapters_count: 40,
              position: 2,
              version_id: defaultVersion,
              order: 2
            }
          ];
          setBooks(fallbackBooks);
        }
        
        // Set versions data
        const versionsData = await getAllVersions();
        if (versionsData && versionsData.length > 0) {
          setVersions(versionsData);
        } else {
          // Provide fallback version data if loading fails
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
        
        // Mark books as loaded
        setBooksLoaded(true);
      } catch (error) {
        console.error('Error loading books and versions:', error);
        
        // Even on error, provide fallback data so the app can function
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
        
        // Mark books as loaded even on error
        setBooksLoaded(true);
        dataLoadedRef.current = false; // Allow retrying on error
      }
    };
    
    loadBooksAndVersions();
  }, [defaultVersion]);

  // Initialize reading position from URL or stored preferences
  // Only initialize once books are loaded
  const {
    bookId,
    chapterNumber,
    versionId,
    scrollToVerse,
    isInitialLoad,
    setBookId,
    setChapterNumber,
    setVersionId,
    setScrollToVerse
  } = useReadingPosition({ 
    defaultVersion, 
    books,
    booksLoaded // Pass the booksLoaded flag to prevent initialization before books are ready
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

  // Verse management logic
  const {
    isVerseSelected: verseIsSelected,
    handleSaveVerse: verseSaveVerse,
  } = useVerseManagement({
    initialBookId: bookId,
    initialChapterNumber: chapterNumber
  });
  
  // Load chapter data
  const { chapter, isLoading } = useChapterLoader({
    bookId,
    chapterNumber,
    versionId,
    scrollToVerse,
    isInitialLoad
  });
  
  // Wrapper functions to ensure state is properly updated across all hooks
  const handleBookChange = useCallback((newBookId: string) => {
    const result = navigationHandleBookChange(newBookId);
    setBookId(result.newBookId);
    setChapterNumber(result.newChapterNumber);
    setScrollToVerse(1);
  }, [navigationHandleBookChange, setBookId, setChapterNumber, setScrollToVerse]);

  const handleChapterChange = useCallback((newChapterNumber: number) => {
    const result = navigationHandleChapterChange(newChapterNumber);
    setChapterNumber(result.newChapterNumber);
    setScrollToVerse(1);
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

  // Return a unified API for Bible reading components
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
    setScrollToVerse,
    handlePreviousChapter,
    handleNextChapter,
    handleBookChange,
    handleChapterChange,
    handleVersionChange,
    handleSaveVerse,
    isVerseSelected
  };
};
