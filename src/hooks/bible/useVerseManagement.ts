
import { useState } from 'react';

interface UseVerseManagementProps {
  initialBookId: string;
  initialChapterNumber: number;
}

export const useVerseManagement = ({ 
  initialBookId = '',
  initialChapterNumber = 1 
}: UseVerseManagementProps = {}) => {
  const [scrollToVerse, setScrollToVerse] = useState<number | null>(null);
  const [savedVerses, setSavedVerses] = useState<Record<string, boolean>>({});

  const handleSaveVerse = async (bookId: string, chapterNumber: number, verseNumber: number, versionId: string) => {
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

  const isVerseSelected = (bookId: string, chapterNumber: number, verseNumber: number) => {
    const verseKey = `${bookId}-${chapterNumber}-${verseNumber}`;
    return savedVerses[verseKey] || false;
  };

  return {
    scrollToVerse,
    setScrollToVerse,
    handleSaveVerse,
    isVerseSelected,
    savedVerses
  };
};
