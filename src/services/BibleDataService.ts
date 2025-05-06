
// This file now re-exports from the new modularized bible services
// This maintains backward compatibility with existing code
export {
  getAllBooks,
  getBibleBooks,
  getBookChapters,
  getBooksByTestament,
  getAllVersions,
  getVersionsByLanguage,
  getVersionsGroupedByLanguage,
  getBookContent,
  getChapter,
  searchBibleVerses
} from './bible';
