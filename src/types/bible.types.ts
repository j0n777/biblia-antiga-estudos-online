
export interface BibleVersion {
  id: string;
  name: string;
  language: string;
  description?: string;
}

export interface BibleBook {
  book_id: string;
  name: string;
  testament: string;
  order: number;
  chapters_count?: number; // Added for compatibility
  position?: number; // Added for compatibility
  version_id?: string; // Added for compatibility
}

export interface BibleChapter {
  book_id: string;
  chapter_number: number;
  id?: string; // Added for compatibility
  book_name?: string; // Added for compatibility
  verses?: BibleVerse[]; // Added for compatibility
}

export interface BibleVerse {
  id: string;
  book_id: string;
  chapter_number: number;
  verse_number: number;
  text: string;
  version_id: string;
  book_name?: string; // Added for compatibility
  chapter_id?: string; // Added for compatibility
}

export interface BookContent {
  id: string;
  book_id: string;
  chapter_number: number;
  verses: BibleVerse[];
  book_name?: string;
}

export interface WordDefinition {
  original: string;
  transliteration: string;
  definition: string;
  strongs_number: string;
}

export interface ReadingPosition {
  book_id: string;
  chapter: number;
  verse?: number;
  version_id?: string;
}

export interface BibleStudy {
  id: string;
  title: string | { [key: string]: string };
  title_key?: string;
  content: string | { [key: string]: string } | { content: { [key: string]: string } };
  description?: string | { [key: string]: string }; // Added for compatibility
  created_at: string;
  updated_at: string;
  points: number;
  next_study_id?: string;
  icon?: string; // Added for compatibility
}

export interface UserProfile {
  id: string;
  user_id?: string;
  display_name: string;
  nickname: string;
  experience_points: number;
  streak_count: number;
  streak_record: number;
  last_streak_date: string | null;
  created_at: string;
  updated_at: string;
  font_size: 'small' | 'medium' | 'large';
  reading_position: string | null;
  avatar_url?: string;
  preferred_language?: string;
  preferred_bible_version?: string;
  daily_reading_goal?: number;
  has_completed_onboarding?: boolean;
  country?: string; // Added for compatibility
  birth_year?: number; // Added for compatibility
  email?: string; // Added for compatibility
  phone?: string; // Added for compatibility
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  icon: string;
  created_at: string;
  updated_at: string;
  name?: string; // Added for compatibility
  category?: string; // Added for compatibility
  unlocked?: boolean; // Added for compatibility
  progress?: number; // Added for compatibility
  total?: number; // Added for compatibility
  maxProgress?: number; // Added for compatibility
  unlockedAt?: string; // Added for compatibility
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  points: number;
  type: string;
  target_value: number;
  is_completed: boolean;
  expires_at: string;
}

export type Challenge = DailyChallenge;

export interface LeaderboardEntry {
  id: string;
  display_name: string;
  nickname: string;
  experience_points: number;
  streak_count: number;
  avatar_url?: string;
  rank: number;
}

export interface SavedVerse {
  id: string;
  user_id: string;
  book_id: string;
  chapter_number: number;
  verse_number: number;
  note?: string;
  highlight_color?: string;
  created_at: string;
  updated_at: string;
}

export interface ReadingHistory {
  id?: string;
  user_id?: string;
  book_id: string;
  chapter: number;
  verse?: number;
  timestamp: string;
}

export interface UserStudyProgress {
  id: string;
  user_id: string;
  study_id: string;
  completed: boolean;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}
