
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
  original_language?: string; // Changed from specific values to string
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
  originalLanguage: string; // Changed to match BibleVersion.original_language
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

// Reading position types
export type ReadingPosition = {
  version_id: string;
  book_id: string;
  chapter_number: number;
  verse_number?: number;
  timestamp: Date;
};

// Achievement system types
export type AchievementCategory = 'book' | 'testament' | 'streak' | 'milestone' | 'challenge';

export type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  unlockedAt?: Date;
  category: AchievementCategory;
};

export type UserProfile = {
  id: string;
  display_name?: string;
  nickname?: string;
  avatar_url?: string;
  country?: string;
  birth_year?: number;
  preferred_language?: string;
  preferred_bible_version?: string;
  experience_points: number;
  streak_count: number;
  last_streak_date?: Date;
};

export type DailyChallenge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  book_category: string;
  chapters_required: number;
  progress?: number;
  completed?: boolean;
};

export type LeaderboardEntry = {
  id: string;
  nickname: string | null;
  avatar_url: string | null;
  experience_points: number;
  streak_count: number;
  achievements_count: number;
  rank: number;
};
