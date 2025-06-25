export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      achievements: {
        Row: {
          category: string
          created_at: string
          description: string
          icon: string
          id: string
          name: string
          points: number
          requirement_type: string
          requirement_value: string | null
          title: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          icon?: string
          id?: string
          name: string
          points?: number
          requirement_type: string
          requirement_value?: string | null
          title: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          icon?: string
          id?: string
          name?: string
          points?: number
          requirement_type?: string
          requirement_value?: string | null
          title?: string
        }
        Relationships: []
      }
      ai_bible_studies: {
        Row: {
          book_id: string
          chapter_number: number
          cost_usd: number | null
          created_at: string
          id: string
          status: string
          study_content: Json
          tokens_used: number | null
          user_id: string
          verse_number: number
          verse_reference: string
          verse_text: string
          version_id: string
        }
        Insert: {
          book_id: string
          chapter_number: number
          cost_usd?: number | null
          created_at?: string
          id?: string
          status?: string
          study_content: Json
          tokens_used?: number | null
          user_id: string
          verse_number: number
          verse_reference: string
          verse_text: string
          version_id: string
        }
        Update: {
          book_id?: string
          chapter_number?: number
          cost_usd?: number | null
          created_at?: string
          id?: string
          status?: string
          study_content?: Json
          tokens_used?: number | null
          user_id?: string
          verse_number?: number
          verse_reference?: string
          verse_text?: string
          version_id?: string
        }
        Relationships: []
      }
      bible_books: {
        Row: {
          book_id: string
          chapters_count: number
          name: string
          position: number
          testament: string
          version_id: string
        }
        Insert: {
          book_id: string
          chapters_count: number
          name: string
          position: number
          testament: string
          version_id?: string
        }
        Update: {
          book_id?: string
          chapters_count?: number
          name?: string
          position?: number
          testament?: string
          version_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_bible_books_version"
            columns: ["version_id"]
            isOneToOne: false
            referencedRelation: "bible_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      bible_chapters: {
        Row: {
          book_id: string
          chapter_number: number
          id: string
          verses_count: number
          version_id: string
        }
        Insert: {
          book_id: string
          chapter_number: number
          id?: string
          verses_count: number
          version_id: string
        }
        Update: {
          book_id?: string
          chapter_number?: number
          id?: string
          verses_count?: number
          version_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bible_chapters_book_fk"
            columns: ["version_id", "book_id"]
            isOneToOne: false
            referencedRelation: "bible_books"
            referencedColumns: ["version_id", "book_id"]
          },
        ]
      }
      bible_studies: {
        Row: {
          category: string
          content: Json
          created_at: string | null
          icon: string | null
          id: string
          next_study_id: string | null
          points: number | null
          title: Json
          title_key: string
        }
        Insert: {
          category: string
          content: Json
          created_at?: string | null
          icon?: string | null
          id?: string
          next_study_id?: string | null
          points?: number | null
          title: Json
          title_key: string
        }
        Update: {
          category?: string
          content?: Json
          created_at?: string | null
          icon?: string | null
          id?: string
          next_study_id?: string | null
          points?: number | null
          title?: Json
          title_key?: string
        }
        Relationships: []
      }
      bible_verses: {
        Row: {
          book_id: string
          chapter_id: string
          chapter_number: number
          id: string
          text: string
          verse_number: number
          version_id: string
        }
        Insert: {
          book_id: string
          chapter_id: string
          chapter_number: number
          id?: string
          text: string
          verse_number: number
          version_id: string
        }
        Update: {
          book_id?: string
          chapter_id?: string
          chapter_number?: number
          id?: string
          text?: string
          verse_number?: number
          version_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bible_verses_chapter_fk"
            columns: ["version_id", "book_id", "chapter_number"]
            isOneToOne: false
            referencedRelation: "bible_chapters"
            referencedColumns: ["version_id", "book_id", "chapter_number"]
          },
        ]
      }
      bible_versions: {
        Row: {
          id: string
          is_original: boolean
          language: string
          language_name: string
          name: string
          original_language: string | null
        }
        Insert: {
          id: string
          is_original?: boolean
          language: string
          language_name: string
          name: string
          original_language?: string | null
        }
        Update: {
          id?: string
          is_original?: boolean
          language?: string
          language_name?: string
          name?: string
          original_language?: string | null
        }
        Relationships: []
      }
      bible_word_definitions: {
        Row: {
          created_at: string | null
          definition: string
          definition_es: string | null
          definition_fr: string | null
          definition_pt: string | null
          etymology: string | null
          id: string
          language: string
          part_of_speech: string | null
          pronunciation: string | null
          strongs_number: string | null
          strongs_type: string | null
          transliteration: string | null
          updated_at: string | null
          usage_notes: string | null
          word: string
        }
        Insert: {
          created_at?: string | null
          definition: string
          definition_es?: string | null
          definition_fr?: string | null
          definition_pt?: string | null
          etymology?: string | null
          id?: string
          language: string
          part_of_speech?: string | null
          pronunciation?: string | null
          strongs_number?: string | null
          strongs_type?: string | null
          transliteration?: string | null
          updated_at?: string | null
          usage_notes?: string | null
          word: string
        }
        Update: {
          created_at?: string | null
          definition?: string
          definition_es?: string | null
          definition_fr?: string | null
          definition_pt?: string | null
          etymology?: string | null
          id?: string
          language?: string
          part_of_speech?: string | null
          pronunciation?: string | null
          strongs_number?: string | null
          strongs_type?: string | null
          transliteration?: string | null
          updated_at?: string | null
          usage_notes?: string | null
          word?: string
        }
        Relationships: []
      }
      bible_word_mappings: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          id: string
          source_book_id: string
          source_chapter_number: number
          source_verse_number: number
          source_version_id: string
          source_word: string
          source_word_position: number
          strongs_number: string | null
          target_version_id: string
          target_word: string
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          source_book_id: string
          source_chapter_number: number
          source_verse_number: number
          source_version_id: string
          source_word: string
          source_word_position: number
          strongs_number?: string | null
          target_version_id: string
          target_word: string
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          source_book_id?: string
          source_chapter_number?: number
          source_verse_number?: number
          source_version_id?: string
          source_word?: string
          source_word_position?: number
          strongs_number?: string | null
          target_version_id?: string
          target_word?: string
        }
        Relationships: []
      }
      book_completions: {
        Row: {
          book_id: string
          chapters_completed: number
          completed_at: string
          id: string
          user_id: string
          version_id: string
        }
        Insert: {
          book_id: string
          chapters_completed: number
          completed_at?: string
          id?: string
          user_id: string
          version_id: string
        }
        Update: {
          book_id?: string
          chapters_completed?: number
          completed_at?: string
          id?: string
          user_id?: string
          version_id?: string
        }
        Relationships: []
      }
      followers: {
        Row: {
          created_at: string | null
          follower_id: string | null
          following_id: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          follower_id?: string | null
          following_id?: string | null
          id?: string
        }
        Update: {
          created_at?: string | null
          follower_id?: string | null
          following_id?: string | null
          id?: string
        }
        Relationships: []
      }
      highlights: {
        Row: {
          book_id: string
          chapter_number: number
          color: string
          created_at: string | null
          id: string
          user_id: string | null
          verse_number: number
        }
        Insert: {
          book_id: string
          chapter_number: number
          color: string
          created_at?: string | null
          id?: string
          user_id?: string | null
          verse_number: number
        }
        Update: {
          book_id?: string
          chapter_number?: number
          color?: string
          created_at?: string | null
          id?: string
          user_id?: string | null
          verse_number?: number
        }
        Relationships: []
      }
      notes: {
        Row: {
          book_id: string
          chapter_number: number
          content: string
          created_at: string | null
          id: string
          is_public: boolean | null
          updated_at: string | null
          user_id: string | null
          verse_number: number
        }
        Insert: {
          book_id: string
          chapter_number: number
          content: string
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          updated_at?: string | null
          user_id?: string | null
          verse_number: number
        }
        Update: {
          book_id?: string
          chapter_number?: number
          content?: string
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          updated_at?: string | null
          user_id?: string | null
          verse_number?: number
        }
        Relationships: []
      }
      reading_sessions: {
        Row: {
          chapters_read: number | null
          created_at: string
          id: string
          reading_time_minutes: number | null
          session_date: string
          updated_at: string
          user_id: string
          verses_read: number | null
          xp_earned: number | null
        }
        Insert: {
          chapters_read?: number | null
          created_at?: string
          id?: string
          reading_time_minutes?: number | null
          session_date: string
          updated_at?: string
          user_id: string
          verses_read?: number | null
          xp_earned?: number | null
        }
        Update: {
          chapters_read?: number | null
          created_at?: string
          id?: string
          reading_time_minutes?: number | null
          session_date?: string
          updated_at?: string
          user_id?: string
          verses_read?: number | null
          xp_earned?: number | null
        }
        Relationships: []
      }
      saved_verses: {
        Row: {
          book_id: string
          chapter_number: number
          highlight_color: string | null
          id: string
          note: string | null
          saved_at: string | null
          user_id: string | null
          verse_number: number
          version_id: string
        }
        Insert: {
          book_id: string
          chapter_number: number
          highlight_color?: string | null
          id?: string
          note?: string | null
          saved_at?: string | null
          user_id?: string | null
          verse_number: number
          version_id: string
        }
        Update: {
          book_id?: string
          chapter_number?: number
          highlight_color?: string | null
          id?: string
          note?: string | null
          saved_at?: string | null
          user_id?: string | null
          verse_number?: number
          version_id?: string
        }
        Relationships: []
      }
      share_likes: {
        Row: {
          created_at: string | null
          id: string
          share_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          share_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          share_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "share_likes_share_id_fkey"
            columns: ["share_id"]
            isOneToOne: false
            referencedRelation: "shares"
            referencedColumns: ["id"]
          },
        ]
      }
      shares: {
        Row: {
          book_id: string
          chapter_number: number
          comment: string | null
          created_at: string | null
          id: string
          likes_count: number | null
          user_id: string | null
          verse_numbers: number[]
        }
        Insert: {
          book_id: string
          chapter_number: number
          comment?: string | null
          created_at?: string | null
          id?: string
          likes_count?: number | null
          user_id?: string | null
          verse_numbers: number[]
        }
        Update: {
          book_id?: string
          chapter_number?: number
          comment?: string | null
          created_at?: string | null
          id?: string
          likes_count?: number | null
          user_id?: string | null
          verse_numbers?: number[]
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          earned_at: string
          id: string
          is_completed: boolean | null
          progress: number | null
          user_id: string
        }
        Insert: {
          achievement_id: string
          earned_at?: string
          id?: string
          is_completed?: boolean | null
          progress?: number | null
          user_id: string
        }
        Update: {
          achievement_id?: string
          earned_at?: string
          id?: string
          is_completed?: boolean | null
          progress?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          birth_year: number | null
          country: string | null
          created_at: string | null
          current_streak: number | null
          display_name: string | null
          email: string | null
          experience_points: number | null
          font_size: string | null
          id: string
          last_streak_date: string | null
          longest_streak: number | null
          nickname: string | null
          phone: string | null
          preferred_bible_version: string | null
          preferred_language: string | null
          streak_count: number | null
          streak_freeze_count: number | null
          total_xp: number | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          birth_year?: number | null
          country?: string | null
          created_at?: string | null
          current_streak?: number | null
          display_name?: string | null
          email?: string | null
          experience_points?: number | null
          font_size?: string | null
          id: string
          last_streak_date?: string | null
          longest_streak?: number | null
          nickname?: string | null
          phone?: string | null
          preferred_bible_version?: string | null
          preferred_language?: string | null
          streak_count?: number | null
          streak_freeze_count?: number | null
          total_xp?: number | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          birth_year?: number | null
          country?: string | null
          created_at?: string | null
          current_streak?: number | null
          display_name?: string | null
          email?: string | null
          experience_points?: number | null
          font_size?: string | null
          id?: string
          last_streak_date?: string | null
          longest_streak?: number | null
          nickname?: string | null
          phone?: string | null
          preferred_bible_version?: string | null
          preferred_language?: string | null
          streak_count?: number | null
          streak_freeze_count?: number | null
          total_xp?: number | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      user_study_credits: {
        Row: {
          created_at: string
          free_studies_reset_month: string
          free_studies_used_this_month: number
          id: string
          paid_studies_remaining: number
          subscription_expires_at: string | null
          subscription_type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          free_studies_reset_month?: string
          free_studies_used_this_month?: number
          id?: string
          paid_studies_remaining?: number
          subscription_expires_at?: string | null
          subscription_type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          free_studies_reset_month?: string
          free_studies_used_this_month?: number
          id?: string
          paid_studies_remaining?: number
          subscription_expires_at?: string | null
          subscription_type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_study_progress: {
        Row: {
          completed_at: string | null
          id: string
          points_earned: number | null
          study_id: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          id?: string
          points_earned?: number | null
          study_id?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          id?: string
          points_earned?: number | null
          study_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_study_progress_study_id_fkey"
            columns: ["study_id"]
            isOneToOne: false
            referencedRelation: "bible_studies"
            referencedColumns: ["id"]
          },
        ]
      }
      word_definition_cache: {
        Row: {
          created_at: string | null
          definition_data: Json
          expires_at: string | null
          id: string
          language: string
          version_id: string
          word: string
        }
        Insert: {
          created_at?: string | null
          definition_data: Json
          expires_at?: string | null
          id?: string
          language: string
          version_id: string
          word: string
        }
        Update: {
          created_at?: string | null
          definition_data?: Json
          expires_at?: string | null
          id?: string
          language?: string
          version_id?: string
          word?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_and_award_achievements: {
        Args: { user_uuid: string }
        Returns: undefined
      }
      clean_expired_word_cache: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      reset_monthly_free_studies: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_user_streak_and_xp: {
        Args: { user_uuid: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
