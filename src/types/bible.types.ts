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
