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
  original_language?: string;
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
  originalLanguage: string;
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

export interface UserProfile {
  id: string;
  nickname?: string;
  display_name?: string;
  avatar_url?: string;
  country?: string;
  birth_year?: number;
  preferred_language?: string;
  preferred_bible_version?: string;
  experience_points: number;
  streak_count: number;
  last_streak_date?: Date;
  username?: string;
  created_at?: string;
  updated_at?: string;
  email?: string;
  phone?: string;
  font_size?: 'small' | 'medium' | 'large';
}

export interface DailyChallenge {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  book_category: string;
  chapters_required: number;
  progress?: number;
  completed?: boolean;
}

export interface LeaderboardEntry {
  id: string;
  nickname: string | null;
  avatar_url: string | null;
  experience_points: number;
  streak_count: number;
  achievements_count: number;
  rank: number;
}

export interface BiblicalStudy {
  id: string;
  title_key: string;
  title: Record<string, string>;
  content: Record<string, string>;
  category: string;
  points: number;
  next_study_id?: string;
  created_at?: string;
  icon?: string;
}

export interface SavedVerse {
  id: string;
  book_id: string;
  chapter_number: number;
  verse_number: number;
  version_id: string;
  saved_at: string;
  note?: string;
  highlight_color?: string;
}

export interface StudyProgress {
  id: string;
  study_id: string;
  completed_at: string;
  points_earned: number;
}
