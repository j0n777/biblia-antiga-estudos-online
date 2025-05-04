
// This file re-exports all bible-related functionality from other modules
import { bookIdMapping, reverseBookIdMapping } from '../utils/bible-mappings';
import { getChapterMock } from '../utils/bible-mocks';
import { getVersionInfo, getBookName } from '../utils/bible-utils';
import { 
  getAllBooks, 
  getAllVersions,
  getChapter,
  searchBibleVerses,
  getBookContent
} from './BibleDataService';
import {
  importInitialVersions,
  importCompleteVersion
} from './BibleImportService';
import {
  saveReadingPosition,
  getLastReadingPosition,
  clearReadingPosition
} from './ReadingService';

// Export all types
export type {
  BibleBook,
  BibleVersion,
  BibleChapter,
  BibleVerse,
  WordDefinition,
  ReadingPosition,
  Achievement,
  UserStudyProgress,
  SavedVerse,
  BookContent,
  DailyChallenge,
  UserProfile,
  LeaderboardEntry,
  BibleStudy
} from '../types/bible.types';
  
// Mappings
export {
  bookIdMapping,
  reverseBookIdMapping,
  
  // Mock data
  getChapterMock,
  
  // Utilities
  getVersionInfo,
  getBookName,
  
  // Data services
  getAllBooks,
  getAllVersions,
  getChapter,
  searchBibleVerses,
  getBookContent,
  
  // Import services
  importInitialVersions,
  importCompleteVersion,
  
  // Reading services
  saveReadingPosition,
  getLastReadingPosition,
  clearReadingPosition
};
