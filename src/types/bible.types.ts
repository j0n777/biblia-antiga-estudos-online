
export type BibleBook = {
  version_id: string;
  book_id: string;
  name: string;
  testament: 'old' | 'new';
  chapters_count: number;
  position: number;
};

export type BibleVersion = {
  id: string;
  name: string;
  language: string;
  language_name: string;
  is_original: boolean;
  original_language?: 'hebrew' | 'greek' | 'aramaic';
};

export type BibleChapter = {
  id: string;
  version_id: string;
  book_id: string;
  book_name: string;
  chapter_number: number;
  verses: {
    id: string;
    verse_number: number;
    text: string;
  }[];
  version: BibleVersion;
  originalLanguage: 'hebrew' | 'greek' | 'aramaic';
};

export type BibleVerse = {
  id: string;
  chapter_id: string;
  version_id: string;
  book_id: string;
  chapter_number: number;
  verse_number: number;
  text: string;
};

export type WordDefinition = {
  original: string;
  transliteration?: string;
  definition: string;
  strongsNumber?: string;
};
