
// This file re-exports all bible-related functionality from other modules
import { bookIdMapping, reverseBookIdMapping } from '../utils/bible-mappings';
import { getChapterMock } from '../utils/bible-mocks';
import { getVersionInfo, getBookName } from '../utils/bible-utils';
import { 
  getAllBooks, 
  getAllVersions,
  getChapter,
  searchBibleVerses
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

// Types need to be exported with 'export type' when isolatedModules is enabled
export type { BibleBook } from '../types/bible.types';
export type { BibleVersion } from '../types/bible.types';
export type { BibleChapter } from '../types/bible.types';
export type { BibleVerse } from '../types/bible.types';
export type { WordDefinition } from '../types/bible.types';
export type { ReadingPosition } from '../types/bible.types';
export type { Achievement } from '../types/bible.types';
  
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
  
  // Import services
  importInitialVersions,
  importCompleteVersion,
  
  // Reading services
  saveReadingPosition,
  getLastReadingPosition,
  clearReadingPosition
};
