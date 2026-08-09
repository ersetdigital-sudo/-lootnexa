export interface DbGame {
  id: string;
  slug: string;
  name: string;
  icon_url: string;
  icon_width: number;
  icon_height: number;
  range_label: string;
  user_id_label: string;
  user_id_placeholder: string;
  server_id_label: string;
  server_id_placeholder: string;
  server_id_required: boolean;
  hide_server_id: boolean;
}

export interface DbNominal {
  id: string;
  game_id: string;
  nominal_label: string;
  price: number;
  sort_order: number;
}

export interface DbGameWithNominals extends DbGame {
  nominals: DbNominal[];
}
