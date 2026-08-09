export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      games: {
        Row: {
          id: string; slug: string; name: string; icon_url: string; icon_width: number; icon_height: number;
          range_label: string; user_id_label: string; user_id_placeholder: string;
          server_id_label: string; server_id_placeholder: string; server_id_required: boolean;
          hide_server_id: boolean; is_active: boolean; sort_order: number;
          created_at: string; updated_at: string;
        };
        Insert: {
          id?: string; slug: string; name: string; icon_url?: string; icon_width?: number; icon_height?: number;
          range_label?: string; user_id_label?: string; user_id_placeholder?: string;
          server_id_label?: string; server_id_placeholder?: string; server_id_required?: boolean;
          hide_server_id?: boolean; is_active?: boolean; sort_order?: number;
          created_at?: string; updated_at?: string;
        };
        Update: {
          id?: string; slug?: string; name?: string; icon_url?: string; icon_width?: number; icon_height?: number;
          range_label?: string; user_id_label?: string; user_id_placeholder?: string;
          server_id_label?: string; server_id_placeholder?: string; server_id_required?: boolean;
          hide_server_id?: boolean; is_active?: boolean; sort_order?: number;
          created_at?: string; updated_at?: string;
        };
      };
      pricing: {
        Row: { id: string; game_id: string; nominal_label: string; price: number; sort_order: number; created_at: string; updated_at: string; };
        Insert: { id?: string; game_id: string; nominal_label: string; price: number; sort_order?: number; created_at?: string; updated_at?: string; };
        Update: { id?: string; game_id?: string; nominal_label?: string; price?: number; sort_order?: number; created_at?: string; updated_at?: string; };
      };
      settings: {
        Row: { key: string; value: Json; updated_at: string; };
        Insert: { key: string; value?: Json; updated_at?: string; };
        Update: { key?: string; value?: Json; updated_at?: string; };
      };
      admin_users: {
        Row: { id: string; user_id: string; email: string; created_at: string; };
        Insert: { id?: string; user_id: string; email: string; created_at?: string; };
        Update: { id?: string; user_id?: string; email?: string; created_at?: string; };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
