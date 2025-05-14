
export interface BibleVersion {
  id: string;
  name: string;
  language: string;
  language_name: string;
  original_language?: string;
  is_original?: boolean;
  description?: string; // Added for OnboardingWizard
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
  original?: string; // Added for BibleVerse component
  transliteration?: string; // Added for BibleVerse component
  strongs_number?: string; // Added for BibleVerse component
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
  criteria?: string;
  category?: string; // Added for AchievementList filtering
  unlocked?: boolean; // Added for AchievementList
  unlockedAt?: string; // Added for AchievementList
  progress?: number; // Added for progress tracking
  total?: number; // Added for progress tracking
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
  note?: string; // Added for backward compatibility
  created_at: Date | string;
  highlight_color?: string; // Added for HistoryDialog
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
  title?: string; // Added for DailyChallenges component
  is_completed?: boolean; // Added for DailyChallenges component
  expires_at?: string; // Added for DailyChallenges component
  progress?: number; // Added for DailyChallenges component
  target_value?: number;
  type?: string;
  icon?: string; // Added for DailyChallenges component
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
  nickname?: string; // Added for ProfileForm
  country?: string; // Added for ProfileForm
  birth_year?: number; // Added for ProfileForm
  phone?: string; // Added for ProfileForm
  avatar_url?: string; // Added for Leaderboard 
  experience_points?: number; // Added for Leaderboard
  streak_count?: number; // Added for DailyChallenges
  streak_record?: number; // Added for DailyChallenges
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
  id?: string; // Added for Leaderboard component
  rank?: number; // Added for Leaderboard component
  avatar_url?: string; // Added for Leaderboard component
  nickname?: string; // Added for Leaderboard component
  experience_points?: number; // Added for Leaderboard component
  streak_count?: number; // Added for Leaderboard component
}

export interface BibleStudy {
  id: string;
  title: string | any; // Support for JSON title format
  title_key?: string;
  description: string;
  lessons: StudyLesson[];
  created_at: Date | string;
  updated_at: Date | string;
  content?: any; // Added for BibleStudy components
  points?: number; // Added for BibleStudy components
  icon?: string; // Added for BibleStudy components
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
  chapter?: number; // Backward compatibility for some components
}
