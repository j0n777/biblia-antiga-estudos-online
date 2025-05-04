
export interface BibleStudy {
  id: string;
  title_key: string;
  title: {
    [key: string]: string; // Language code to title mapping
  };
  content: {
    [key: string]: string; // Language code to content mapping
  };
  category: string;
  points: number;
  next_study_id: string | null;
  created_at: string;
  icon: string;
}

export interface SavedVerse {
  id: string;
  user_id: string;
  book_id: string;
  chapter_number: number;
  verse_number: number;
  version_id: string;
  saved_at: string;
  note?: string;
  highlight_color?: string;
}

export interface UserStudyProgress {
  id: string;
  user_id: string;
  study_id: string;
  completed_at: string;
  points_earned: number;
}

// Add missing types
export interface BibleBook {
  book_id: string;
  name: string;
  testament: 'old' | 'new';
  chapters_count: number;
  position: number;
  version_id: string;
}

export interface BibleVersion {
  id: string;
  name: string;
  language: string;
  language_name: string;
  is_original: boolean;
  original_language?: 'hebrew' | 'greek' | 'aramaic';
}

export interface BibleChapter {
  id: string;
  version_id: string;
  book_id: string;
  book_name: string;
  chapter_number: number;
  verses: BibleVerse[];
  version: BibleVersion;
  originalLanguage: string;
}

export interface BibleVerse {
  id: string;
  chapter_id: string;
  book_id?: string;
  version_id?: string;
  chapter_number?: number;
  verse_number: number;
  text: string;
}

export interface BookContent {
  book_id: string;
  book_name: string;
  chapter_number: number;
  verses: BibleVerse[];
}

export interface WordDefinition {
  id: string;
  word: string;
  definition: string;
  language: string;
  transliteration?: string;
  strongs_number?: string;
  original?: string;
}

export interface ReadingPosition {
  version_id: string;
  book_id: string;
  chapter: number;
  verse: number;
  timestamp: string;
  chapter_number?: number; // Added for ReadingService.ts
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  progress: number;
  total: number;
  earned: boolean;
  earned_at?: string;
  category: string;
  // Added for AchievementList.tsx
  unlocked: boolean;
  maxProgress?: number;
  unlockedAt?: string;
  points: number;
  target?: number;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  points: number;
  completed: boolean;
  icon: string;
  expiry: string;
  // Added for DailyChallenges.tsx
  name: string;
  progress?: number;
  chapters_required: number;
  book_category?: string;
  target_book_id?: string;
  target_chapter?: number;
  expires_at?: string;
}

export interface UserProfile {
  id: string;
  user_id?: string;
  display_name?: string;
  nickname?: string;
  avatar_url?: string;
  email?: string;
  phone?: string;
  country?: string;
  birth_year?: number;
  experience_points: number;
  streak_count: number;
  last_streak_date?: string;
  preferred_language?: string;
  preferred_bible_version?: string;
  font_size?: 'small' | 'medium' | 'large';
  created_at?: string;
  updated_at?: string;
  username?: string;
  reading_position?: ReadingPosition | null;
  streak_record?: number; // Added for AchievementService.ts
}

export interface LeaderboardEntry {
  id: string;
  display_name?: string;
  avatar_url?: string;
  experience_points: number;
  rank: number;
  // Added for Leaderboard.tsx
  nickname?: string;
  streak_count?: number;
  achievements_count?: number;
  user_id?: string; // Added for AchievementService.ts
}
