
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
  book_id?: string;
  chapter_number?: number;
  book_name?: string;
  version_id?: string;
}

export interface WordDefinition {
  id: string;
  word: string;
  original?: string;
  transliteration?: string;
  strongs_number?: string;
  definition: string;
  language: string;
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
  nickname?: string;
  email?: string;
  avatar_url?: string;
  preferred_language: string;
  preferred_bible_version: string;
  daily_reading_goal: number;
  created_at?: string;
  updated_at?: string;
  reading_position?: ReadingPosition;
  has_completed_onboarding?: boolean;
  experience_points?: number;
  streak_count?: number;
  streak_record?: number;
  last_streak_date?: string | null;
  font_size?: 'large' | 'extra-large' | 'huge';
  country?: string;
  birth_year?: number;
  phone?: string;
  username?: string;
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
  is_completed?: boolean;
  progress?: number;
  icon?: string;
  expires_at?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  completed: boolean;
  is_completed?: boolean;
  progress?: number;
  icon?: string;
  expires_at?: string;
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

export interface UserStudyProgress {
  id: string;
  user_id: string;
  study_id: string;
  completed: boolean;
  progress: number;
  completed_at?: string;
  points_earned?: number;
}

export interface LeaderboardEntry {
  id: string;
  display_name?: string;
  nickname?: string;
  avatar_url?: string;
  experience_points: number;
  streak_count?: number;
  rank: number;
}

export interface BibleStudy {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimated_time: number;
  points: number;
  icon?: string;
  content: any;
  completed?: boolean;
  progress?: number;
}
