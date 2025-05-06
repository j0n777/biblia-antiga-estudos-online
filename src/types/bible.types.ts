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
}

export interface BibleChapter {
  book_id: string;
  chapter_number: number;
}

export interface BibleVerse {
  id: string;
  book_id: string;
  chapter_number: number;
  verse_number: number;
  text: string;
  version_id: string;
}

export interface BibleStudy {
  id: string;
  title: string | { [key: string]: string };
  title_key?: string;
  content: string | { [key: string]: string } | { content: { [key: string]: string } };
  created_at: string;
  updated_at: string;
  points: number;
  next_study_id?: string;
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
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  icon: string;
  created_at: string;
  updated_at: string;
}

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
