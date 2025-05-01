
// This file re-exports all bible-related functionality from other modules
import { bookIdMapping, reverseBookIdMapping } from '../utils/bible-mappings';
import { getChapterMock } from '../utils/bible-mocks';
import { getVersionInfo, getBookName } from '../utils/bible-utils';
import { 
  getAllBooks, 
  getAllVersions,
  getChapter 
} from './BibleDataService';
import {
  importInitialVersions,
  importCompleteVersion
} from './BibleImportService';

// Types need to be exported with 'export type' when isolatedModules is enabled
export type { BibleBook } from '../types/bible.types';
export type { BibleVersion } from '../types/bible.types';
export type { BibleChapter } from '../types/bible.types';
  
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
  
  // Import services
  importInitialVersions,
  importCompleteVersion
};
