import { LovelaceCard, LovelaceCardConfig, LovelaceCardEditor } from 'custom-card-helpers';

declare global {
  interface HTMLElementTagNameMap {
    'weather-card-editor': LovelaceCardEditor;
    'hui-error-card': LovelaceCard;
  }
}

// TODO Add your configuration elements here for type-checking
export interface WeatherCardConfig extends LovelaceCardConfig {
  type: string;
  show_section_title?: boolean;
  show_section_main?: boolean;
  show_section_slots?: boolean;
  card_title?: string;
  entity_update_time?: string;
  entity_temperature?: string;
  entity_apparent_temp?: string;
  entity_current_conditions?: string;
  entity_current_text?: string;
  slot_l1?: string;
  slot_l2?: string;
  slot_l3?: string;
  slot_l4?: string;
  slot_l5?: string;
  slot_l6?: string;
  slot_r1?: string;
  slot_r2?: string;
  slot_r3?: string;
  slot_r4?: string;
  slot_r5?: string;
  slot_r6?: string;
  entity_humidity?: string;
  entity_pressure?: string;
  entity_visibility?: string;
  entity_wind_bearing?: string;
  entity_wind_speed?: string;
  entity_wind_gust?: string;
  entity_wind_speed_kt?: string;
  entity_wind_gust_kt?: string;
}
