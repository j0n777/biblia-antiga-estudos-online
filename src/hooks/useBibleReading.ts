
import { useState, useEffect } from 'react';
import { BibleBook, BibleChapter as BibleChapterType, BibleVersion } from '@/types/bible.types';
import { getChapter, getAllBooks, getAllVersions } from '@/services/BibleDataService';
import { saveReadingPosition, getLastReadingPosition } from '@/services';
import { trackReading } from '@/services';
import { useSearchParams } from 'react-router-dom';

interface UseBibleReadingProps {
  defaultVersion?: string;
}

export const useBibleReading = ({ defaultVersion = 'kja' }: UseBibleReadingProps = {}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [bookId, setBookId] = useState<string>('');
  const [chapterNumber, setChapterNumber] = useState<number>(1);
  const [books, setBooks] = useState<BibleBook[]>([]);
  const [versions, setVersions] = useState<BibleVersion[]>([]);
  const [versionId, setVersionId] = useState<string>(defaultVersion);
  const [chapter, setChapter] = useState<BibleChapterType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
  const [scrollToVerse, setScrollToVerse] = useState<number | null>(null);
  const [savedVerses, setSavedVerses] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const initializeReadingPosition = async () => {
      try {
        // First load all books and versions to ensure they're available
        const booksData = await getAllBooks(defaultVersion);
        if (booksData && booksData.length > 0) {
          setBooks(booksData);
          
          // Check URL params first
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
              const bookExists = booksData.some(book => book.book_id === lastPosition.book_id);
              if (bookExists) {
                setBookId(lastPosition.book_id);
                setChapterNumber(lastPosition.chapter || 1);
                setVersionId(lastPosition.version_id || defaultVersion);
                setScrollToVerse(lastPosition.verse || 1);
              } else {
                // Fall back to a known valid book ID from the loaded books
                const firstBook = booksData[0];
                setBookId(firstBook.book_id);
                setChapterNumber(1);
              }
            } else {
              // Default to first book in the list if no reading position
              console.log("No last reading position, using default");
              if (booksData.length > 0) {
                const firstBook = booksData[0];
                console.log("Setting default book to:", firstBook.book_id);
                setBookId(firstBook.book_id);
                setChapterNumber(1);
              } else {
                console.error("No books available in the loaded data");
              }
            }
          }
        } else {
          console.error("No books data available");
          // Set reasonable defaults
          setBookId('gn'); // Use lowercase 'gn' instead of 'GEN'
          setChapterNumber(1);
        }
        
        const versionsData = await getAllVersions();
        if (versionsData && versionsData.length > 0) {
          setVersions(versionsData);
        }

        setIsInitialLoad(false);
      } catch (error) {
        console.error('Error initializing reading position:', error);
        // Set reasonable defaults
        setBookId('gn'); // Use lowercase 'gn' instead of 'GEN'
        setChapterNumber(1);
        setVersionId(defaultVersion);
        setIsInitialLoad(false);
      }
    };

    initializeReadingPosition();
  }, [searchParams, defaultVersion]);
  
  useEffect(() => {
    // Only load chapter after we've initialized the reading position
    if (!isInitialLoad && bookId) {
      loadChapter();
    }
  }, [bookId, chapterNumber, versionId, isInitialLoad]);
  
  // Update URL when reading position changes
  useEffect(() => {
    if (!isInitialLoad && bookId) {
      const verseParam = scrollToVerse ? scrollToVerse.toString() : '1';
      setSearchParams({ 
        book: bookId, 
        chapter: chapterNumber.toString(),
        version: versionId,
        verse: verseParam
      }, { replace: true });
    }
  }, [bookId, chapterNumber, versionId, scrollToVerse, setSearchParams, isInitialLoad]);

  const loadChapter = async () => {
    setIsLoading(true);
    try {
      console.log(`Loading chapter: ${bookId} ${chapterNumber} (${versionId})`);
      
      // Load chapter
      const chapterData = await getChapter(bookId, chapterNumber, versionId);
      setChapter(chapterData);
      
      // Track reading progress
      await trackReading(bookId, chapterNumber, scrollToVerse || 1);
      await saveReadingPosition(versionId, bookId, chapterNumber, scrollToVerse || 1);
      
    } catch (error) {
      console.error('Error loading data:', error);
      setChapter(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreviousChapter = () => {
    if (!books || books.length === 0) return;
    
    // Find the current book in the list
    const currentBookIndex = books.findIndex(book => book.book_id === bookId);
    if (currentBookIndex === -1) return;
    
    const currentBook = books[currentBookIndex];
    
    // If we're not at chapter 1, go to the previous chapter of the same book
    if (chapterNumber > 1) {
      setChapterNumber(chapterNumber - 1);
      setScrollToVerse(1);
      return;
    }
    
    // If we're at chapter 1, go to the last chapter of the previous book
    if (currentBookIndex > 0) {
      const previousBook = books[currentBookIndex - 1];
      setBookId(previousBook.book_id);
      setChapterNumber(previousBook.chapters_count || 1);
      setScrollToVerse(1);
    }
  };
  
  const handleNextChapter = () => {
    if (!books || books.length === 0) return;
    
    // Find the current book in the list
    const currentBookIndex = books.findIndex(book => book.book_id === bookId);
    if (currentBookIndex === -1) return;
    
    const currentBook = books[currentBookIndex];
    
    // If we're not at the last chapter, go to the next chapter of the same book
    if (chapterNumber < (currentBook.chapters_count || 1)) {
      setChapterNumber(chapterNumber + 1);
      setScrollToVerse(1);
      return;
    }
    
    // If we're at the last chapter, go to the first chapter of the next book
    if (currentBookIndex < books.length - 1) {
      const nextBook = books[currentBookIndex + 1];
      setBookId(nextBook.book_id);
      setChapterNumber(1);
      setScrollToVerse(1);
    }
  };
  
  const handleBookChange = (newBookId: string) => {
    setBookId(newBookId);
    setChapterNumber(1);
    setScrollToVerse(1);
  };

  const handleChapterChange = (newChapterNumber: number) => {
    setChapterNumber(newChapterNumber);
    setScrollToVerse(1);
  };

  const handleVersionChange = (newVersionId: string) => {
    setVersionId(newVersionId);
  };

  const handleSaveVerse = async (verseNumber: number) => {
    const verseKey = `${bookId}-${chapterNumber}-${verseNumber}`;
    
    try {
      // Import saveVerse dynamically to avoid circular dependencies
      const { saveVerse } = await import('@/services/VersesService');
      const success = await saveVerse(bookId, chapterNumber, verseNumber, versionId, "yellow");
      
      if (success) {
        setSavedVerses({
          ...savedVerses,
          [verseKey]: true
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error saving verse:', error);
      return false;
    }
  };

  const isVerseSelected = (verseNumber: number) => {
    const verseKey = `${bookId}-${chapterNumber}-${verseNumber}`;
    return savedVerses[verseKey] || false;
  };

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
