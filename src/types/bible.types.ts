export interface BibleVersion {
  id: string;
  name: string;
  language: string;
  language_name: string;
  original_language?: string;
  is_original?: boolean;
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
}

export interface ReadingPosition {
  book_id: string;
  chapter: number;
  verse: number;
  version_id: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  points: number;
  icon: string;
  criteria: string;
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
  created_at: Date;
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
  date: Date;
  verse_id: string;
  description: string;
  points: number;
}

export interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  preferred_language: string;
  preferred_bible_version: string;
  daily_reading_goal: number;
  created_at: Date;
  updated_at: Date;
  last_active: Date;
  profile_picture_url?: string;
  reading_streak?: number;
  has_completed_onboarding: boolean;
}

export interface LeaderboardEntry {
  user_id: string;
  display_name: string;
  points: number;
  profile_picture_url?: string;
}

export interface BibleStudy {
  id: string;
  title: string;
  description: string;
  lessons: StudyLesson[];
  created_at: Date;
  updated_at: Date;
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
  version_id: string;
  book_id: string;
  chapter_number: number;
  verse_number: number;
  timestamp: string;
}
