
import { BibleChapter, BibleVersion } from '../types/bible.types';

export function getChapterMock(
  bookId: string = 'JHN',
  chapterNumber: number = 1,
  versionId: string = 'kja'
): BibleChapter {
  // Example mock data
  const mockVerses = [
    {
      id: '1',
      chapter_id: 'mock-chapter',
      verse_number: 1,
      text: 'No princípio era o Verbo, e o Verbo estava com Deus, e o Verbo era Deus.'
    },
    {
      id: '2',
      chapter_id: 'mock-chapter',
      verse_number: 2,
      text: 'Ele estava no princípio com Deus.'
    },
    {
      id: '3',
      chapter_id: 'mock-chapter',
      verse_number: 3,
      text: 'Todas as coisas foram feitas por ele, e sem ele nada do que foi feito se fez.'
    }
  ];
  
  const mockVersion: BibleVersion = {
    id: versionId,
    name: 'King James Atualizada',
    language: 'pt-BR',
    language_name: 'Portuguese',
    is_original: false
  };
  
  return {
    id: 'mock-chapter',
    version_id: versionId,
    book_id: bookId,
    book_name: 'João',
    chapter_number: chapterNumber,
    verses: mockVerses,
    version: mockVersion,
    originalLanguage: 'greek'
  };
}
