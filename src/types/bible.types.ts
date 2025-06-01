export interface BibleBook {
  book_id: string;
  name: string;
  testament: 'old' | 'new';
  chapters_count: number;
  position: number;
  version_id: string;
  order: number;
}

export interface BibleVersion {
  id: string;
  name: string;
  language: string;
  language_name?: string;
  description?: string;
}

export interface BibleChapter {
  id: string;
  book_id: string;
  chapter_number: number;
  book_name?: string;
  verses: BibleVerse[];
  verses_count: number;
  version_id: string;
}

export interface BibleVerse {
  id: string;
  chapter_id: string;
  verse_number: number;
  text: string;
}

export interface BookContent {
  id: string;
  book_id: string;
  book_name?: string;
  chapter_number: number;
  verses: BibleVerse[];
}

export interface ReadingPosition {
  book_id: string;
  chapter: number;
  verse?: number;
  version_id: string;
  timestamp: string;
}

export interface UserProfile {
  id?: string;
  user_id?: string;
  display_name: string;
  avatar_url?: string;
  preferred_language: string;
  preferred_bible_version: string;
  daily_reading_goal: number;
  created_at?: string;
  updated_at?: string;
  reading_position?: ReadingPosition;
  has_completed_onboarding?: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  total: number;
  points: number;
  unlocked: boolean;
  unlockedAt?: string | null;
  earned: boolean;
  category: string;
  earned_at?: string;
  maxProgress: number;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  points: number;
  completed: boolean;
}

export interface SavedVerse {
  id: string;
  user_id: string;
  book_id: string;
  chapter_number: number;
  verse_number: number;
  version_id: string;
  notes?: string;
  note?: string;
  highlight_color?: string;
  created_at: string;
}

export interface ReadingHistory {
  id?: string;
  version_id: string;
  book_id: string;
  chapter_number: number;
  verse_number?: number;
  chapter?: number; // For backward compatibility
  timestamp: string;
  created_at: string;
  source?: 'scroll' | 'click' | 'search'; // New field to track reading source
}
