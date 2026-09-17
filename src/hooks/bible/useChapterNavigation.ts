import { useState, useEffect } from 'react';
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
  
  useEffect(() => {
    if (initialBookId && initialBookId !== bookId) {
      setBookId(initialBookId);
    }
  }, [initialBookId, bookId]);
  
  useEffect(() => {
    if (initialChapterNumber && initialChapterNumber !== chapterNumber) {
      setChapterNumber(initialChapterNumber);
    }
  }, [initialChapterNumber, chapterNumber]);
  
  const handleBookChange = (newBookId: string, specificChapter?: number) => {
    setBookId(newBookId);
    const targetChapter = specificChapter || 1;
    setChapterNumber(targetChapter);
    return { newBookId, newChapterNumber: targetChapter };
  };

  const handleChapterChange = (newChapterNumber: number) => {
    setChapterNumber(newChapterNumber);
    return { bookId, newChapterNumber };
  };

  const handlePreviousChapter = () => {
    if (!books || books.length === 0) return null;
    
    const currentBookIndex = books.findIndex(book => book.book_id === bookId);
    if (currentBookIndex === -1) return null;
    
    const currentBook = books[currentBookIndex];
    
    if (chapterNumber > 1) {
      const newChapterNumber = chapterNumber - 1;
      setChapterNumber(newChapterNumber);
      return { bookId, newChapterNumber };
    }
    
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
  
  const handleNextChapter = () => {
    if (!books || books.length === 0) return null;
    
    const currentBookIndex = books.findIndex(book => book.book_id === bookId);
    if (currentBookIndex === -1) return null;
    
    const currentBook = books[currentBookIndex];
    
    if (chapterNumber < (currentBook.chapters_count || 1)) {
      const newChapterNumber = chapterNumber + 1;
      setChapterNumber(newChapterNumber);
      return { bookId, newChapterNumber };
    }
    
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
