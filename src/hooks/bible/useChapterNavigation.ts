
import { useState } from 'react';
import { BibleBook } from '@/types/bible.types';

interface UseChapterNavigationProps {
  books: BibleBook[];
  initialBookId: string;
  initialChapterNumber: number;
}

/**
 * Hook responsible for navigating between chapters and books
 * Handles:
 * - Moving to previous/next chapter within the same book
 * - Moving to previous book's last chapter or next book's first chapter when navigating past book boundaries
 * - Keeping track of current book ID and chapter number
 */
export const useChapterNavigation = ({ 
  books = [],
  initialBookId = '',
  initialChapterNumber = 1
}: UseChapterNavigationProps = {
  books: [],
  initialBookId: '',
  initialChapterNumber: 1
}) => {
  const [bookId, setBookId] = useState<string>(initialBookId);
  const [chapterNumber, setChapterNumber] = useState<number>(initialChapterNumber);
  
  /**
   * Handle changing the current book
   * Always resets chapter to 1 when changing books
   */
  const handleBookChange = (newBookId: string) => {
    setBookId(newBookId);
    setChapterNumber(1);
    return { newBookId, newChapterNumber: 1 };
  };

  /**
   * Handle changing the current chapter within the same book
   */
  const handleChapterChange = (newChapterNumber: number) => {
    setChapterNumber(newChapterNumber);
    return { bookId, newChapterNumber };
  };

  /**
   * Navigate to the previous chapter
   * If at first chapter of current book, go to last chapter of previous book
   * Returns null if already at the first chapter of the first book
   */
  const handlePreviousChapter = () => {
    if (!books || books.length === 0) return null;
    
    // Find the current book in the list
    const currentBookIndex = books.findIndex(book => book.book_id === bookId);
    if (currentBookIndex === -1) return null;
    
    const currentBook = books[currentBookIndex];
    
    // If we're not at chapter 1, go to the previous chapter of the same book
    if (chapterNumber > 1) {
      const newChapterNumber = chapterNumber - 1;
      setChapterNumber(newChapterNumber);
      return { bookId, newChapterNumber };
    }
    
    // If we're at chapter 1, go to the last chapter of the previous book
    if (currentBookIndex > 0) {
      const previousBook = books[currentBookIndex - 1];
      const newBookId = previousBook.book_id;
      const newChapterNumber = previousBook.chapters_count || 1;
      setBookId(newBookId);
      setChapterNumber(newChapterNumber);
      return { newBookId, newChapterNumber };
    }
    
    return null;
  };
  
  /**
   * Navigate to the next chapter
   * If at last chapter of current book, go to first chapter of next book
   * Returns null if already at the last chapter of the last book
   */
  const handleNextChapter = () => {
    if (!books || books.length === 0) return null;
    
    // Find the current book in the list
    const currentBookIndex = books.findIndex(book => book.book_id === bookId);
    if (currentBookIndex === -1) return null;
    
    const currentBook = books[currentBookIndex];
    
    // If we're not at the last chapter, go to the next chapter of the same book
    if (chapterNumber < (currentBook.chapters_count || 1)) {
      const newChapterNumber = chapterNumber + 1;
      setChapterNumber(newChapterNumber);
      return { bookId, newChapterNumber };
    }
    
    // If we're at the last chapter, go to the first chapter of the next book
    if (currentBookIndex < books.length - 1) {
      const nextBook = books[currentBookIndex + 1];
      const newBookId = nextBook.book_id;
      const newChapterNumber = 1;
      setBookId(newBookId);
      setChapterNumber(newChapterNumber);
      return { newBookId, newChapterNumber };
    }
    
    return null;
  };

  return {
    bookId,
    chapterNumber,
    setBookId,
    setChapterNumber,
    handleBookChange,
    handleChapterChange,
    handlePreviousChapter,
    handleNextChapter
  };
};
