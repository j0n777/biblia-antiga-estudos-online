export const getBookMock = (bookId: string) => {
  return {
    book_id: bookId,
    name: `Book ${bookId}`,
    testament: bookId === 'GEN' ? 'old' : 'new',
    order: 1,
    chapters_count: bookId === 'PSA' ? 150 : 20
  };
};

export const getChapterMock = (bookId: string, chapterNumber: number): any => {
  const verses = [];
  const count = bookId === 'PSA' && chapterNumber === 119 ? 176 : 30; // Psalm 119 is the longest chapter
  
  for (let i = 1; i <= count; i++) {
    verses.push({
      id: `${bookId}-${chapterNumber}-${i}`,
      book_id: bookId,
      chapter_id: `${bookId}-${chapterNumber}`,
      chapter_number: chapterNumber,
      verse_number: i,
      text: `This is a mock verse ${i} for chapter ${chapterNumber} of ${bookId}.`,
      version_id: 'mock'
    });
  }
  
  return {
    id: `${bookId}-${chapterNumber}`,
    book_id: bookId,
    chapter_number: chapterNumber,
    verses
  };
};
