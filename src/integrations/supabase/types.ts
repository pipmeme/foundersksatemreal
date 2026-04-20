export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      articles: {
        Row: {
          category: string | null
          content: Json
          country: string | null
          created_at: string
          excerpt: string | null
          id: string
          metadata: Json | null
          slug: string
          status: Database["public"]["Enums"]["article_status"]
          title: string
          type: Database["public"]["Enums"]["article_type"]
          updated_at: string
        }
        Insert: {
          category?: string | null
          content?: Json
          country?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          metadata?: Json | null
          slug: string
          status?: Database["public"]["Enums"]["article_status"]
          title: string
          type: Database["public"]["Enums"]["article_type"]
          updated_at?: string
        }
        Update: {
          category?: string | null
          content?: Json
          country?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          metadata?: Json | null
          slug?: string
          status?: Database["public"]["Enums"]["article_status"]
          title?: string
          type?: Database["public"]["Enums"]["article_type"]
          updated_at?: string
        }
        Relationships: []
      }
      founder_applications: {
        Row: {
          age: string | null
          city: string | null
          cofounder_details: Json | null
          company_name: string
          company_website: string | null
          country: string
          created_at: string
          education: string | null
          email: string
          feature_type: string
          founded_date: string | null
          founder_name: string
          founder_role: string | null
          funding_amount: string | null
          funding_type: string | null
          gender: string | null
          grants_received: string | null
          id: string
          incubator_name: string | null
          industry: string
          is_incubated: boolean
          linkedin_url: string | null
          message: string | null
          num_cofounders: number
          one_liner: string
          phone: string | null
          revenue: string | null
          social_media: string | null
          stage: string
          status: string
          team_size: string | null
        }
        Insert: {
          age?: string | null
          city?: string | null
          cofounder_details?: Json | null
          company_name: string
          company_website?: string | null
          country: string
          created_at?: string
          education?: string | null
          email: string
          feature_type?: string
          founded_date?: string | null
          founder_name: string
          founder_role?: string | null
          funding_amount?: string | null
          funding_type?: string | null
          gender?: string | null
          grants_received?: string | null
          id?: string
          incubator_name?: string | null
          industry: string
          is_incubated?: boolean
          linkedin_url?: string | null
          message?: string | null
          num_cofounders?: number
          one_liner: string
          phone?: string | null
          revenue?: string | null
          social_media?: string | null
          stage: string
          status?: string
          team_size?: string | null
        }
        Update: {
          age?: string | null
          city?: string | null
          cofounder_details?: Json | null
          company_name?: string
          company_website?: string | null
          country?: string
          created_at?: string
          education?: string | null
          email?: string
          feature_type?: string
          founded_date?: string | null
          founder_name?: string
          founder_role?: string | null
          funding_amount?: string | null
          funding_type?: string | null
          gender?: string | null
          grants_received?: string | null
          id?: string
          incubator_name?: string | null
          industry?: string
          is_incubated?: boolean
          linkedin_url?: string | null
          message?: string | null
          num_cofounders?: number
          one_liner?: string
          phone?: string | null
          revenue?: string | null
          social_media?: string | null
          stage?: string
          status?: string
          team_size?: string | null
        }
        Relationships: []
      }
      kickstart_signups: {
        Row: {
          business_idea: string
          created_at: string
          email: string
          help_needed: string[]
          id: string
          name: string
          status: string
          whatsapp: string
        }
        Insert: {
          business_idea: string
          created_at?: string
          email: string
          help_needed?: string[]
          id?: string
          name: string
          status?: string
          whatsapp: string
        }
        Update: {
          business_idea?: string
          created_at?: string
          email?: string
          help_needed?: string[]
          id?: string
          name?: string
          status?: string
          whatsapp?: string
        }
        Relationships: []
      }
      submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string | null
          name: string | null
          type: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name?: string | null
          type?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string | null
          type?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "user"
      article_status: "public" | "private" | "draft"
      article_type: "founder_story" | "insight" | "rising_founder"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      article_status: ["public", "private", "draft"],
      article_type: ["founder_story", "insight", "rising_founder"],
    },
  },
} as const
