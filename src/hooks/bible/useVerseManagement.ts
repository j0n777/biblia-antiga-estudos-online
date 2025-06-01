
import { useState } from 'react';

interface UseVerseManagementProps {
  initialBookId: string;
  initialChapterNumber: number;
}

/**
 * Hook responsible for verse-level interactions like:
 * - Tracking which verses are saved/highlighted
 * - Saving verses to user's collection
 * - Setting which verse to scroll to
 */
export const useVerseManagement = ({ 
  initialBookId = '',
  initialChapterNumber = 1 
}: UseVerseManagementProps = {
  initialBookId: '',
  initialChapterNumber: 1
}) => {
  const [scrollToVerse, setScrollToVerse] = useState<number | null>(null);
  const [savedVerses, setSavedVerses] = useState<Record<string, boolean>>({});

  /**
   * Handles saving a verse to user's collection
   * Uses dynamic import to avoid circular dependencies
   * Updates the local state to reflect saved status
   */
  const handleSaveVerse = async (bookId: string, chapterNumber: number, verseNumber: number, versionId: string) => {
    const verseKey = `${bookId}-${chapterNumber}-${verseNumber}`;
    
    try {
      // Import saveVerse dynamically to avoid circular dependencies
      const { saveVerse } = await import('@/services/VersesService');
      
      // Check if verse is already saved - if so, remove it
      if (savedVerses[verseKey]) {
        console.log('Removing verse highlight:', verseKey);
        // For now, we'll just remove it from local state
        // In a full implementation, you'd also call a removeVerse API
        setSavedVerses({
          ...savedVerses,
          [verseKey]: false
        });
        return true;
      } else {
        // Save the verse
        console.log('Saving verse:', verseKey);
        const success = await saveVerse(bookId, chapterNumber, verseNumber, versionId, "yellow");
        
        if (success) {
          setSavedVerses({
            ...savedVerses,
            [verseKey]: true
          });
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error saving verse:', error);
      return false;
    }
  };

  /**
   * Checks if a verse is currently saved/selected by the user
   */
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
