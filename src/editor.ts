/* eslint-disable @typescript-eslint/no-explicit-any */
import { LitElement, html, TemplateResult, css, CSSResultGroup } from 'lit';
import { HomeAssistant, fireEvent, LovelaceCardEditor } from 'custom-card-helpers';

import { keys } from 'ts-transformer-keys';

import { mdiPencil, mdiArrowDown, mdiArrowUp, mdiApplicationEditOutline } from '@mdi/js';

//import { ScopedRegistryHost } from '@lit-labs/scoped-registry-mixin';
import { WeatherCardConfig, layoutOverview, layoutOrientation, layoutDays, extendedDays, sectionType, timeFormat, sectionNames, pressureDecimals, HassCustomElement } from './types';
import { customElement, property, state } from 'lit/decorators';
import { formfieldDefinition } from '../elements/formfield';
import { selectDefinition } from '../elements/select';
import { switchDefinition } from '../elements/switch';
import { textfieldDefinition } from '../elements/textfield';

@customElement('platinum-weather-card-editor')
export class WeatherCardEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _config?: WeatherCardConfig;

  @state() private _helpers?: any;

  @state() private _subElementEditor: string | undefined = undefined;

  private _initialized = false;
  private _config_version = 8;

  static elementDefinitions = {
    "ha-card": customElements.get("ha-card"),  // This works because ha-card is ALWAYS loaded before custom cards (for now)
    ...textfieldDefinition,
    ...selectDefinition,
    ...switchDefinition,
    ...formfieldDefinition,
  };

  public setConfig(config: WeatherCardConfig): void {
    this._config = config;
    let changed = false;
    if (this._section_order === null) {
      this._config = {
        ...this._config,
        ['section_order']: sectionNames,
      }
      changed = true;
    } else {
      // check for extra entries
      this._config.section_order.forEach((section: sectionType) => {
        if (!(sectionNames.includes(section))) {
          const idx = this._config?.section_order.indexOf(section);
          if (idx !== undefined && idx !== -1) {
            this._config?.section_order.splice(idx, 1);
          }
          changed = true;
        }
      });
      // check for missing entries
      sectionNames.forEach((section: sectionType) => {
        if (this._config && !(this._config.section_order.includes(section))) {
          this._config.section_order.push(section);
          changed = true;
        }
      });
    }

    if (changed) {
      fireEvent(this, 'config-changed', { config: this.sortObjectByKeys(this._config) });
    }

    this.loadCardHelpers();
  }

  private sortObjectByKeys(object: { [x: string]: any; }) {
    return Object.keys(object).sort().reduce((r, k) => (r[k] = object[k], r), {});
  }

  private _configCleanup() {
    if (!this._config || !this.hass) {
      return;
    }

    let tmpConfig = { ...this._config };

    // Rename options
    if (tmpConfig.static_icons) {
      tmpConfig['option_static_icons'] = tmpConfig.static_icons;
      delete tmpConfig['static_icons'];
    }

    if (tmpConfig.time_format) {
      tmpConfig['option_time_format'] = tmpConfig.time_format === '12' ? '12hour' : '24hour';
      delete tmpConfig['time_format'];
    }

    if (tmpConfig.locale) {
      tmpConfig['option_locale'] = tmpConfig.locale;
      delete tmpConfig['locale'];
    }

    if (tmpConfig.option_today_temperature_decimals) {
      tmpConfig['option_today_temperature_decimals'] = tmpConfig.show_today_decimals;
      delete tmpConfig['show_today_decimals'];
    }

    if (tmpConfig.show_decimals_pressure) {
      tmpConfig['option_pressure_decimals'] = tmpConfig.show_decimals_pressure;
      delete tmpConfig['show_decimals_pressure'];
    }

    if (tmpConfig.tooltips) {
      tmpConfig['option_tooltips'] = tmpConfig.tooltips;
      delete tmpConfig['tooltips'];
    }

    if (tmpConfig.show_beaufort) {
      tmpConfig['option_show_beaufort'] = tmpConfig.show_beaufort;
      delete tmpConfig['show_beaufort'];
    }

    if (tmpConfig.entity_daytime_high) {
      tmpConfig['Entity_forecast_max'] = tmpConfig.entity_daytime_high;
      delete tmpConfig['entity_daytime_high'];
    }

    if (tmpConfig.entity_daytime_low) {
      tmpConfig['entity_forecast_min'] = tmpConfig.entity_daytime_low;
      delete tmpConfig['entity_daytime_low'];
    }

    if (tmpConfig.entity_current_conditions) {
      tmpConfig['entity_forecast_icon'] = tmpConfig.entity_current_conditions;
      delete tmpConfig['entity_current_conditions'];
    }

    if (tmpConfig.entity_current_text) {
      tmpConfig['entity_summary'] = tmpConfig.entity_current_text;
      delete tmpConfig['entity_current_text'];
    }

    if (tmpConfig.entity_daily_summary) {
      tmpConfig['entity_extended'] = tmpConfig.entity_daily_summary;
      delete tmpConfig['entity_daily_summary'];
    }

    if (tmpConfig.entity_forecast_high_temp_1) {
      tmpConfig['entity_forecast_max_1'] = tmpConfig.entity_forecast_high_temp_1;
      delete tmpConfig['entity_forecast_high_temp_1'];
    }

    if (tmpConfig.entity_forecast_low_temp_1) {
      tmpConfig['entity_forecast_min_1'] = tmpConfig.entity_forecast_low_temp_1;
      delete tmpConfig['entity_forecast_low_temp_1'];
    }

    if (tmpConfig.entity_possible_today) {
      tmpConfig['entity_pos'] = tmpConfig.entity_possible_today;
      delete tmpConfig['entity_possible_today'];
    }

    if (tmpConfig.entity_fire_danger_summary) {
      tmpConfig['entity_fire_danger'] = tmpConfig.entity_fire_danger_summary;
      delete tmpConfig['entity_fire_danger_summary'];
    }

    if (tmpConfig.show_decimals) {
      tmpConfig['option_show_overview_decimals'] = tmpConfig.show_decimals;
      delete tmpConfig['show_decimals'];
    }

    if (tmpConfig.show_separator) {
      tmpConfig['option_show_overview_separator'] = tmpConfig.show_separator;
      delete tmpConfig['show_separator'];
    }

    // Remane slot entries
    for (const slot of ['slot_l1, slot_l2, slot_l3, slot_l4, slot_l5, slot_l6, slot_l7, slot_l8, slot_r1, slot_r2, slot_r3, slot_r4, slot_r5, slot_r6, slot_r7, slot_r8']) {
      if (tmpConfig[slot] === 'daytime_high') tmpConfig[slot] = 'forecast_max';
      if (tmpConfig[slot] === 'daytime_low') tmpConfig[slot] = 'forecast_min';
    }

    // Remove unused entries
    const keysOfProps = keys<WeatherCardConfig>();
    for (const element in this._config) {
      if (!keysOfProps.includes(element)) {
        delete tmpConfig[element];
      }
    }

    tmpConfig = {
      ...tmpConfig,
      card_config_version: this._config_version,
    }

    this._config = tmpConfig;

    fireEvent(this, 'config-changed', { config: this.sortObjectByKeys(this._config) });
  }

  protected shouldUpdate(): boolean {
    if (!this._initialized) {
      this._initialize();
    }

    return true;
  }

  get _section_order(): sectionType[] | null {
    return this._config?.section_order || null;
  }

  get _text_card_title(): string {
    return this._config?.text_card_title || '';
  }

  get _text_card_title_2(): string {
    return this._config?.text_card_title_2 || '';
  }

  get _entity_update_time(): string {
    return this._config?.entity_update_time || '';
  }

  get _update_time_use_attr(): boolean {
    return this._config?.update_time_use_attr === true; // default off
  }

  get _update_time_name_attr(): string {
    return this._config?.update_time_name_attr || '';
  }

  get _text_update_time_prefix(): string {
    return this._config?.text_update_time_prefix || '';
  }

  get _overview_layout(): layoutOverview | '' {
    return this._config?.overview_layout || '';
  }

  get _entity_temperature(): string {
    return this._config?.entity_temperature || '';
  }

  get _entity_apparent_temp(): string {
    return this._config?.entity_apparent_temp || '';
  }

  get _entity_forecast_icon(): string {
    return this._config?.entity_forecast_icon || '';
  }

  get _entity_summary(): string {
    return this._config?.entity_summary || '';
  }

  get _option_show_overview_decimals(): boolean {
    return this._config?.option_show_overview_decimals === true; // default off
  }

  get _option_show_overview_separator(): boolean {
    return this._config?.option_show_overview_separator === true; // default off
  }

  get _entity_extended(): string {
    return this._config?.entity_extended || '';
  }

  get _extended_use_attr(): boolean {
    return this._config?.extended_use_attr === true; // default off
  }

  get _extended_name_attr(): string {
    return this._config?.extended_name_attr || '';
  }

  get _entity_todays_fire_danger(): string {
    return this._config?.entity_todays_fire_danger || '';
  }

  get _entity_todays_uv_forecast(): string {
    return this._config?.entity_todays_uv_forecast || '';
  }

  get _slot_l1(): string {
    return this._config?.slot_l1 || '';
  }

  get _slot_l2(): string {
    return this._config?.slot_l2 || '';
  }

  get _slot_l3(): string {
    return this._config?.slot_l3 || '';
  }

  get _slot_l4(): string {
    return this._config?.slot_l4 || '';
  }

  get _slot_l5(): string {
    return this._config?.slot_l5 || '';
  }

  get _slot_l6(): string {
    return this._config?.slot_l6 || '';
  }

  get _slot_l7(): string {
    return this._config?.slot_l7 || '';
  }

  get _slot_l8(): string {
    return this._config?.slot_l8 || '';
  }

  get _slot_r1(): string {
    return this._config?.slot_r1 || '';
  }

  get _slot_r2(): string {
    return this._config?.slot_r2 || '';
  }

  get _slot_r3(): string {
    return this._config?.slot_r3 || '';
  }

  get _slot_r4(): string {
    return this._config?.slot_r4 || '';
  }

  get _slot_r5(): string {
    return this._config?.slot_r5 || '';
  }

  get _slot_r6(): string {
    return this._config?.slot_r6 || '';
  }

  get _slot_r7(): string {
    return this._config?.slot_r7 || '';
  }

  get _slot_r8(): string {
    return this._config?.slot_r8 || '';
  }

  get _entity_observed_max(): string {
    return this._config?.entity_observed_max || '';
  }

  get _entity_observed_min(): string {
    return this._config?.entity_observed_min || '';
  }

  get _entity_forecast_max(): string {
    return this._config?.entity_forecast_max || '';
  }

  get _entity_forecast_min(): string {
    return this._config?.entity_forecast_min || '';
  }

  get _entity_temp_next(): string {
    return this._config?.entity_temp_next || '';
  }

  get _entity_temp_next_label(): string {
    return this._config?.entity_temp_next_label || '';
  }

  get _entity_temp_following(): string {
    return this._config?.entity_temp_following || '';
  }

  get _entity_temp_following_label(): string {
    return this._config?.entity_temp_following_label || '';
  }

  get _entity_wind_bearing(): string {
    return this._config?.entity_wind_bearing || '';
  }

  get _entity_wind_speed(): string {
    return this._config?.entity_wind_speed || '';
  }

  get _entity_wind_gust(): string {
    return this._config?.entity_wind_gust || '';
  }

  get _entity_wind_speed_kt(): string {
    return this._config?.entity_wind_speed_kt || '';
  }

  get _entity_wind_gust_kt(): string {
    return this._config?.entity_wind_gust_kt || '';
  }

  get _entity_visibility(): string {
    return this._config?.entity_visibility || '';
  }

  get _entity_sun(): string {
    return this._config?.entity_sun || '';
  }

  get _entity_pop(): string {
    return this._config?.entity_pop || '';
  }

  get _entity_pos(): string {
    return this._config?.entity_pos || '';
  }

  get _entity_possible_tomorrow(): string {
    return this._config?.entity_possible_tomorrow || '';
  }

  get _entity_humidity(): string {
    return this._config?.entity_humidity || '';
  }

  get _entity_pressure(): string {
    return this._config?.entity_pressure || '';
  }

  get _entity_uv_alert_summary(): string {
    return this._config?.entity_uv_alert_summary || '';
  }

  get _entity_fire_danger(): string {
    return this._config?.entity_fire_danger || '';
  }

  get _entity_rainfall(): string {
    return this._config?.entity_rainfall || '';
  }

  get _custom1_value(): string {
    return this._config?.custom1_value || '';
  }

  get _custom1_icon(): string {
    return this._config?.custom1_icon || '';
  }

  get _custom1_units(): string {
    return this._config?.custom1_units || '';
  }

  get _custom2_value(): string {
    return this._config?.custom2_value || '';
  }

  get _custom2_icon(): string {
    return this._config?.custom2_icon || '';
  }

  get _custom2_units(): string {
    return this._config?.custom2_units || '';
  }

  get _custom3_value(): string {
    return this._config?.custom3_value || '';
  }

  get _custom3_icon(): string {
    return this._config?.custom3_icon || '';
  }

  get _custom3_units(): string {
    return this._config?.custom3_units || '';
  }

  get _custom4_value(): string {
    return this._config?.custom4_value || '';
  }

  get _custom4_icon(): string {
    return this._config?.custom4_icon || '';
  }

  get _custom4_units(): string {
    return this._config?.custom4_units || '';
  }

  get _daily_forecast_layout(): layoutOrientation | '' {
    return this._config?.daily_forecast_layout || '';
  }

  get _daily_forecast_days(): layoutDays | null {
    return this._config?.daily_forecast_days || null;
  }

  get _daily_extended_forecast_days(): extendedDays | null {
    return this._config?.daily_extended_forecast_days ?? null;
  }

  get _entity_forecast_icon_1(): string {
    return this._config?.entity_forecast_icon_1 || '';
  }

  get _entity_summary_1(): string {
    return this._config?.entity_summary_1 || '';
  }

  get _entity_forecast_min_1(): string {
    return this._config?.entity_forecast_min_1 || '';
  }

  get _entity_forecast_max_1(): string {
    return this._config?.entity_forecast_max_1 || '';
  }

  get _entity_pop_1(): string {
    return this._config?.entity_pop_1 || '';
  }

  get _entity_pos_1(): string {
    return this._config?.entity_pos_1 || '';
  }

  get _entity_extended_1(): string {
    return this._config?.entity_extended_1 || '';
  }

  get _entity_fire_danger_1(): string {
    return this._config?.entity_fire_danger_1 || '';
  }

  get _daily_extended_use_attr(): boolean {
    return this._config?.daily_extended_use_attr === true; // default off
  }

  get _daily_extended_name_attr(): string {
    return this._config?.daily_extended_name_attr || '';
  }

  get _option_today_temperature_decimals(): boolean {
    return this._config?.option_today_temperature_decimals === true; // default off
  }

  get _option_today_rainfall_decimals(): boolean {
    return this._config?.option_today_rainfall_decimals === true; // default off
  }

  get _option_pressure_decimals(): pressureDecimals | null {
    return this._config?.option_pressure_decimals || null;
  }

  get _option_color_fire_danger(): boolean {
    return this._config?.option_color_fire_danger !== false; // default on
  }

  get _option_daily_color_fire_danger(): boolean {
    return this._config?.option_daily_color_fire_danger !== false; // default on
  }

  get _option_tooltips(): boolean {
    return this._config?.option_tooltips === true; // default off
  }

  get _option_static_icons(): boolean {
    return this._config?.option_static_icons === true; // default off
  }

  get _option_time_format(): timeFormat | null {
    return this._config?.option_time_format ?? null;
  }

  get _option_locale(): string {
    return this._config?.option_locale || '';
  }

  get _optional_entities(): TemplateResult {
    const entities = new Set();
    for (const slot of
      [
        this._config?.slot_l1 || 'forecast_max' as string,
        this._config?.slot_l2 || 'forecast_min' as string,
        this._config?.slot_l3 || 'wind' as string,
        this._config?.slot_l4 || 'pressure' as string,
        this._config?.slot_l5 || 'sun_next' as string,
        this._config?.slot_l6 || 'remove' as string,
        this._config?.slot_l7 || 'remove' as string,
        this._config?.slot_l8 || 'remove' as string,
        this._config?.slot_r1 || 'popforecast' as string,
        this._config?.slot_r2 || 'humidity' as string,
        this._config?.slot_r3 || 'uv_summary' as string,
        this._config?.slot_r4 || 'fire_danger' as string,
        this._config?.slot_r5 || 'sun_following' as string,
        this._config?.slot_r6 || 'remove' as string,
        this._config?.slot_r7 || 'remove' as string,
        this._config?.slot_r8 || 'remove' as string,
      ]) {
      switch (slot) {
        case 'observed_max':
          entities.add('entity_observed_max');
          break;
        case 'observed_min':
          entities.add('entity_observed_min');
          break;
        case 'forecast_max':
          entities.add('entity_forecast_max');
          break;
        case 'forecast_min':
          entities.add('entity_forecast_min');
          break;
        case 'temp_next':
          entities.add('entity_temp_next').add('entity_temp_next_label');
          break;
        case 'temp_following':
          entities.add('entity_temp_following').add('entity_temp_following_label');
          break;
        case 'temp_maximums':
          entities.add('entity_forecast_max').add('entity_observed_max');
          break;
        case 'temp_minimums':
          entities.add('entity_forecast_min').add('entity_observed_min');
          break;
        case 'wind':
          entities.add('entity_wind_bearing').add('entity_wind_speed').add('entity_wind_gust');
          break;
        case 'wind_kt':
          entities.add('entity_wind_bearing').add('entity_wind_speed_kt').add('entity_wind_gust_kt');
          break;
        case 'visibility':
          entities.add('entity_visibility');
          break;
        case 'sun_next':
          entities.add('entity_sun');
          break;
        case 'sun_following':
          entities.add('entity_sun');
          break;
        case 'pop':
          entities.add('entity_pop');
          break;
        case 'popforecast':
          entities.add('entity_pop').add('entity_pos');
          break;
        case 'humidity':
          entities.add('entity_humidity');
          break;
        case 'pressure':
          entities.add('entity_pressure');
          break;
        case 'uv_summary':
          entities.add('entity_uv_alert_summary');
          break;
        case 'fire_danger':
          entities.add('entity_fire_danger');
          break;
        case 'possible_today':
          entities.add('entity_pos');
          break;
        case 'possible_tomorrow':
          entities.add('entity_possible_tomorrow');
          break;
        case 'rainfall':
          entities.add('entity_rainfall');
          break;
        case 'custom1':
          entities.add('custom1');
          break;
        case 'custom2':
          entities.add('custom2');
          break;
        case 'custom3':
          entities.add('custom3');
          break;
        case 'custom4':
          entities.add('custom4');
          break;
      }
    }

    const entity_observed_max = entities.has("entity_observed_max") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_observed_max'} .value=${this._entity_observed_max} .includeDomains=${['sensor']}
          name="entity_observed_max" label="Entity Observed Max" allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_observed_min = entities.has("entity_observed_min") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_observed_min'} .value=${this._entity_observed_min} .includeDomains=${['sensor']}
          name="entity_observed_min" label="Entity Observed Min" allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_forecast_max = entities.has("entity_forecast_max") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_forecast_max'} .value=${this._entity_forecast_max} .includeDomains=${['sensor', 'weather']}
          name="entity_forecast_max" label="Entity Forecast Max" allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_forecast_min = entities.has("entity_forecast_min") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_forecast_min'} .value=${this._entity_forecast_min} .includeDomains=${['sensor', 'weather']}
          name="entity_forecast_min" label="Entity Forecast Min" allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_temp_next = entities.has("entity_temp_next") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_temp_next'} .value=${this._entity_temp_next} .includeDomains=${['sensor']}
          name="entity_temp_next" label="Entity Temp Next" allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_temp_next_label = entities.has("entity_temp_next_label") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_temp_next_label'} .value=${this._entity_temp_next_label} .includeDomains=${['sensor']}
          name="entity_temp_next_label" label="Entity Temp Next Label" allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_temp_following = entities.has("entity_temp_following") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_temp_following'} .value=${this._entity_temp_following} .includeDomains=${['sensor']}
          name="entity_temp_following" label="Entity Temp Following" allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_temp_following_label = entities.has("entity_temp_following_label") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_temp_following_label'} .value=${this._entity_temp_following_label} .includeDomains=${['sensor']}
          name="entity_temp_following_label" label="Entity Temp Following Label" allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_wind_bearing = entities.has("entity_wind_bearing") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_wind_bearing'} .value=${this._entity_wind_bearing} .includeDomains=${['sensor', 'weather']}
          name="entity_wind_bearing" label="Entity Wind Bearing" allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_wind_speed = entities.has("entity_wind_speed") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_wind_speed'} .value=${this._entity_wind_speed} .includeDomains=${['sensor', 'weather']}
          name="entity_wind_speed" label="Entity Wind Speed" allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_wind_gust = entities.has("entity_wind_gust") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_wind_gust'} .value=${this._entity_wind_gust} .includeDomains=${['sensor']}
          name="entity_wind_gust" label="Entity Wind Gust" allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_wind_speed_kt = entities.has("entity_wind_speed_kt") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_wind_speed_kt'} .value=${this._entity_wind_speed_kt} .includeDomains=${['sensor', 'weather']}
          name="entity_wind_speed_kt" label="Entity Wind Speed Kt" allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_wind_gust_kt = entities.has("entity_wind_gust_kt") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_wind_gust_kt'} .value=${this._entity_wind_gust_kt} .includeDomains=${['sensor']}
          name="entity_wind_gust_kt" label="Entity Wind Gust Kt" allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_visibility = entities.has("entity_visibility") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_visibility'} .value=${this._entity_visibility} .includeDomains=${['sensor', 'weather']}
          name="entity_visibility" label="Entity Visibility" allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_sun = entities.has("entity_sun") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_sun'} .value=${this._entity_sun} .includeDomains=${['sun', 'sensor']}
          name="entity_sun" label="Entity Sun" allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_pop = entities.has("entity_pop") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_pop'} .value=${this._entity_pop} .includeDomains=${['sensor', 'weather']}
          name="entity_pop" label="Chance of Rain" allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_pos = entities.has("entity_pos") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_pos'} .value=${this._entity_pos} .includeDomains=${['sensor', 'weather']}
          name="entity_pos" label="Possible Rain Today" allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_possible_tomorrow = entities.has("entity_possible_tomorrow") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_possible_tomorrow'} .value=${this._entity_possible_tomorrow} .includeDomains=${['sensor', 'weather']}
          name="entity_possible_tomorrow" label="Possible Rain Tomorrow" allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_humidity = entities.has("entity_humidity") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_humidity'} .value=${this._entity_humidity} .includeDomains=${['sensor', 'weather']}
          name="entity_humidity" label="Humidity" allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_pressure = entities.has("entity_pressure") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_pressure'} .value=${this._entity_pressure} .includeDomains=${['sensor', 'weather']}
          name="entity_pressure" label="Atmospheric Pressure" allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_uv_alert_summary = entities.has("entity_uv_alert_summary") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_uv_alert_summary'} .value=${this._entity_uv_alert_summary} .includeDomains=${['sensor']}
          name="entity_uv_alert_summary" label="UV Alert Summary" allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_fire_danger = entities.has("entity_fire_danger") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_fire_danger'} .value=${this._entity_fire_danger} .includeDomains=${['sensor']}
          name="entity_fire_danger" label="Fire Danger" allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_rainfall = entities.has("entity_rainfall") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_rainfall'} .value=${this._entity_rainfall} .includeDomains=${['sensor']}
          name="entity_rainfall" label="Todays Rain" allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_custom1 = entities.has("custom1") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'custom1_value'} .value=${this._custom1_value} .includeDomains=${['sensor']}
          name="custom1_value" label="Custom 1 Value" allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
        <div class="side-by-side">
          <ha-icon-picker .configValue=${'custom1_icon'} .value=${this._custom1_icon} name="custom1_icon"
            label="Custom 1 Icon" @value-changed=${this._valueChanged}>
          </ha-icon-picker>
          <ha-textfield label="Custom 1 Units" .value=${this._custom1_units} .configValue=${'custom1_units'} @input=${this._valueChanged}>
          </ha-textfield>
        </div>
      ` : '';

    const entity_custom2 = entities.has("custom2") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'custom2_value'} .value=${this._custom2_value} .includeDomains=${['sensor']}
          name="custom2_value" label="Custom 2 Value" allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
        <div class="side-by-side">
          <ha-icon-picker .configValue=${'custom2_icon'} .value=${this._custom2_icon} name="custom2_icon"
            label="Custom 2 Icon" @value-changed=${this._valueChanged}>
          </ha-icon-picker>
          <ha-textfield label="Custom 2 Units" .value=${this._custom2_units} .configValue=${'custom2_units'} @input=${this._valueChanged}>
          </ha-textfield>
        </div>
      ` : '';

    const entity_custom3 = entities.has("custom3") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'custom3_value'} .value=${this._custom3_value} .includeDomains=${['sensor']}
          name="custom3_value" label="Custom 3 Value" allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
        <div class="side-by-side">
          <ha-icon-picker .configValue=${'custom3_icon'} .value=${this._custom3_icon} name="custom3_icon"
            label="Custom 3 Icon" @value-changed=${this._valueChanged}>
          </ha-icon-picker>
          <ha-textfield label="Custom 3 Units" .value=${this._custom3_units} .configValue=${'custom3_units'} @input=${this._valueChanged}>
          </ha-textfield>
        </div>
      ` : '';

    const entity_custom4 = entities.has("custom4") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'custom4_value'} .value=${this._custom4_value} .includeDomains=${['sensor']}
          name="custom4_value" label="Custom 4 Value" allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
        <div class="side-by-side">
          <ha-icon-picker .configValue=${'custom4_icon'} .value=${this._custom4_icon} name="custom4_icon"
            label="Custom 4 Icon" @value-changed=${this._valueChanged}>
          </ha-icon-picker>
          <ha-textfield label="Custom 4 Units" .value=${this._custom4_units} .configValue=${'custom4_units'} @input=${this._valueChanged}>
          </ha-textfield>
        </div>
      ` : '';

    return html`
      ${entity_observed_max}
      ${entity_observed_min}
      ${entity_forecast_max}
      ${entity_forecast_min}
      ${entity_temp_next}
      ${entity_temp_next_label}
      ${entity_temp_following}
      ${entity_temp_following_label}
      ${entity_wind_bearing}
      ${entity_wind_speed}
      ${entity_wind_gust}
      ${entity_wind_speed_kt}
      ${entity_wind_gust_kt}
      ${entity_visibility}
      ${entity_sun}
      ${entity_pop}
      ${entity_pos}
      ${entity_possible_tomorrow}
      ${entity_humidity}
      ${entity_pressure}
      ${entity_uv_alert_summary}
      ${entity_fire_danger}
      ${entity_rainfall}
      ${entity_custom1}
      ${entity_custom2}
      ${entity_custom3}
      ${entity_custom4}`;
  }

  get _show_warning(): boolean {
    return this._config?.show_warning || false;
  }

  get _show_error(): boolean {
    return this._config?.show_error || false;
  }

  protected async firstUpdated(): Promise<void> {
    if (this._config && this.hass) {
      if (this._config.card_config_version !== this._config_version) {
        this._configCleanup();
      }
    }

    if (!customElements.get('ha-switch') || !customElements.get('ha-textfield') || !customElements.get('ha-entity-picker')) {
      (customElements.get('hui-entities-card') as HassCustomElement)?.getConfigElement();
    }
  }

  private _sectionOverviewEditor(): TemplateResult {
    return html`
      <ha-textfield label="Card Title Text Line 1" .value=${this._text_card_title} .configValue=${'text_card_title'}
        @input=${this._valueChanged}>
      </ha-textfield>
      <ha-textfield label="Card Title Text Line 2" .value=${this._text_card_title_2} .configValue=${'text_card_title_2'}
        @input=${this._valueChanged}>
      </ha-textfield>
      <ha-entity-picker .hass=${this.hass} .configValue=${'entity_update_time'} .value=${this._entity_update_time} .includeDomains=${['sensor']}
        name="entity_update_time" label="Entity Update Time" allow-custom-entity
        @value-changed=${this._valueChangedPicker}>
      </ha-entity-picker>
      ${this._entity_update_time !== '' ? html`
      <div class="side-by-side">
        <div>
          <ha-formfield .label=${'Use Attribute'}>
            <ha-switch .checked=${this._update_time_use_attr !== false} .configValue=${'update_time_use_attr'}
              @change=${this._valueChanged}>
            </ha-switch>
          </ha-formfield>
        </div>
        ${this._entity_update_time !== '' && this._update_time_use_attr === true ? html`<ha-selector .hass=${this.hass} .entityId=${this._entity_update_time}
          .selector = ${{ attribute: { entity_id: this._entity_update_time } }} .required=${false}
          .configValue=${'update_time_name_attr'} .value=${this._update_time_name_attr} name="update_time_name_attr" label="Attribute"
          allow-custom-value
          @value-changed=${this._valueChangedPicker}>
        </ha-selector>` : html``}
      </div>` : html``}
      <ha-textfield label="Update Time Prefix" .value=${this._text_update_time_prefix}
        .configValue=${'text_update_time_prefix'} @input=${this._valueChanged}>
      </ha-textfield>
      ${this._overview_layout !== 'forecast' ?
        html`<ha-entity-picker .hass=${this.hass} .configValue=${'entity_temperature'} .value=${this._entity_temperature} .includeDomains=${['sensor', 'weather']}
          name="entity_temperature" label="Entity Current Temperature" allow-custom-entity
          @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_apparent_temp'} .value=${this._entity_apparent_temp} .includeDomains=${['sensor']}
          name="entity_apparent_temp" label="Entity Apparent Temperature" allow-custom-entity
          @value-changed=${this._valueChangedPicker}>
      </ha-entity-picker>` : html``}
      ${this._overview_layout !== 'observations' ?
        html`<ha-entity-picker .hass=${this.hass} .configValue=${'entity_forecast_icon'} .value=${this._entity_forecast_icon} .includeDomains=${['sensor', 'weather']}
          name="entity_forecast_icon" label="Entity Forecast Icon" allow-custom-entity @value-changed=${this._valueChangedPicker}>
          </ha-entity-picker>
          <ha-entity-picker .hass=${this.hass} .configValue=${'entity_summary'} .value=${this._entity_summary} .includeDomains=${['sensor', 'weather']}
            name="entity_summary" label="Entity Forecast Summary" allow-custom-entity @value-changed=${this._valueChangedPicker}>
          </ha-entity-picker>` : html``}
    `;
  }

  private _optionOverviewEditor(): TemplateResult {
    return html`
      <div class="side-by-side">
        <ha-select label="Overview Layout" .configValue=${'overview_layout'}
          .value=${this._overview_layout} @closed=${(ev: { stopPropagation: () => any; }) => ev.stopPropagation()} @selected=${this._valueChanged}>
          <mwc-list-item></mwc-list-item>
          <mwc-list-item value="complete">complete</mwc-list-item>
          <mwc-list-item value="observations">observations</mwc-list-item>
          <mwc-list-item value="forecast">forecast</mwc-list-item>
          <mwc-list-item value="title only">title only</mwc-list-item>
        </ha-select>
        <div></div>
      </div>
      <div class="side-by-side">
        <div>
          <ha-formfield .label=${'Show temperature decimals'}>
            <ha-switch .checked=${this._option_show_overview_decimals !== false} .configValue=${'option_show_overview_decimals'}
              @change=${this._valueChanged}>
            </ha-switch>
          </ha-formfield>
        </div>
        <div>
          <ha-formfield .label=${'Show separator'}>
            <ha-switch .checked=${this._option_show_overview_separator !== false} .configValue=${'option_show_overview_separator'}
              @change=${this._valueChanged}>
            </ha-switch>
          </ha-formfield>
        </div>
      </div>
    `;
  }

  private _sectionExtendedEditor(): TemplateResult {
    const attr_names: TemplateResult[] = [];
    if (this._extended_use_attr === true) {
      const attrs = this.hass !== undefined && this.hass.states[this._entity_extended] !== undefined ? this.hass.states[this._entity_extended].attributes : [];
      for (const element in attrs) {
        attr_names.push(html`<mwc-list-item value="${element}">${element}</mwc-list-item>`);
      }
    }

    return html`
      <ha-entity-picker .hass=${this.hass} .configValue=${'entity_extended'} .value=${this._entity_extended} .includeDomains=${['sensor']}
        name="entity_extended" label="Entity Extended Forecast" allow-custom-entity
        @value-changed=${this._valueChangedPicker}>
      </ha-entity-picker>
      ${this._entity_extended !== '' ? html`
        <div class="side-by-side">
          <div>
            <ha-formfield .label=${'Use Attribute'}>
              <ha-switch .checked=${this._extended_use_attr !== false} .configValue=${'extended_use_attr'}
                @change=${this._valueChanged}>
              </ha-switch>
            </ha-formfield>
          </div>
          ${this._entity_extended !== '' && this._extended_use_attr === true ? html`<ha-selector .hass=${this.hass} .entityId=${this._entity_extended}
            .selector = ${{ attribute: { entity_id: this._entity_extended } }} .required=${false}
            .configValue=${'extended_name_attr'} .value=${this._extended_name_attr} name="extended_name_attr" label="Attribute"
            allow-custom-value
            @value-changed=${this._valueChangedPicker}>
          </ha-selector>` : html``}
        </div>` : html``}
      <ha-entity-picker .hass=${this.hass} .configValue=${'entity_todays_uv_forecast'} .value=${this._entity_todays_uv_forecast} .includeDomains=${['sensor']}
        name="entity_todays_uv_forecast" label="Entity Today's UV Forecast" allow-custom-entity
        @value-changed=${this._valueChangedPicker}>
      </ha-entity-picker>
      <ha-entity-picker .hass=${this.hass} .configValue=${'entity_todays_fire_danger'} .value=${this._entity_todays_fire_danger} .includeDomains=${['sensor']}
        name="entity_todays_fire_danger" label="Entity Today's Fire Danger" allow-custom-entity
        @value-changed=${this._valueChangedPicker}>
      </ha-entity-picker>
    `;
  }

  private _sectionSlotsEditor(): TemplateResult {
    const slotValues = html`
      <mwc-list-item value="humidity">Current humidity</mwc-list-item>
      <mwc-list-item value="rainfall">Today's recorded rainfall</mwc-list-item>
      <mwc-list-item value="pressure">Current air pressure</mwc-list-item>
      <mwc-list-item value="wind">Current wind conditions</mwc-list-item>
      <mwc-list-item value="wind_kt">Current wind conditions kts</mwc-list-item>
      <mwc-list-item value="visibility">Current visibility</mwc-list-item>
      <mwc-list-item value="observed_max">Today's observed max</mwc-list-item>
      <mwc-list-item value="observed_min">Today's observed min</mwc-list-item>
      <mwc-list-item value="forecast_max">Today's forecast max</mwc-list-item>
      <mwc-list-item value="forecast_min">Today's forecast min</mwc-list-item>
      <mwc-list-item value="temp_next">Next temp min/max</mwc-list-item>
      <mwc-list-item value="temp_following">Following temp min/max</mwc-list-item>
      <mwc-list-item value="temp_maximums">Observed/forecast max</mwc-list-item>
      <mwc-list-item value="temp_minimums">Observed/forecast min</mwc-list-item>
      <mwc-list-item value="sun_next">Next sun rise/set time</mwc-list-item>
      <mwc-list-item value="sun_following">Following sun rise/set time</mwc-list-item>
      <mwc-list-item value="pop">Chance of rain</mwc-list-item>
      <mwc-list-item value="popforecast">Rainfall forecast</mwc-list-item>
      <mwc-list-item value="possible_today">Today's forecast rainfall</mwc-list-item>
      <mwc-list-item value="possible_tomorrow">Tomorrow's forecast rainfall</mwc-list-item>
      <mwc-list-item value="uv_summary">Today's uv forecast</mwc-list-item>
      <mwc-list-item value="fire_danger">Today's fire danger</mwc-list-item>
      <mwc-list-item value="custom1">Custom entity 1</mwc-list-item>
      <mwc-list-item value="custom2">Custom entity 2</mwc-list-item>
      <mwc-list-item value="custom3">Custom entity 3</mwc-list-item>
      <mwc-list-item value="custom4">Custom entity 4</mwc-list-item>
      <mwc-list-item value="empty">Blank slot</mwc-list-item>
      <mwc-list-item value="remove">Remove slot</mwc-list-item>`;

    return html`
      <div class="side-by-side">
        <ha-select label="Slot Left 1" .configValue=${'slot_l1'} .value=${this._slot_l1 || 'forecast_max'}
          @selected=${this._valueChanged} @closed=${(ev: { stopPropagation: () => any; }) => ev.stopPropagation()}>
          ${slotValues}
        </ha-select>
        <ha-select label="Slot Right 1" .configValue=${'slot_r1'} .value=${this._slot_r1 || 'popforecast'}
          @selected=${this._valueChanged} @closed=${(ev: { stopPropagation: () => any; }) => ev.stopPropagation()}>
          ${slotValues}
        </ha-select>
      </div>
      <div class="side-by-side">
        <ha-select label="Slot Left 2" .configValue=${'slot_l2'} .value=${this._slot_l2 || 'forecast_min'}
          @selected=${this._valueChanged} @closed=${(ev: { stopPropagation: () => any; }) => ev.stopPropagation()}>
          ${slotValues}
        </ha-select>
        <ha-select label="Slot Right 2" .configValue=${'slot_r2'} .value=${this._slot_r2 || 'humidity'}
          @selected=${this._valueChanged} @closed=${(ev: { stopPropagation: () => any; }) => ev.stopPropagation()}>
          ${slotValues}
        </ha-select>
      </div>
      <div class="side-by-side">
        <ha-select label="Slot Left 3" .configValue=${'slot_l3'} .value=${this._slot_l3 || 'wind'}
          @selected=${this._valueChanged} @closed=${(ev: { stopPropagation: () => any; }) => ev.stopPropagation()}>
          ${slotValues}
        </ha-select>
        <ha-select label="Slot Right 3" .configValue=${'slot_r3'} .value=${this._slot_r3 || 'uv_summary'}
          @selected=${this._valueChanged} @closed=${(ev: { stopPropagation: () => any; }) => ev.stopPropagation()}>
          ${slotValues}
        </ha-select>
      </div>
      <div class="side-by-side">
        <ha-select label="Slot Left 4" .configValue=${'slot_l4'} .value=${this._slot_l4 || 'pressure'}
          @selected=${this._valueChanged} @closed=${(ev: { stopPropagation: () => any; }) => ev.stopPropagation()}>
          ${slotValues}
        </ha-select>
        <ha-select label="Slot Right 4" .configValue=${'slot_r4'} .value=${this._slot_r4 || 'fire_danger'}
          @selected=${this._valueChanged} @closed=${(ev: { stopPropagation: () => any; }) => ev.stopPropagation()}>
          ${slotValues}
        </ha-select>
      </div>
      <div class="side-by-side">
        <ha-select label="Slot Left 5" .configValue=${'slot_l5'} .value=${this._slot_l5 || 'sun_next'}
          @selected=${this._valueChanged} @closed=${(ev: { stopPropagation: () => any; }) => ev.stopPropagation()}>
          ${slotValues}
        </ha-select>
        <ha-select label="Slot Right 5" .configValue=${'slot_r5'} .value=${this._slot_r5 || 'sun_following'}
          @selected=${this._valueChanged} @closed=${(ev: { stopPropagation: () => any; }) => ev.stopPropagation()}>
          ${slotValues}
        </ha-select>
      </div>
      <div class="side-by-side">
        <ha-select label="Slot Left 6" .configValue=${'slot_l6'} .value=${this._slot_l6 || 'remove'}
          @selected=${this._valueChanged} @closed=${(ev: { stopPropagation: () => any; }) => ev.stopPropagation()}>
          ${slotValues}
        </ha-select>
        <ha-select label="Slot Right 6" .configValue=${'slot_r6'} .value=${this._slot_r6 || 'remove'}
          @selected=${this._valueChanged} @closed=${(ev: { stopPropagation: () => any; }) => ev.stopPropagation()}>
          ${slotValues}
        </ha-select>
      </div>
      <div class="side-by-side">
        <ha-select label="Slot Left 7" .configValue=${'slot_l7'} .value=${this._slot_l7 || 'remove'}
          @selected=${this._valueChanged} @closed=${(ev: { stopPropagation: () => any; }) => ev.stopPropagation()}>
          ${slotValues}
        </ha-select>
        <ha-select label="Slot Right 7" .configValue=${'slot_r7'} .value=${this._slot_r7 || 'remove'}
          @selected=${this._valueChanged} @closed=${(ev: { stopPropagation: () => any; }) => ev.stopPropagation()}>
          ${slotValues}
        </ha-select>
      </div>
      <div class="side-by-side">
        <ha-select label="Slot Left 8" .configValue=${'slot_l8'} .value=${this._slot_l8 || 'remove'}
          @selected=${this._valueChanged} @closed=${(ev: { stopPropagation: () => any; }) => ev.stopPropagation()}>
          ${slotValues}
        </ha-select>
        <ha-select label="Slot Right 8" .configValue=${'slot_r8'} .value=${this._slot_r8 || 'remove'}
          @selected=${this._valueChanged} @closed=${(ev: { stopPropagation: () => any; }) => ev.stopPropagation()}>
          ${slotValues}
        </ha-select>
      </div>
      ${this._optional_entities}
    `;
  }

  private _optionSlotsEditor(): TemplateResult {
    return html`
      <div class="side-by-side">
        <div>
          <ha-formfield .label=${'Todays Temperature Decimals'}>
            <ha-switch .checked=${this._option_today_temperature_decimals !== false} .configValue=${'option_today_temperature_decimals'}
              @change=${this._valueChanged}>
            </ha-switch>
          </ha-formfield>
        </div>
        <ha-select label="Pressure Decimals" .configValue=${'option_pressure_decimals'}
          .value=${this._option_pressure_decimals ? this._option_pressure_decimals.toString() : null} @closed=${(ev: { stopPropagation: () => any; }) => ev.stopPropagation()} @selected=${this._valueChangedNumber}>
          <mwc-list-item></mwc-list-item>
          <mwc-list-item value="0">0</mwc-list-item>
          <mwc-list-item value="1">1</mwc-list-item>
          <mwc-list-item value="2">2</mwc-list-item>
          <mwc-list-item value="3">3</mwc-list-item>
        </ha-select>
      </div>
      <div class="side-by-side">
        <div>
          <ha-formfield .label=${'Todays Rainfall Decimals'}>
            <ha-switch .checked=${this._option_today_rainfall_decimals !== false} .configValue=${'option_today_rainfall_decimals'}
              @change=${this._valueChanged}>
            </ha-switch>
          </ha-formfield>
        </div>
        <div>
        </div>
      </div>
      <div class="side-by-side">
        <div>
          <ha-formfield .label=${'Colour Fire Danger'}>
            <ha-switch .checked=${this._option_color_fire_danger !== false} .configValue=${'option_color_fire_danger'}
              @change=${this._valueChanged}>
            </ha-switch>
          </ha-formfield>
        </div>
        <div>
        </div>
      </div>
    `;
  }

  private _sectionDailyForecastEditor(): TemplateResult {
    const attr_names: TemplateResult[] = [];
    if (this._daily_extended_use_attr === true) {
      const attrs = this.hass !== undefined && this.hass.states[this._entity_extended_1] !== undefined ? this.hass.states[this._entity_extended_1].attributes : [];
      for (const element in attrs) {
        attr_names.push(html`<mwc-list-item value="${element}">${element}</mwc-list-item>`);
      }
    }

    return html`
      <ha-entity-picker .hass=${this.hass} .configValue=${'entity_forecast_icon_1'} .value=${this._entity_forecast_icon_1} .includeDomains=${['sensor', 'weather']}
        name="entity_forecast_icon_1" label="Entity Forecast Icon 1" allow-custom-entity
        @value-changed=${this._valueChangedPicker}>
      </ha-entity-picker>
      <ha-entity-picker .hass=${this.hass} .configValue=${'entity_summary_1'} .value=${this._entity_summary_1} .includeDomains=${['sensor', 'weather']}
        name="entity_summary_1" label="Entity Forecast Summary 1" allow-custom-entity
        @value-changed=${this._valueChangedPicker}>
      </ha-entity-picker>
      <ha-entity-picker .hass=${this.hass} .configValue=${'entity_forecast_min_1'} .value=${this._entity_forecast_min_1} .includeDomains=${['sensor', 'weather']}
        name="entity_forecast_min_1" label="Entity Forecast Min 1" allow-custom-entity @value-changed=${this._valueChangedPicker}>
      </ha-entity-picker>
      <ha-entity-picker .hass=${this.hass} .configValue=${'entity_forecast_max_1'} .value=${this._entity_forecast_max_1} .includeDomains=${['sensor', 'weather']}
        name="entity_forecast_max_1" label="Entity Forecast Max 1" allow-custom-entity @value-changed=${this._valueChangedPicker}>
      </ha-entity-picker>
      <ha-entity-picker .hass=${this.hass} .configValue=${'entity_pop_1'} .value=${this._entity_pop_1}  .includeDomains=${['sensor', 'weather']}
        name="entity_pop_1" label="Entity Forecast Chance of Rain 1" allow-custom-entity @value-changed=${this._valueChangedPicker}>
      </ha-entity-picker>
      <ha-entity-picker .hass=${this.hass} .configValue=${'entity_pos_1'} .value=${this._entity_pos_1}  .includeDomains=${['sensor', 'weather']}
        name="entity_pos_1" label="Entity Forecast Possible Rain 1" allow-custom-entity @value-changed=${this._valueChangedPicker}>
      </ha-entity-picker>
      ${this._daily_forecast_layout === 'vertical' ? html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_extended_1'} .value=${this._entity_extended_1} .includeDomains=${['sensor']}
          name="entity_extended_1" label="Entity Extended Forecast 1" allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
        ${this._entity_extended_1 !== '' ? html`
          <div class="side-by-side">
            <div>
              <ha-formfield .label=${'Use Attribute'}>
                <ha-switch .checked=${this._daily_extended_use_attr !== false} .configValue=${'daily_extended_use_attr'}
                  @change=${this._valueChanged}>
                </ha-switch>
              </ha-formfield>
            </div>
            ${this._entity_extended_1 !== '' && this._daily_extended_use_attr === true ? html`
              <ha-selector .hass=${this.hass} .entityId=${this._entity_extended_1} .configValue=${'daily_extended_name_attr'} .value=${this._daily_extended_name_attr} .includeDomains=${['sensor']}
                .selector = ${{ attribute: { entity_id: this._entity_extended_1 } }} .required=${false}
                name="daily_extended_name_attr" label="Attribute" allow-custom-value @value-changed=${this._valueChangedPicker}>
              </ha-selector>` : html``}
          </div>` : html``}
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_fire_danger_1'} .value=${this._entity_fire_danger_1} .includeDomains=${['sensor']}
          name="entity_fire_danger_1" label="Entity Fire Danger 1" allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : ``}
    `;
  }

  private _optionDailyForecastEditor(): TemplateResult {
    return html`
      <div class="side-by-side">
        <ha-select label="Daily Forecast Layout" .configValue=${'daily_forecast_layout'}
          .value=${this._daily_forecast_layout} @closed=${(ev: { stopPropagation: () => any; }) => ev.stopPropagation()} @selected=${this._valueChanged}>
          <mwc-list-item></mwc-list-item>
          <mwc-list-item value="horizontal">horizontal</mwc-list-item>
          <mwc-list-item value="vertical">vertical</mwc-list-item>
        </ha-select>
        <div></div>
      </div>
      <div class="side-by-side">
        <ha-select label="Daily Forecast Days" .configValue=${'daily_forecast_days'}
          .value=${this._daily_forecast_days ? this._daily_forecast_days.toString() : null} @closed=${(ev: { stopPropagation: () => any; }) => ev.stopPropagation()} @selected=${this._valueChangedNumber}>
          <mwc-list-item></mwc-list-item>
          <mwc-list-item value="1">1</mwc-list-item>
          <mwc-list-item value="2">2</mwc-list-item>
          <mwc-list-item value="3">3</mwc-list-item>
          <mwc-list-item value="4">4</mwc-list-item>
          <mwc-list-item value="5">5</mwc-list-item>
          ${this._daily_forecast_layout === 'vertical' ? html`
            <mwc-list-item value="6">6</mwc-list-item>
            <mwc-list-item value="7">7</mwc-list-item>` : html``}
        </ha-select>
        ${this._daily_forecast_layout === 'vertical' ? html`<ha-select label="Daily Extended Days"
          .configValue=${'daily_extended_forecast_days'} .value=${this._daily_extended_forecast_days !== null ?
          this._daily_extended_forecast_days.toString() : null} @closed=${(ev: { stopPropagation: () => any; }) => ev.stopPropagation()} @selected=${this._valueChangedNumber}>
          <mwc-list-item></mwc-list-item>
          <mwc-list-item value="0">0</mwc-list-item>
          <mwc-list-item value="1">1</mwc-list-item>
          <mwc-list-item value="2">2</mwc-list-item>
          <mwc-list-item value="3">3</mwc-list-item>
          <mwc-list-item value="4">4</mwc-list-item>
          <mwc-list-item value="5">5</mwc-list-item>
          <mwc-list-item value="6">6</mwc-list-item>
          <mwc-list-item value="7">7</mwc-list-item>
        </ha-select>` : html`<div></div>`}
      </div>

        <div class="side-by-side">
          <div>
            ${this._daily_forecast_layout !== 'vertical' ? html`
              <ha-formfield .label=${'Enable forecast tooltips'}>
                <ha-switch .checked = ${this._option_tooltips !== false} .configValue = ${'option_tooltips'} @change=${this._valueChanged}>
                </ha-switch>
              </ha-formfield>` : html``}
          </div>
          <div></div>
        </div>
        <div class="side-by-side">
        ${this._daily_forecast_layout === 'vertical' ? html`<div>
          <ha-formfield .label=${'Colour Fire Danger'}>
            <ha-switch .checked=${this._option_daily_color_fire_danger !== false} .configValue=${'option_daily_color_fire_danger'}
              @change=${this._valueChanged}>
            </ha-switch>
          </ha-formfield>
        </div>` : html``}
        <div>
        </div>
      </div>
    `;
  }

  private _optionGlobalOptionsEditor(): TemplateResult {
    return html`
      <div class="side-by-side">
        <div>
          <ha-formfield .label=${'Show Static Icons'}>
            <ha-switch .checked=${this._option_static_icons !== false} .configValue=${'option_static_icons'} @change=${this._valueChanged}>
            </ha-switch>
          </ha-formfield>
        </div>
        <div></div>
      </div>
      <div class="side-by-side">
        <ha-select label="Time Format" .configValue=${'option_time_format'} .value=${this._option_time_format} @closed=${(ev: { stopPropagation: () => any; }) => ev.stopPropagation()} @selected=${this._valueChanged}>
          <mwc-list-item></mwc-list-item>
          <mwc-list-item value="system">System</mwc-list-item>
          <mwc-list-item value="12hour">12 hour</mwc-list-item>
          <mwc-list-item value="24hour">24 hour</mwc-list-item>
        </ha-select>
        <ha-textfield label="Locale" .value=${this._option_locale} .configValue=${'option_locale'} @input=${this._valueChanged}>
        </ha-textfield>
      </div>
    `;
  }

  private _renderSubElementEditor(): TemplateResult {
    const subel: TemplateResult[] = [
      html`
        <div class="header">
          <div class="back-title">
            <mwc-icon-button @click=${this._goBack}>
              <ha-icon icon="mdi:arrow-left"></ha-icon>
            </mwc-icon-button>
          </div>
        </div>
      `,
    ];
    switch (this._subElementEditor) {
      case 'section_overview':
        subel.push(this._sectionOverviewEditor());
        break;
      case 'option_overview':
        subel.push(this._optionOverviewEditor());
        break;
      case 'section_extended':
        subel.push(this._sectionExtendedEditor());
        break;
      case 'section_slots':
        subel.push(this._sectionSlotsEditor());
        break;
      case 'option_slots':
        subel.push(this._optionSlotsEditor());
        break;
      case 'section_daily_forecast':
        subel.push(this._sectionDailyForecastEditor());
        break;
      case 'option_daily_forecast':
        subel.push(this._optionDailyForecastEditor());
        break;
      case 'option_global_options':
        subel.push(this._optionGlobalOptionsEditor());
        break;
    }
    return html`${subel}`;
  }

  private _goBack(): void {
    this._subElementEditor = undefined;
  }

  get _show_section_overview(): boolean {
    return this._config?.show_section_overview !== false; //default on
  }

  get _show_section_extended(): boolean {
    return this._config?.show_section_extended !== false; //default on
  }

  get _show_section_slots(): boolean {
    return this._config?.show_section_slots !== false; //default on
  }

  get _show_section_daily_forecast(): boolean {
    return this._config?.show_section_daily_forecast !== false; //default on
  }

  private getConfigBlock(block: string, first: boolean, last: boolean): TemplateResult {
    switch (block) {
      case 'overview':
        return html`
          <div class="section-flex edit-overview-section">
            <ha-formfield .label=${`Overview Section`}>
              <ha-switch .checked = ${this._show_section_overview !== false} .configValue = ${'show_section_overview'} @change=${this._valueChanged}>
              </ha-switch>
            </ha-formfield>
            <div>
              <ha-icon-button class="down-icon" .value=${'overview'} .path=${mdiArrowDown} .disabled=${last} @click="${this._moveDown}">
              </ha-icon-button>
              <ha-icon-button class="up-icon" .value=${'overview'} .path=${mdiArrowUp} .disabled=${first} @click="${this._moveUp}">
              </ha-icon-button>
              <ha-icon-button class="edit-icon" .value=${'section_overview'} .path=${mdiPencil} @click="${this._editSubmenu}">
              </ha-icon-button>
              <ha-icon-button class="option-icon" .value=${'option_overview'} .path=${mdiApplicationEditOutline} @click="${this._editSubmenu}">
              </ha-icon-button>
            </div>
          </div>
        `;
      case 'extended':
        return html`
          <div class="section-flex edit-extended-section">
            <ha-formfield .label=${`Extended Section`}>
              <ha-switch .checked=${this._show_section_extended !== false} .configValue=${'show_section_extended'} @change=${this._valueChanged}>
              </ha-switch>
            </ha-formfield>
            <div>
              <ha-icon-button class="down-icon" .value=${'extended'} .path=${mdiArrowDown} .disabled=${last} @click="${this._moveDown}">
              </ha-icon-button>
              <ha-icon-button class="up-icon" .value=${'extended'} .path=${mdiArrowUp} .disabled=${first} @click="${this._moveUp}">
              </ha-icon-button>
              <ha-icon-button class="edit-icon" .value=${'section_extended'} .path=${mdiPencil} @click="${this._editSubmenu}">
              </ha-icon-button>
              <div class="no-icon"></div>
            </div>
          </div>
        `;
      case 'slots':
        return html`
          <div class="section-flex edit-slots-section">
            <ha-formfield .label=${`Slots Section`}>
              <ha-switch .checked = ${this._show_section_slots !== false} .configValue = ${'show_section_slots'} @change=${this._valueChanged}>
              </ha-switch>
            </ha-formfield>
            <div>
              <ha-icon-button class="down-icon" .value=${'slots'} .path=${mdiArrowDown} .disabled=${last} @click="${this._moveDown}">
              </ha-icon-button>
              <ha-icon-button class="up-icon" .value=${'slots'} .path=${mdiArrowUp} .disabled=${first} @click="${this._moveUp}">
              </ha-icon-button>
              <ha-icon-button class="edit-icon" .value=${'section_slots'} .path=${mdiPencil} @click="${this._editSubmenu}">
              </ha-icon-button>
              <ha-icon-button class="options-icon" .value=${'option_slots'} .path=${mdiApplicationEditOutline} @click="${this._editSubmenu}">
              </ha-icon-button>
            </div>
          </div>
        `;
      case 'daily_forecast':
        return html`
          <div class="section-flex edit-daily-forecast-section">
            <ha-formfield .label=${`Daily Forecast Section`}>
              <ha-switch .checked=${this._show_section_daily_forecast !== false} .configValue=${'show_section_daily_forecast'} @change=${this._valueChanged}>
              </ha-switch>
            </ha-formfield>
            <div>
              <ha-icon-button class="down-icon" .value=${'daily_forecast'} .path=${mdiArrowDown} .disabled=${last} @click="${this._moveDown}">
              </ha-icon-button>
              <ha-icon-button class="up-icon" .value=${'daily_forecast'} .path=${mdiArrowUp} .disabled=${first} @click="${this._moveUp}">
              </ha-icon-button>
              <ha-icon-button class="edit-icon" .value=${'section_daily_forecast'} .path=${mdiPencil} @click="${this._editSubmenu}">
              </ha-icon-button>
              <ha-icon-button class="options-icon" .value=${'option_daily_forecast'} .path=${mdiApplicationEditOutline} @click="${this._editSubmenu}">
              </ha-icon-button>
            </div>
          </div>
        `;
      case 'global_options':
        return html`
          <div class="section-flex">
            <ha-formfield class="no-switch" .label=${`Global Options`}>
            </ha-formfield>
            <div>
              <div class="no-icon"></div>
              <ha-icon-button class="edit-icon" .value=${'option_global_options'} .path=${mdiApplicationEditOutline} @click="${this._editSubmenu}">
              </ha-icon-button>
            </div>
          </div>
        `;
    }
    return html``;
  }

  protected render(): TemplateResult | void {
    if (!this.hass || !this._helpers) {
      return html``;
    }

    if (this._subElementEditor) return this._renderSubElementEditor();

    const htmlConfig: TemplateResult[] = [];
    const slots = this._section_order || [];

    slots.forEach((slot, index) => {
      htmlConfig.push(this.getConfigBlock(slot, index === 0, index + 1 === slots.length));
    });
    htmlConfig.push(this.getConfigBlock('global_options', false, false));

    return html`${htmlConfig}`;
  }

  private _initialize(): void {
    if (this.hass === undefined) return;
    if (this._config === undefined) return;
    if (this._helpers === undefined) return;
    this._initialized = true;
  }

  private async loadCardHelpers(): Promise<void> {
    this._helpers = await (window as any).loadCardHelpers();
  }

  private _valueChangedPicker(ev): void {
    if (!this._config || !this.hass) {
      return;
    }
    const target = ev.target;
    const value = ev.detail.value;
    if (this[`_${target.configValue}`] === value) {
      return;
    }
    if (target.configValue) {
      if (value) {
        this._config = {
          ...this._config,
          [target.configValue]: value,
        };
      } else {
        this._config = { ...this._config };
        delete this._config[target.configValue];
      }
    }
    fireEvent(this, 'config-changed', { config: this.sortObjectByKeys(this._config) });
  }

  private _editSubmenu(ev): void {
    if (ev.currentTarget) {
      const target = ev.currentTarget;
      this._subElementEditor = target.value;
    }
  }

  private _moveUp(ev): void {
    if (!this._config || !this.hass) {
      return;
    }
    if (ev.currentTarget) {
      const target = ev.currentTarget;
      if (this._config.section_order) {
        const slot = this._config.section_order.findIndex(t => t === target.value);
        const tmp_section_order = [...this._config.section_order];
        [tmp_section_order[slot], tmp_section_order[slot - 1]] = [this._config.section_order[slot - 1], this._config.section_order[slot]];
        this._config = {
          ...this._config,
          section_order: tmp_section_order,
        }
        //        [this._config.section_order[slot], this._config.section_order[slot - 1]] = [this._config.section_order[slot - 1], this._config.section_order[slot]];
      }
    }
    fireEvent(this, 'config-changed', { config: this.sortObjectByKeys(this._config) });
  }

  private _moveDown(ev): void {
    if (!this._config || !this.hass) {
      return;
    }
    if (ev.currentTarget) {
      const target = ev.currentTarget;
      if (this._config.section_order) {
        const slot = this._config.section_order.findIndex(t => t === target.value);
        const tmp_section_order = [...this._config.section_order];
        [tmp_section_order[slot], tmp_section_order[slot + 1]] = [this._config.section_order[slot + 1], this._config.section_order[slot]]
        this._config = {
          ...this._config,
          section_order: tmp_section_order,
        }
        //        [this._config.section_order[slot], this._config.section_order[slot + 1]] = [this._config.section_order[slot + 1], this._config.section_order[slot]];
      }
    }
    fireEvent(this, 'config-changed', { config: this.sortObjectByKeys(this._config) });
  }

  private _valueChanged(ev): void {
    if (!this._config || !this.hass) {
      return;
    }
    const target = ev.target;
    if (this[`_${target.configValue}`] === target.value) {
      return;
    }
    if (target.configValue) {
      if (target.value === '') {
        const tmpConfig = { ...this._config };
        delete tmpConfig[target.configValue];
        this._config = tmpConfig;
      } else {
        this._config = {
          ...this._config,
          [target.configValue]: target.checked !== undefined ? target.checked : target.value,
        };
      }
    }
    fireEvent(this, 'config-changed', { config: this.sortObjectByKeys(this._config) });
  }

  private _valueChangedNumber(ev): void {
    if (!this._config || !this.hass) {
      return;
    }
    const target = ev.target;
    if (this[`_${target.configValue}`] === target.value) {
      return;
    }
    if (target.configValue) {
      if (target.value === '' || target.value === null) {
        delete this._config[target.configValue];
      } else {
        this._config = {
          ...this._config,
          [target.configValue]: Number(target.value),
        };
      }
    }
    fireEvent(this, 'config-changed', { config: this.sortObjectByKeys(this._config) });
  }

  static styles: CSSResultGroup = css`
    :host {
      display: block;
              /* --mdc-menu-min-width: var(--parentWidth); */
      --mdc-menu-item-height: 36px;
      --mdc-typography-subtitle1-font-size: 13px;
    }
    mwc-select {
      display: block;
    }
    ha-textfield {
      display: block;
    }
    ha-switch {
      --mdc-theme-secondary: var(--switch-checked-color);
    }
    ha-formfield {
      height: 56px;
    }
    .no-icon {
      display: inline-flex;
      width: var(--mds-icon-button-size, 48px);
    }
    /* .option {
      cursor: pointer;
    } */
    /* .row {
      display: flex;
      margin-bottom: -14px;
      pointer-events: none;
    } */
    /* .title {
      padding-left: 16px;
      margin-top: -6px;
      pointer-events: none;
    } */
    /* .secondary {
      padding-left: 40px;
      color: var(--secondary-text-color);
      pointer-events: none;
    } */
    /* .values {
      padding-left: 16px;
      background: var(--secondary-background-color);
    } */
    .section-flex {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .side-by-side {
      display: flex;
    }
    .side-by-side > * {
      flex: 1;
    }
    .side-by-side :not(:last-child) {
      padding-right: 4px;
    }
    .icon-side-by-side {
      display: flex;
    }
    .icon-condition {
      flex-grow: 1;
    }
    .no-switch {
      padding-left: 48px;
    }
    .condition_icon {
      position: relative;
    }
    .condition_icon .condition_icon_big {
      visibility: hidden;
      width: 96px;
      background-color: var(--card-background-color);
      border-radius: 6px;
      border-style: solid;
      border-width: 2px;
      /* Position the tooltip */
      position: absolute;
      z-index: 1;
      bottom: -50%;
      left: 60%;
      -webkit-transform: translateX(0%); /* Safari iOS */
      transform: translateX(-40%);
    }
    .condition_icon .condition_icon_big:after {
        content: "";
        position: absolute;
        top: 100%;
        left: 50%;
      }
    .condition_icon:hover .condition_icon_big {
      visibility: visible
    }
  `;
}
