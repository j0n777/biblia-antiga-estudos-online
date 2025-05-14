import { useState, useEffect } from 'react';
import { getLastReadingPosition } from '@/services';
import { useSearchParams } from 'react-router-dom';

interface UseReadingPositionProps {
  defaultVersion?: string;
  books: any[]; // Bible books data
  booksLoaded?: boolean; // Flag indicating if books have been loaded
}

/**
 * Hook responsible for determining and managing the current reading position
 * This includes:
 * - Retrieving position from URL params
 * - Falling back to last saved reading position
 * - Initializing with reasonable defaults if needed
 */
export const useReadingPosition = ({ 
  defaultVersion = 'kja', 
  books = [],
  booksLoaded = false
}: UseReadingPositionProps) => {
  const [searchParams] = useSearchParams();
  const [bookId, setBookId] = useState<string>('');
  const [chapterNumber, setChapterNumber] = useState<number>(1);
  const [versionId, setVersionId] = useState<string>(defaultVersion);
  const [scrollToVerse, setScrollToVerse] = useState<number | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);

  useEffect(() => {
    // Only initialize reading position when books are loaded or directly provided
    if (!booksLoaded || books.length === 0) {
      console.log("Waiting for books to load before initializing reading position");
      return;
    }
    
    // This function initializes the reading position from either:
    // 1. URL parameters (highest priority)
    // 2. Last saved reading position from storage
    // 3. Default to first book if nothing else is available
    const initializeReadingPosition = async () => {
      try {
        console.log("Initializing reading position with books:", books.length);
        
        // Check URL params first (highest priority)
        const urlBook = searchParams.get('book');
        const urlChapter = searchParams.get('chapter');
        const urlVersion = searchParams.get('version');
        const urlVerse = searchParams.get('verse');
        
        if (urlBook && urlChapter) {
          // Use URL parameters if available
          setBookId(urlBook);
          setChapterNumber(parseInt(urlChapter, 10));
          if (urlVersion) setVersionId(urlVersion);
          if (urlVerse) setScrollToVerse(parseInt(urlVerse, 10));
        } else {
          // Otherwise try to get last reading position
          const lastPosition = await getLastReadingPosition();
          if (lastPosition && lastPosition.book_id) {
            console.log("Loading last reading position:", lastPosition);
            // Validate that the book exists in our data
            const bookExists = books.some(book => book.book_id === lastPosition.book_id);
            if (bookExists) {
              setBookId(lastPosition.book_id);
              setChapterNumber(lastPosition.chapter || 1);
              setVersionId(lastPosition.version_id || defaultVersion);
              setScrollToVerse(lastPosition.verse || 1);
            } else {
              // Fall back to a known valid book ID from the loaded books
              const firstBook = books[0];
              console.log("Book not found in data, using first available:", firstBook.book_id);
              setBookId(firstBook.book_id);
              setChapterNumber(1);
            }
          } else {
            // Default to first book in the list if no reading position
            console.log("No last reading position, using default");
            if (books.length > 0) {
              const firstBook = books[0];
              console.log("Setting default book to:", firstBook.book_id);
              setBookId(firstBook.book_id);
              setChapterNumber(1);
            } else {
              console.error("No books available in the loaded data");
              // Set hardcoded default as last resort
              setBookId('gn');
              setChapterNumber(1);
            }
          }
        }
        
        // Mark initialization as complete
        setIsInitialLoad(false);
      } catch (error) {
        console.error('Error initializing reading position:', error);
        // Set reasonable defaults on error
        setBookId('gn');
        setChapterNumber(1);
        setVersionId(defaultVersion);
        setIsInitialLoad(false);
      }
    };

    initializeReadingPosition();
  }, [searchParams, books, defaultVersion, booksLoaded]);

  return {
    bookId,
    chapterNumber,
    versionId,
    scrollToVerse,
    isInitialLoad,
    setBookId,
    setChapterNumber,
    setVersionId,
    setScrollToVerse
  };
};
