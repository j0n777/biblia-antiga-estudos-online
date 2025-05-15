export interface BibleVersion {
  id: string;
  name: string;
  language: string;
  language_name: string;
  original_language?: string;
  is_original?: boolean;
  description?: string;
}

export interface BibleBook {
  book_id: string;
  name: string;
  testament: 'old' | 'new';
  chapters_count: number;
  position: number;
  version_id: string;
  order: number;
}

export interface BibleChapter {
  id: string;
  book_id: string;
  chapter_number: number;
  book_name?: string;
  verses?: BibleVerse[];
  verses_count?: number;
  version_id: string;
}

export interface BibleVerse {
  id: string;
  book_id: string;
  chapter_id: string;
  chapter_number: number;
  verse_number: number;
  text: string;
  version_id: string;
  book_name?: string;
}

export interface WordDefinition {
  id: string;
  word: string;
  definition: string;
  language: string;
  original?: string;
  transliteration?: string;
  strongs_number?: string;
}

export interface ReadingPosition {
  book_id: string;
  chapter: number;
  verse?: number;
  version_id: string;
  timestamp?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  points: number;
  icon: string;
  criteria?: string;
  category?: string;
  unlocked?: boolean;
  unlockedAt?: string;
  progress?: number;
  total?: number;
  earned?: boolean;
  earned_at?: string;
  maxProgress?: number;
  title?: string;
}

export interface UserStudyProgress {
  user_id: string;
  study_id: string;
  completed_lessons: number;
  last_accessed: Date;
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
  created_at: Date | string;
  saved_at?: Date | string;
  highlight_color?: string;
}

export interface BookContent {
  id: string;
  book_id: string;
  book_name: string;
  chapter_number: number;
  verses: BibleVerse[];
}

export interface DailyChallenge {
  id: string;
  date?: Date;
  verse_id?: string;
  description: string;
  points: number;
  title?: string;
  is_completed?: boolean;
  expires_at?: string;
  progress?: number;
  target_value?: number;
  type?: string;
  icon?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  expires_at?: string;
  is_completed?: boolean;
  progress?: number;
}

export interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  preferred_language: string;
  preferred_bible_version: string;
  daily_reading_goal?: number;
  created_at: string;
  updated_at: string;
  last_active?: Date;
  profile_picture_url?: string;
  reading_streak?: number;
  has_completed_onboarding: boolean;
  nickname?: string;
  country?: string;
  birth_year?: number;
  phone?: string;
  avatar_url?: string;
  experience_points?: number;
  streak_count?: number;
  streak_record?: number;
  font_size?: 'small' | 'medium' | 'large';
  reading_position?: ReadingPosition | null | string;
  last_streak_date?: string | null;
  username?: string;
}

export interface LeaderboardEntry {
  user_id: string;
  display_name: string;
  points: number;
  profile_picture_url?: string;
  id?: string;
  rank?: number;
  avatar_url?: string;
  nickname?: string;
  experience_points?: number;
  streak_count?: number;
}

export interface BibleStudy {
  id: string;
  title: string | any;
  title_key?: string;
  description: string;
  lessons: StudyLesson[];
  created_at: Date | string;
  updated_at: Date | string;
  content?: any;
  points?: number;
  icon?: string;
}

export interface StudyLesson {
  id: string;
  study_id: string;
  title: string;
  content: string;
  order: number;
  created_at: Date;
  updated_at: Date;
}

export interface ReadingHistory {
  id?: string;
  user_id?: string;
  book_id: string;
  chapter_number: number;
  created_at: string;
  read_at?: string;
  version_id?: string;
  timestamp?: string;
  chapter?: number;
  verse_number?: number;
}
