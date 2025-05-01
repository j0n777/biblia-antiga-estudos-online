
// This file re-exports all bible-related functionality from other modules
import { BibleBook, BibleVersion, BibleChapter } from '../types/bible.types';
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

export {
  // Types
  BibleBook,
  BibleVersion,
  BibleChapter,
  
  // Mappings
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
