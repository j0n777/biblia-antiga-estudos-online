
export type BibleBook = {
  id: string;
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
  book: string;
  bookName: string;
  chapter: number;
  verses: {
    number: number;
    text: string;
  }[];
  version: BibleVersion;
  originalLanguage: 'hebrew' | 'greek' | 'aramaic';
};
