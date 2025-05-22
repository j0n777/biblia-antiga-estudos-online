// This file now re-exports from the refactored content services
// Keeping this file for backward compatibility, but all functionality is now modularized

export {
  getBookContent,
  getChapter,
  searchBibleVerses
} from './content';
