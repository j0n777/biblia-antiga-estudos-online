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
      bible_verses: {
        Row: {
          book_id: string | null
          chapter_id: string
          chapter_number: number | null
          id: string
          text: string
          verse_number: number
          version_id: string | null
        }
        Insert: {
          book_id?: string | null
          chapter_id: string
          chapter_number?: number | null
          id?: string
          text: string
          verse_number: number
          version_id?: string | null
        }
        Update: {
          book_id?: string | null
          chapter_id?: string
          chapter_number?: number | null
          id?: string
          text?: string
          verse_number?: number
          version_id?: string | null
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
          definition: string
          id: string
          language: string
          strongs_number: string | null
          transliteration: string | null
          word: string
        }
        Insert: {
          definition: string
          id?: string
          language: string
          strongs_number?: string | null
          transliteration?: string | null
          word: string
        }
        Update: {
          definition?: string
          id?: string
          language?: string
          strongs_number?: string | null
          transliteration?: string | null
          word?: string
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
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
