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
      groupe_instructions: {
        Row: {
          created_at: string
          description: string
          id: number
          nom: string
          rang: number
        }
        Insert: {
          created_at?: string
          description: string
          id?: number
          nom: string
          rang: number
        }
        Update: {
          created_at?: string
          description?: string
          id?: number
          nom?: string
          rang?: number
        }
        Relationships: []
      }
      incident_comments: {
        Row: {
          attachments: string[]
          auteur_id: string
          contenue: string
          created_at: string
          id: number
          incident_id: number
        }
        Insert: {
          attachments: string[]
          auteur_id: string
          contenue: string
          created_at?: string
          id?: number
          incident_id: number
        }
        Update: {
          attachments?: string[]
          auteur_id?: string
          contenue?: string
          created_at?: string
          id?: number
          incident_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_incident_comments_auteur_id_fkey"
            columns: ["auteur_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_incident_comments_incident_id_fkey"
            columns: ["incident_id"]
            isOneToOne: false
            referencedRelation: "incidents"
            referencedColumns: ["id"]
          },
        ]
      }
      incident_types: {
        Row: {
          created_at: string
          dangerosite: number
          description: string
          id: number
          nom: string
        }
        Insert: {
          created_at?: string
          dangerosite: number
          description: string
          id?: number
          nom: string
        }
        Update: {
          created_at?: string
          dangerosite?: number
          description?: string
          id?: number
          nom?: string
        }
        Relationships: []
      }
      incidents: {
        Row: {
          attachement: string[] | null
          auteur_id: string
          created_at: string
          description: string | null
          est_verifier: boolean
          id: number
          latitude: number
          longitude: number
          titre: string
          type_id: number | null
        }
        Insert: {
          attachement?: string[] | null
          auteur_id: string
          created_at?: string
          description?: string | null
          est_verifier?: boolean
          id?: number
          latitude: number
          longitude: number
          titre: string
          type_id?: number | null
        }
        Update: {
          attachement?: string[] | null
          auteur_id?: string
          created_at?: string
          description?: string | null
          est_verifier?: boolean
          id?: number
          latitude?: number
          longitude?: number
          titre?: string
          type_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "public_incidents_auteur_id_fkey"
            columns: ["auteur_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_incidents_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "incident_types"
            referencedColumns: ["id"]
          },
        ]
      }
      incidents_vote: {
        Row: {
          auteur_id: string
          incident_id: number
          vote: number
          voted_at: string
        }
        Insert: {
          auteur_id: string
          incident_id: number
          vote?: number
          voted_at?: string
        }
        Update: {
          auteur_id?: string
          incident_id?: number
          vote?: number
          voted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "incidents_vote_auteur_id_fkey"
            columns: ["auteur_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incidents_vote_incident_id_fkey"
            columns: ["incident_id"]
            isOneToOne: false
            referencedRelation: "incidents"
            referencedColumns: ["id"]
          },
        ]
      }
      instructions: {
        Row: {
          contenue: string
          created_at: string
          id: number
          id_groupe: number
          nom: string
          rang: number
        }
        Insert: {
          contenue: string
          created_at?: string
          id?: number
          id_groupe: number
          nom: string
          rang: number
        }
        Update: {
          contenue?: string
          created_at?: string
          id?: number
          id_groupe?: number
          nom?: string
          rang?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_instructions_id_groupe_fkey"
            columns: ["id_groupe"]
            isOneToOne: false
            referencedRelation: "groupe_instructions"
            referencedColumns: ["id"]
          },
        ]
      }
      num_urgences: {
        Row: {
          created_at: string
          description: string
          id: number
          nom: string
          numero: string[]
        }
        Insert: {
          created_at?: string
          description: string
          id?: number
          nom: string
          numero: string[]
        }
        Update: {
          created_at?: string
          description?: string
          id?: number
          nom?: string
          numero?: string[]
        }
        Relationships: []
      }
      users_profiles: {
        Row: {
          nom: string
          prenom: string
          user_id: string
        }
        Insert: {
          nom: string
          prenom: string
          user_id: string
        }
        Update: {
          nom?: string
          prenom?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_users_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users_roles: {
        Row: {
          role: Database["public"]["Enums"]["roles"]
          user_id: string
        }
        Insert: {
          role?: Database["public"]["Enums"]["roles"]
          user_id: string
        }
        Update: {
          role?: Database["public"]["Enums"]["roles"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      roles: "ADMIN" | "MODERATEUR" | "USER"
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