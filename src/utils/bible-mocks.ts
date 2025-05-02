
import { BibleChapter, BibleVersion } from '../types/bible.types';
import { reverseBookIdMapping } from './bible-mappings';

// Generate mock Bible chapter data for testing and fallback
export const getChapterMock = (
  bookId: string, 
  chapterNumber: number, 
  versionId = 'kja'
): BibleChapter => {
  // Default version info
  const versionInfo: Record<string, BibleVersion> = {
    'kja': {
      id: 'kja',
      name: 'King James Atualizada',
      language: 'pt-br',
      language_name: 'Português',
      is_original: false,
      original_language: null
    },
    'kjv': {
      id: 'kjv',
      name: 'King James Version',
      language: 'en',
      language_name: 'English',
      is_original: false,
      original_language: null
    },
    'rvr': {
      id: 'rvr',
      name: 'Reina Valera',
      language: 'es',
      language_name: 'Español',
      is_original: false,
      original_language: null
    },
    'heb': {
      id: 'heb',
      name: 'Hebrew Bible',
      language: 'he',
      language_name: 'Hebrew',
      is_original: true,
      original_language: 'hebrew'
    },
    'grc': {
      id: 'grc',
      name: 'Greek New Testament',
      language: 'el',
      language_name: 'Greek',
      is_original: true,
      original_language: 'greek'
    }
  };
  
  // Get version or fallback to KJA
  const version = versionInfo[versionId] || versionInfo['kja'];
  
  // Get the proper book name from mappings
  const bookName = reverseBookIdMapping[bookId] || 'Unknown Book';
  
  // Define original language based on testament
  const isNewTestament = ['matthew', 'mark', 'luke', 'john', 'acts', 'romans', '1corinthians', '2corinthians', 'galatians', 
    'ephesians', 'philippians', 'colossians', '1thessalonians', '2thessalonians', '1timothy', '2timothy', 'titus', 
    'philemon', 'hebrews', 'james', '1peter', '2peter', '1john', '2john', '3john', 'jude', 'revelation'].includes(bookId);

  const originalLanguage = isNewTestament ? 'greek' : 'hebrew';

  // Generate mock verses
  const versesCount = Math.floor(Math.random() * 30) + 10; // Random between 10-40 verses
  const verses = [];
  for (let i = 1; i <= versesCount; i++) {
    verses.push({
      id: `${bookId}-${chapterNumber}-${i}-${versionId}`, // Fixed: Added id field
      verse_number: i, // Fixed: Changed from number to verse_number
      text: `Este é um versículo de exemplo para ${bookName} ${chapterNumber}:${i}. Isso é apenas um texto de marcação usado quando a conexão com o banco de dados falha.`
    });
  }
  
  return {
    id: `${bookId}-${chapterNumber}-${versionId}`,
    book_id: bookId,
    book_name: bookName,
    chapter_number: chapterNumber,
    version_id: versionId,
    verses: verses,
    version: version,
    originalLanguage: originalLanguage
  };
};
