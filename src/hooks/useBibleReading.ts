
import { useState, useEffect } from 'react';
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
 * 
 * This hook coordinates between several specialized hooks:
 * - useReadingPosition: Manages the current reading position (book, chapter, verse)
 * - useChapterNavigation: Handles navigation between chapters and books
 * - useVerseManagement: Manages verse-level interactions like saving and highlighting
 * - useChapterLoader: Handles loading chapter content and tracking reading progress
 * 
 * The main hook's responsibilities:
 * - Loading books and versions data
 * - Initializing the specialized hooks with proper parameters
 * - Providing a unified API for the Bible reading UI components
 * - Coordinating actions that span multiple specialized hooks
 */
export const useBibleReading = ({ defaultVersion = 'kja' }: UseBibleReadingProps = {}) => {
  const [books, setBooks] = useState<BibleBook[]>([]);
  const [versions, setVersions] = useState<BibleVersion[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();

  // Load books and versions from the data service
  useEffect(() => {
    const loadBooksAndVersions = async () => {
      try {
        const booksData = await getAllBooks(defaultVersion);
        if (booksData && booksData.length > 0) {
          setBooks(booksData);
        }
        
        const versionsData = await getAllVersions();
        if (versionsData && versionsData.length > 0) {
          setVersions(versionsData);
        }
      } catch (error) {
        console.error('Error loading books and versions:', error);
      }
    };
    
    loadBooksAndVersions();
  }, [defaultVersion]);

  // Initialize reading position from URL or stored preferences
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
  } = useReadingPosition({ defaultVersion, books });
  
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
  /**
   * Change the current book
   * Updates both chapter navigation state and reading position
   */
  const handleBookChange = (newBookId: string) => {
    const result = navigationHandleBookChange(newBookId);
    setBookId(result.newBookId);
    setChapterNumber(result.newChapterNumber);
    setScrollToVerse(1);
  };

  /**
   * Change the current chapter within the same book
   * Updates both chapter navigation state and reading position
   */
  const handleChapterChange = (newChapterNumber: number) => {
    const result = navigationHandleChapterChange(newChapterNumber);
    setChapterNumber(result.newChapterNumber);
    setScrollToVerse(1);
  };

  /**
   * Change the Bible version
   * Updates reading position state
   */
  const handleVersionChange = (newVersionId: string) => {
    setVersionId(newVersionId);
  };

  /**
   * Save a verse to user's collection
   * Uses verse management hook with current book/chapter context
   */
  const handleSaveVerse = async (verseNumber: number) => {
    return await verseSaveVerse(bookId, chapterNumber, verseNumber, versionId);
  };

  /**
   * Check if a verse is currently saved/selected by the user
   * Uses verse management hook with current book/chapter context
   */
  const isVerseSelected = (verseNumber: number) => {
    return verseIsSelected(bookId, chapterNumber, verseNumber);
  };

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
