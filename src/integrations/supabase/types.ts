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
          description: string | null
          earned_at: string | null
          id: string
          score_multiplier: number | null
          type: Database["public"]["Enums"]["achievement_type"]
          user_id: string | null
        }
        Insert: {
          description?: string | null
          earned_at?: string | null
          id?: string
          score_multiplier?: number | null
          type: Database["public"]["Enums"]["achievement_type"]
          user_id?: string | null
        }
        Update: {
          description?: string | null
          earned_at?: string | null
          id?: string
          score_multiplier?: number | null
          type?: Database["public"]["Enums"]["achievement_type"]
          user_id?: string | null
        }
        Relationships: []
      }
      game_sessions: {
        Row: {
          abandoned: boolean | null
          completion_time: number | null
          created_at: string | null
          difficulty: string
          hints_used: number | null
          id: string
          perfect_game: boolean | null
          score: number
          user_id: string | null
          word_category: string
          wrong_guesses: number | null
        }
        Insert: {
          abandoned?: boolean | null
          completion_time?: number | null
          created_at?: string | null
          difficulty: string
          hints_used?: number | null
          id?: string
          perfect_game?: boolean | null
          score: number
          user_id?: string | null
          word_category: string
          wrong_guesses?: number | null
        }
        Update: {
          abandoned?: boolean | null
          completion_time?: number | null
          created_at?: string | null
          difficulty?: string
          hints_used?: number | null
          id?: string
          perfect_game?: boolean | null
          score?: number
          user_id?: string | null
          word_category?: string
          wrong_guesses?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          best_score: number | null
          created_at: string | null
          current_streak: number | null
          daily_score: number | null
          easy_games_played: number | null
          email: string
          favorite_difficulty: string | null
          hard_games_played: number | null
          hints_used: number | null
          id: string
          last_played_at: string | null
          last_streak_update: string | null
          longest_streak: number | null
          medium_games_played: number | null
          perfect_games: number | null
          total_score: number | null
          updated_at: string | null
          username: string
          weekly_score: number | null
        }
        Insert: {
          best_score?: number | null
          created_at?: string | null
          current_streak?: number | null
          daily_score?: number | null
          easy_games_played?: number | null
          email: string
          favorite_difficulty?: string | null
          hard_games_played?: number | null
          hints_used?: number | null
          id: string
          last_played_at?: string | null
          last_streak_update?: string | null
          longest_streak?: number | null
          medium_games_played?: number | null
          perfect_games?: number | null
          total_score?: number | null
          updated_at?: string | null
          username: string
          weekly_score?: number | null
        }
        Update: {
          best_score?: number | null
          created_at?: string | null
          current_streak?: number | null
          daily_score?: number | null
          easy_games_played?: number | null
          email?: string
          favorite_difficulty?: string | null
          hard_games_played?: number | null
          hints_used?: number | null
          id?: string
          last_played_at?: string | null
          last_streak_update?: string | null
          longest_streak?: number | null
          medium_games_played?: number | null
          perfect_games?: number | null
          total_score?: number | null
          updated_at?: string | null
          username?: string
          weekly_score?: number | null
        }
        Relationships: []
      }
      word_pool: {
        Row: {
          active: boolean | null
          category: string
          created_at: string | null
          difficulty: string
          id: string
          last_used_at: string | null
          success_rate: number | null
          times_used: number | null
          word: string
        }
        Insert: {
          active?: boolean | null
          category: string
          created_at?: string | null
          difficulty: string
          id?: string
          last_used_at?: string | null
          success_rate?: number | null
          times_used?: number | null
          word: string
        }
        Update: {
          active?: boolean | null
          category?: string
          created_at?: string | null
          difficulty?: string
          id?: string
          last_used_at?: string | null
          success_rate?: number | null
          times_used?: number | null
          word?: string
        }
        Relationships: []
      }
    }
    Views: {
      global_rankings: {
        Row: {
          avg_score_per_game: number | null
          best_score: number | null
          current_streak: number | null
          favorite_difficulty: string | null
          global_rank: number | null
          id: string | null
          longest_streak: number | null
          perfect_games: number | null
          total_games: number | null
          total_score: number | null
          username: string | null
        }
        Relationships: []
      }
      profile_stats: {
        Row: {
          best_score: number | null
          easy_games_played: number | null
          hard_games_played: number | null
          id: string | null
          last_played_at: string | null
          medium_games_played: number | null
          total_games_played: number | null
          total_score: number | null
        }
        Insert: {
          best_score?: number | null
          easy_games_played?: number | null
          hard_games_played?: number | null
          id?: string | null
          last_played_at?: string | null
          medium_games_played?: number | null
          total_games_played?: never
          total_score?: number | null
        }
        Update: {
          best_score?: number | null
          easy_games_played?: number | null
          hard_games_played?: number | null
          id?: string | null
          last_played_at?: string | null
          medium_games_played?: number | null
          total_games_played?: never
          total_score?: number | null
        }
        Relationships: []
      }
      word_pool_stats: {
        Row: {
          active_words: number | null
          avg_success_rate: number | null
          category: string | null
          difficulty: string | null
          last_word_used: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      create_test_session: {
        Args: {
          user_email: string
        }
        Returns: Json
      }
      maintain_word_pools: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      achievement_type:
        | "PERFECT_GAME"
        | "SPEED_DEMON"
        | "STREAK_MASTER"
        | "WEEKLY_CHAMPION"
        | "DAILY_LEADER"
        | "DIFFICULTY_MASTER"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
