/* eslint-disable @typescript-eslint/no-explicit-any */
import { LitElement, html, TemplateResult, css, CSSResultGroup } from 'lit';
import { HomeAssistant, fireEvent, LovelaceCardEditor } from 'custom-card-helpers';

import { keys } from 'ts-transformer-keys';

import { mdiPencil, mdiArrowDown, mdiArrowUp, mdiBacteria } from '@mdi/js';
//import { mdiPencil, mdiArrowDown, mdiArrowUp, mdiSquareEditOutline } from '@mdi/js';

import { ScopedRegistryHost } from '@lit-labs/scoped-registry-mixin';
import { WeatherCardConfig, layoutOrientation, layoutDays, extendedDays, configSlots, iconSets, timeFormat } from './types';
import { customElement, property, state } from 'lit/decorators';
import { formfieldDefinition } from '../elements/formfield';
import { selectDefinition } from '../elements/select';
import { switchDefinition } from '../elements/switch';
import { textfieldDefinition } from '../elements/textfield';

@customElement('weather-card-editor')
export class WeatherCardEditor extends ScopedRegistryHost(LitElement) implements LovelaceCardEditor {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _config?: WeatherCardConfig;

  @state() private _helpers?: any;

  @state() private _subElementEditor: string | undefined = undefined;

  private _initialized = false;

  static elementDefinitions = {
    "ha-card": customElements.get("ha-card"),  // This works because ha-card is ALWAYS loaded before custom cards (for now)
    ...textfieldDefinition,
    ...selectDefinition,
    ...switchDefinition,
    ...formfieldDefinition,
  };

  public setConfig(config: WeatherCardConfig): void {
    console.info(`editor setConfig`);
    this._config = config;
    if (this._section_order === null) {
      this._config = {
        ...this._config,
        ['section_order']: ['title', 'main', 'extended', 'slots', 'daily_forecast'],
      }
      fireEvent(this, 'config-changed', { config: this._config });
    }

    this.loadCardHelpers();
  }

  private _configCleanup() {
    console.info(`configCleanup`);
    if (!this._config || !this.hass) {
      return;
    }

    let tmpConfig = { ...this._config };

    // Rename options
    if (tmpConfig.old_icon) {
      tmpConfig['option_icon_set'] = tmpConfig.old_icon === 'false' ? 'new' : tmpConfig.old_icon === 'hybrid' ? 'hybrid' : 'old';
      delete tmpConfig['old_icon'];
    }

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

    // Remove unused entries
    const keysOfProps = keys<WeatherCardConfig>();
    for (const element in this._config) {
      if (!keysOfProps.includes(element)) {
        console.info(`removing ${element}`);
        delete tmpConfig[element];
      }
    }

    tmpConfig = {
      ...tmpConfig,
      card_config_version: 2,
    }

    this._config = tmpConfig;

    fireEvent(this, 'config-changed', { config: this._config });
  }

  protected shouldUpdate(): boolean {
    if (!this._initialized) {
      this._initialize();
    }

    return true;
  }

  get _section_order(): configSlots[] | null {
    return this._config?.section_order || null;
  }

  get _text_card_title(): string {
    return this._config?.text_card_title || '';
  }

  get _entity_update_time(): string {
    return this._config?.entity_update_time || '';
  }

  get _text_update_time_prefix(): string {
    return this._config?.text_update_time_prefix || '';
  }

  get _entity_temperature(): string {
    return this._config?.entity_temperature || '';
  }

  get _entity_apparent_temp(): string {
    return this._config?.entity_apparent_temp || '';
  }

  get _entity_current_conditions(): string {
    return this._config?.entity_current_conditions || '';
  }

  get _entity_current_text(): string {
    return this._config?.entity_current_text || '';
  }

  get _show_decimals(): boolean {
    return this._config?.show_decimals === true; // default off
  }

  get _show_separator(): boolean {
    return this._config?.show_separator === true; // default off
  }

  get _entity_daily_summary(): string {
    return this._config?.entity_daily_summary || '';
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

  get _entity_daytime_high(): string {
    return this._config?.entity_daytime_high || '';
  }

  get _entity_daytime_low(): string {
    return this._config?.entity_daytime_low || '';
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

  get _entity_possible_today(): string {
    return this._config?.entity_possible_today || '';
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

  get _entity_fire_danger_summary(): string {
    return this._config?.entity_fire_danger_summary || '';
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

  get _entity_forecast_low_temp_1(): string {
    return this._config?.entity_forecast_low_temp_1 || '';
  }

  get _entity_forecast_high_temp_1(): string {
    return this._config?.entity_forecast_high_temp_1 || '';
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

  get _daily_extended_use_attr(): boolean {
    return this._config?.daily_extended_use_attr === true; // default off
  }

  get _daily_extended_name_attr(): string {
    return this._config?.daily_extended_name_attr || '';
  }

  get _option_static_icons(): boolean {
    return this._config?.option_static_icons === true; // default off
  }

  get _option_icon_set(): iconSets | null {
    return this._config?.option_icon_set ?? null;
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
        this._config?.slot_l1 || 'daytime_high' as string,
        this._config?.slot_l2 || 'daytime_low' as string,
        this._config?.slot_l3 || 'wind' as string,
        this._config?.slot_l4 || 'pressure' as string,
        this._config?.slot_l5 || 'sun_next' as string,
        this._config?.slot_l6 || 'sun_next' as string,
        this._config?.slot_r1 || 'pop' as string,
        this._config?.slot_r2 || 'humidity' as string,
        this._config?.slot_r3 || 'uv_summary' as string,
        this._config?.slot_r4 || 'fire_summary' as string,
        this._config?.slot_r5 || 'sun_following' as string,
        this._config?.slot_r6 || 'sun_next' as string,
      ]) {
      switch (slot) {
        case 'daytime_high':
          entities.add('entity_daytime_high');
          break;
        case 'daytime_low':
          entities.add('entity_daytime_low');
          break;
        case 'temp_next':
          entities.add('entity_temp_next').add('entity_temp_next_label');
          break;
        case 'temp_following':
          entities.add('entity_temp_following').add('entity_temp_following_label');
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
        case 'popforecast':
          entities.add('entity_pop').add('entity_possible_today');
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
        case 'fire_summary':
          entities.add('entity_fire_danger_summary');
          break;
        case 'possible_today':
          entities.add('entity_possible_today');
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

    const entity_daytime_high = entities.has("entity_daytime_high") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_daytime_high'} .value=${this._entity_daytime_high}
          name="entity_daytime_high" label="Entity Daytime High (optional)" allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_daytime_low = entities.has("entity_daytime_low") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_daytime_low'} .value=${this._entity_daytime_low}
          name="entity_daytime_low" label="Entity Daytime Low (optional)" allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_temp_next = entities.has("entity_temp_next") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_temp_next'} .value=${this._entity_temp_next}
          name="entity_temp_next" label="Entity Temp Next (optional)" allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_temp_next_label = entities.has("entity_temp_next_label") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_temp_next_label'} .value=${this._entity_temp_next_label}
          name="entity_temp_next_label" label="Entity Temp Next Label (optional)" allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_temp_following = entities.has("entity_temp_following") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_temp_following'} .value=${this._entity_temp_following}
          name="entity_temp_following" label="Entity Temp Following (optional)" allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_temp_following_label = entities.has("entity_temp_following_label") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_temp_following_label'} .value=${this._entity_temp_following_label} name="entity_temp_following_label"
          label="Entity Temp Following Label (optional)" allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_wind_bearing = entities.has("entity_wind_bearing") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_wind_bearing'} .value=${this._entity_wind_bearing}
          name="entity_wind_bearing" label="Entity Wind Bearing (optional)" allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_wind_speed = entities.has("entity_wind_speed") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_wind_speed'} .value=${this._entity_wind_speed}
          name="entity_wind_speed" label="Entity Wind Speed (optional)" allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_wind_gust = entities.has("entity_wind_gust") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_wind_gust'} .value=${this._entity_wind_gust}
          name="entity_wind_gust" label="Entity Wind Gust (optional)" allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_wind_speed_kt = entities.has("entity_wind_speed_kt") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_wind_speed_kt'} .value=${this._entity_wind_speed_kt}
          name="entity_wind_speed_kt" label="Entity Wind Speed Kt (optional)" allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_wind_gust_kt = entities.has("entity_wind_gust_kt") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_wind_gust_kt'} .value=${this._entity_wind_gust_kt}
          name="entity_wind_gust_kt" label="Entity Wind Gust Kt (optional)" allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_visibility = entities.has("entity_visibility") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_visibility'} .value=${this._entity_visibility}
          name="entity_visibility" label="Entity Visibility (optional)" allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_sun = entities.has("entity_sun") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_sun'} .value=${this._entity_sun} name="entity_sun"
          label="Entity Sun (optional)" allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_pop = entities.has("entity_pop") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_pop'} .value=${this._entity_pop} name="entity_pop"
          label="Chance or Rain (optional)" allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_possible_today = entities.has("entity_possible_today") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_possible_today'} .value=${this._entity_possible_today}
          name="entity_possible_today" label="Possible Rain Today (optional)" allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_possible_tomorrow = entities.has("entity_possible_tomorrow") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_possible_tomorrow'} .value=${this._entity_possible_tomorrow}
          name="entity_possible_tomorrow" label="Possible Rain Tomorrow (optional)" allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_humidity = entities.has("entity_humidity") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_humidity'} .value=${this._entity_humidity}
          name="entity_humidity" label="Humidity (optional)" allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_pressure = entities.has("entity_pressure") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_pressure'} .value=${this._entity_pressure}
          name="entity_pressure" label="Atmospheric Pressure (optional)" allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_uv_alert_summary = entities.has("entity_uv_alert_summary") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_uv_alert_summary'} .value=${this._entity_uv_alert_summary}
          name="entity_uv_alert_summary" label="UV Alert Summary (optional)" allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_fire_danger_summary = entities.has("entity_fire_danger_summary") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_fire_danger_summary'} .value=${this._entity_fire_danger_summary}
          name="entity_fire_danger_summary" label="Fire Danger Summary (optional)" allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_rainfall = entities.has("entity_rainfall") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_rainfall'} .value=${this._entity_rainfall}
          name="entity_rainfall" label="Todays Rain (optional)" allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_custom1 = entities.has("custom1") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'custom1_value'} .value=${this._custom1_value} name="custom1_value"
          label="Custom 1 Value (optional)" allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
        <div class="side-by-side">
          <ha-icon-picker .hass=${this.hass} .configValue=${'custom1_icon'} .value=${this._custom1_icon} name="custom1_icon"
            label="Custom 1 Icon (optional)" @value-changed=${this._valueChanged}>
          </ha-icon-picker>
          <mwc-textfield label="Custom 1 Units (optional)" .value=${this._custom1_units} .configValue=${'custom1_units'} @input=${this._valueChanged}>
          </mwc-textfield>
        </div>
      ` : '';

    const entity_custom2 = entities.has("custom2") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'custom2_value'} .value=${this._custom2_value} name="custom2_value"
          label="Custom 2 Value (optional)" allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
        <div class="side-by-side">
          <ha-icon-picker .hass=${this.hass} .configValue=${'custom2_icon'} .value=${this._custom2_icon} name="custom2_icon"
            label="Custom 2 Icon (optional)" @value-changed=${this._valueChanged}>
          </ha-icon-picker>
          <mwc-textfield label="Custom 2 Units (optional)" .value=${this._custom2_units} .configValue=${'custom2_units'} @input=${this._valueChanged}>
          </mwc-textfield>
        </div>
      ` : '';

    const entity_custom3 = entities.has("custom3") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'custom3_value'} .value=${this._custom3_value} name="custom3_value"
          label="Custom 3 Value (optional)" allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
        <div class="side-by-side">
          <ha-icon-picker .hass=${this.hass} .configValue=${'custom3_icon'} .value=${this._custom3_icon} name="custom3_icon"
            label="Custom 3 Icon (optional)" @value-changed=${this._valueChanged}>
          </ha-icon-picker>
          <mwc-textfield label="Custom 3 Units (optional)" .value=${this._custom3_units} .configValue=${'custom3_units'} @input=${this._valueChanged}>
          </mwc-textfield>
        </div>
      ` : '';

    const entity_custom4 = entities.has("custom4") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'custom4_value'} .value=${this._custom4_value} name="custom4_value"
          label="Custom 4 Value (optional)" allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
        <div class="side-by-side">
          <ha-icon-picker .hass=${this.hass} .configValue=${'custom4_icon'} .value=${this._custom4_icon} name="custom4_icon"
            label="Custom 4 Icon (optional)" @value-changed=${this._valueChanged}>
          </ha-icon-picker>
          <mwc-textfield label="Custom 4 Units (optional)" .value=${this._custom4_units} .configValue=${'custom4_units'} @input=${this._valueChanged}>
          </mwc-textfield>
        </div>
      ` : '';

    return html`
      ${entity_daytime_high}
      ${entity_daytime_low}
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
      ${entity_possible_today}
      ${entity_possible_tomorrow}
      ${entity_humidity}
      ${entity_pressure}
      ${entity_uv_alert_summary}
      ${entity_fire_danger_summary}
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
      console.info(`Card Config Version=${this._config.card_config_version || 'no version'}`);
      if (this._config.card_config_version !== 2) {
        this._configCleanup();
      }
    }

    this.loadEditorElements();
  }

  async loadEditorElements() {
    // Get the local customElement registry
    const registry = (this.shadowRoot as any)?.customElements;
    if (!registry) return;

    let c_button: any = undefined;
    // Check if the element we want is already defined in the local scope
    if (!registry.get("ha-entity-picker") ||
      !registry.get("ha-select") ||
      !registry.get("ha-icon-picker") ||
      !registry.get("ha-icon-button") ||
      !registry.get("ha-icon")) {
      // Load in a card that uses the elements needed
      // This part will differ for every element you want
      const ch = await (window as any).loadCardHelpers();
      c_button = await ch.createCardElement({ type: "button", button: [] });
      if (c_button) await c_button.constructor.getConfigElement();
    }

    let c_entity: any = undefined;
    if (!registry.get("ha-entity-attribute-picker")) {
      // Load in a card that uses the elements needed
      // This part will differ for every element you want
      const ch = await (window as any).loadCardHelpers();
      c_entity = await ch.createCardElement({ type: "entity", entity: "sensor.time" });
      await c_entity.constructor.getConfigElement();
    }

    if (c_button) {
      if (!registry.get("ha-entity-picker")) {
        const haElement = window.customElements.get("ha-entity-picker");
        registry.define("ha-entity-picker", haElement);
      }
      if (!registry.get("ha-select")) {
        const haElement = window.customElements.get("ha-select");
        registry.define("ha-select", haElement);
      }
      if (!registry.get("ha-icon-picker")) {
        const haElement = window.customElements.get("ha-icon-picker");
        registry.define("ha-icon-picker", haElement);
      }
      if (!registry.get("ha-icon-button")) {
        const haElement = window.customElements.get("ha-icon-button");
        registry.define("ha-icon-button", haElement);
      }
      if (!registry.get("ha-icon")) {
        const haElement = window.customElements.get("ha-icon");
        registry.define("ha-icon", haElement);
      }
    }

    if (c_entity) {
      if (!registry.get("ha-entity-attribute-picker")) {
        const haElement = window.customElements.get("ha-entity-attribute-picker");
        registry.define("ha-entity-attribute-picker", haElement);
      }
    }
  }

  private _sectionTitleEditor(): TemplateResult {
    return html`
      <mwc-textfield label="Card Title (optional)" .value=${this._text_card_title} .configValue=${'text_card_title'}
        @input=${this._valueChanged}>
      </mwc-textfield>
      <ha-entity-picker .hass=${this.hass} .configValue=${'entity_update_time'} .value=${this._entity_update_time}
        name="entity_update_time" label="Entity Update Time (optional)" allow-custom-entity
        @value-changed=${this._valueChangedPicker}>
      </ha-entity-picker>
      <mwc-textfield label="Update Time Prefix (optional)" .value=${this._text_update_time_prefix}
        .configValue=${'text_update_time_prefix'} @input=${this._valueChanged}>
      </mwc-textfield>
    `;
  }

  private _sectionMainEditor(): TemplateResult {
    return html`
      <ha-entity-picker .hass=${this.hass} .configValue=${'entity_temperature'} .value=${this._entity_temperature}
        name="entity_temperature" label="Entity Current Temperature (required)" allow-custom-entity
        @value-changed=${this._valueChangedPicker}>
      </ha-entity-picker>
      <ha-entity-picker .hass=${this.hass} .configValue=${'entity_apparent_temp'} .value=${this._entity_apparent_temp}
        name="entity_apparent_temp" label="Entity Apparent Temperature (required)" allow-custom-entity
        @value-changed=${this._valueChangedPicker}>
      </ha-entity-picker>
      <ha-entity-picker .hass=${this.hass} .configValue=${'entity_current_conditions'}
        .value=${this._entity_current_conditions} name="entity_current_condition" label="Entity Current Conditions (required)"
        allow-custom-entity @value-changed=${this._valueChangedPicker}>
      </ha-entity-picker>
      <ha-entity-picker .hass=${this.hass} .configValue=${'entity_current_text'} .value=${this._entity_current_text}
        name="entity_current_text" label="Entity Current Text (required)" allow-custom-entity
        @value-changed=${this._valueChangedPicker}>
      </ha-entity-picker>
      <div class="side-by-side">
        <div>
          <mwc-formfield .label=${'Show temperature decimals'}>
            <mwc-switch .checked=${this._show_decimals !== false} .configValue=${'show_decimals'}
              @change=${this._valueChanged}>
            </mwc-switch>
          </mwc-formfield>
        </div>
        <div>
          <mwc-formfield .label=${'Show separator'}>
            <mwc-switch .checked=${this._show_separator !== false} .configValue=${'show_separator'}
              @change=${this._valueChanged}>
            </mwc-switch>
          </mwc-formfield>
        </div>
      </div>
    `;
  }

  private _sectionExtendedEditor(): TemplateResult {
    const attr_names: TemplateResult[] = [];
    if (this._extended_use_attr === true) {
      const attrs = this.hass !== undefined ? this.hass.states[this._entity_daily_summary].attributes : [];
      for (const element in attrs) {
        attr_names.push(html`<mwc-list-item value="${element}">${element}</mwc-list-item>`);
      }
    }

    return html`
      <ha-entity-picker .hass=${this.hass} .configValue=${'entity_daily_summary'} .value=${this._entity_daily_summary}
        name="entity_daily_summary" label="Entity Daily Summary (required)" allow-custom-entity
        @value-changed=${this._valueChangedPicker}>
      </ha-entity-picker>
      <div class="side-by-side">
        <div>
          <mwc-formfield .label=${'Use Attribute'}>
            <mwc-switch .checked=${this._extended_use_attr !== false} .configValue=${'extended_use_attr'}
              @change=${this._valueChanged}>
            </mwc-switch>
          </mwc-formfield>
        </div>
        ${this._extended_use_attr === true ? html`<ha-entity-attribute-picker .hass=${this.hass} .entityId=${this._entity_daily_summary}
          .configValue=${'extended_name_attr'} .value=${this._extended_name_attr} name="extended_name_attr" label="Attribute (optional)"
          allow-custom-value
          @value-changed=${this._valueChangedPicker}>
        </ha-entity-attribute-picker>` : html``}
      </div>
      <ha-entity-picker .hass=${this.hass} .configValue=${'entity_todays_uv_forecast'} .value=${this._entity_todays_uv_forecast}
        name="entity_todays_uv_forecast" label="Entity Today's UV Forecast (optional)" allow-custom-entity
        @value-changed=${this._valueChangedPicker}>
      </ha-entity-picker>
      <ha-entity-picker .hass=${this.hass} .configValue=${'entity_todays_fire_danger'} .value=${this._entity_todays_fire_danger}
        name="entity_todays_fire_danger" label="Entity Today's Fire Danger (optional)" allow-custom-entity
        @value-changed=${this._valueChangedPicker}>
      </ha-entity-picker>
    `;
  }

  private _sectionSlotsEditor(): TemplateResult {
    const slotValues = html`
      <mwc-list-item></mwc-list-item>
      <mwc-list-item value="humidity">Current humidity</mwc-list-item>
      <mwc-list-item value="rainfall">Today's recorded rainfall</mwc-list-item>
      <mwc-list-item value="pressure">Current air pressure</mwc-list-item>
      <mwc-list-item value="wind">Current wind conditions</mwc-list-item>
      <mwc-list-item value="wind_kt">Current wind conditions kts</mwc-list-item>
      <mwc-list-item value="visibility">Current visibility</mwc-list-item>
      <mwc-list-item value="daytime_high">Today's forecast high</mwc-list-item>
      <mwc-list-item value="daytime_low">Today's forecast low</mwc-list-item>
      <mwc-list-item value="temp_next">Next temp min/max</mwc-list-item>
      <mwc-list-item value="temp_following">Following temp min/max</mwc-list-item>
      <mwc-list-item value="sun_next">Next sun rise/set time</mwc-list-item>
      <mwc-list-item value="sun_following">Following sun rise/set time</mwc-list-item>
      <mwc-list-item value="pop">pop</mwc-list-item>
      <mwc-list-item value="popforecast">popforecast</mwc-list-item>
      <mwc-list-item value="possible_today">Today's forecast rainfall</mwc-list-item>
      <mwc-list-item value="possible_tomorrow">Tomorrow's forecast rainfall</mwc-list-item>
      <mwc-list-item value="uv_summary">Today's UV forecast</mwc-list-item>
      <mwc-list-item value="fire_summary">Today's fire danger</mwc-list-item>
      <mwc-list-item value="custom1">Custom entity 1</mwc-list-item>
      <mwc-list-item value="custom2">Custom entity 2</mwc-list-item>
      <mwc-list-item value="custom3">Custom entity 3</mwc-list-item>
      <mwc-list-item value="custom4">Custom entity 4</mwc-list-item>
      <mwc-list-item value="empty">Blank slot</mwc-list-item>
      <mwc-list-item value="remove">Remove slot</mwc-list-item>`;

    return html`
      <div class="side-by-side">
        <ha-select label="Slot Left 1 (optional)" .configValue=${'slot_l1'} .value=${this._slot_l1}
          @selected=${this._valueChanged} @closed=${(ev: { stopPropagation: () => any; }) => ev.stopPropagation()}>
          ${slotValues}
        </ha-select>
        <ha-select label="Slot Right 1 (optional)" .configValue=${'slot_r1'} .value=${this._slot_r1}
          @selected=${this._valueChanged} @closed=${(ev: { stopPropagation: () => any; }) => ev.stopPropagation()}>
          ${slotValues}
        </ha-select>
      </div>
      <div class="side-by-side">
        <ha-select label="Slot Left 2 (optional)" .configValue=${'slot_l2'} .value=${this._slot_l2}
          @selected=${this._valueChanged} @closed=${(ev: { stopPropagation: () => any; }) => ev.stopPropagation()}>
          ${slotValues}
        </ha-select>
        <ha-select label="Slot Right 2 (optional)" .configValue=${'slot_r2'} .value=${this._slot_r2}
          @selected=${this._valueChanged} @closed=${(ev: { stopPropagation: () => any; }) => ev.stopPropagation()}>
          ${slotValues}
        </ha-select>
      </div>
      <div class="side-by-side">
        <ha-select label="Slot Left 3 (optional)" .configValue=${'slot_l3'} .value=${this._slot_l3}
          @selected=${this._valueChanged} @closed=${(ev: { stopPropagation: () => any; }) => ev.stopPropagation()}>
          ${slotValues}
        </ha-select>
        <ha-select label="Slot Right 3 (optional)" .configValue=${'slot_r3'} .value=${this._slot_r3}
          @selected=${this._valueChanged} @closed=${(ev: { stopPropagation: () => any; }) => ev.stopPropagation()}>
          ${slotValues}
        </ha-select>
      </div>
      <div class="side-by-side">
        <ha-select label="Slot Left 4 (optional)" .configValue=${'slot_l4'} .value=${this._slot_l4}
          @selected=${this._valueChanged} @closed=${(ev: { stopPropagation: () => any; }) => ev.stopPropagation()}>
          ${slotValues}
        </ha-select>
        <ha-select label="Slot Right 4 (optional)" .configValue=${'slot_r4'} .value=${this._slot_r4}
          @selected=${this._valueChanged} @closed=${(ev: { stopPropagation: () => any; }) => ev.stopPropagation()}>
          ${slotValues}
        </ha-select>
      </div>
      <div class="side-by-side">
        <ha-select label="Slot Left 5 (optional)" .configValue=${'slot_l5'} .value=${this._slot_l5}
          @selected=${this._valueChanged} @closed=${(ev: { stopPropagation: () => any; }) => ev.stopPropagation()}>
          ${slotValues}
        </ha-select>
        <ha-select label="Slot Right 5 (optional)" .configValue=${'slot_r5'} .value=${this._slot_r5}
          @selected=${this._valueChanged} @closed=${(ev: { stopPropagation: () => any; }) => ev.stopPropagation()}>
          ${slotValues}
        </ha-select>
      </div>
      <div class="side-by-side">
        <ha-select label="Slot Left 6 (optional)" .configValue=${'slot_l6'} .value=${this._slot_l6}
          @selected=${this._valueChanged} @closed=${(ev: { stopPropagation: () => any; }) => ev.stopPropagation()}>
          ${slotValues}
        </ha-select>
        <ha-select label="Slot Right 6 (optional)" .configValue=${'slot_r6'} .value=${this._slot_r6}
          @selected=${this._valueChanged} @closed=${(ev: { stopPropagation: () => any; }) => ev.stopPropagation()}>
          ${slotValues}
        </ha-select>
      </div>
      ${this._optional_entities}
    `;
  }

  private _optionSlotsEditor(): TemplateResult {
    return html`Coming Soon`;
  }

  private _sectionDailyForecastEditor(): TemplateResult {
    const attr_names: TemplateResult[] = [];
    if (this._daily_extended_use_attr === true) {
      const attrs = this.hass !== undefined ? this.hass.states[this._entity_extended_1].attributes : [];
      for (const element in attrs) {
        attr_names.push(html`<mwc-list-item value="${element}">${element}</mwc-list-item>`);
      }
    }

    return html`
      <div class="side-by-side">
        <ha-select label="Daily Forecast Layout (optional)" .configValue=${'daily_forecast_layout'}
          .value=${this._daily_forecast_layout} @closed=${(ev: { stopPropagation: () => any; }) => ev.stopPropagation()} @selected=${this._valueChanged}>
          <mwc-list-item></mwc-list-item>
          <mwc-list-item value="horizontal">horizontal</mwc-list-item>
          <mwc-list-item value="vertical">vertical</mwc-list-item>
        </ha-select>
        <div></div>
      </div>
      <div class="side-by-side">
        <ha-select label="Daily Forecast Days (optional)" .configValue=${'daily_forecast_days'}
          .value=${this._daily_forecast_days ? this._daily_forecast_days.toString() : null} @closed=${(ev: { stopPropagation: () => any; }) => ev.stopPropagation()} @selected=${this._valueChangedNumber}>
          <mwc-list-item></mwc-list-item>
          <mwc-list-item value="1">1</mwc-list-item>
          <mwc-list-item value="2">2</mwc-list-item>
          <mwc-list-item value="3">3</mwc-list-item>
          <mwc-list-item value="4">4</mwc-list-item>
          <mwc-list-item value="5">5</mwc-list-item>
          ${this._daily_forecast_layout === 'vertical' ? html`<mwc-list-item value="6">6</mwc-list-item>
          <mwc-list-item value="7">7</mwc-list-item>` : html``}
        </ha-select>
        ${this._daily_forecast_layout === 'vertical' ? html`<ha-select label="Daily Extended Days (optional)"
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
      <ha-entity-picker .hass=${this.hass} .configValue=${'entity_forecast_icon_1'} .value=${this._entity_forecast_icon_1}
        name="entity_forecast_icon_1" label="Entity Forecast Icon 1 (optional)" allow-custom-entity
        @value-changed=${this._valueChangedPicker}>
      </ha-entity-picker>
      <ha-entity-picker .hass=${this.hass} .configValue=${'entity_summary_1'} .value=${this._entity_summary_1}
        name="entity_summary_1" label="Entity Forecast Summary 1 (optional)" allow-custom-entity
        @value-changed=${this._valueChangedPicker}>
      </ha-entity-picker>
      <ha-entity-picker .hass=${this.hass} .configValue=${'entity_forecast_low_temp_1'}
        .value=${this._entity_forecast_low_temp_1} name="entity_forecast_low_temp_1" label="Entity Forecast Low 1 (optional)"
        allow-custom-entity @value-changed=${this._valueChangedPicker}>
      </ha-entity-picker>
      <ha-entity-picker .hass=${this.hass} .configValue=${'entity_forecast_high_temp_1'}
        .value=${this._entity_forecast_high_temp_1} name="entity_forecast_high_temp_1"
        label="Entity Forecast High 1 (optional)" allow-custom-entity @value-changed=${this._valueChangedPicker}>
      </ha-entity-picker>
      <ha-entity-picker .hass=${this.hass} .configValue=${'entity_pop_1'} .value=${this._entity_pop_1} name="entity_pop_1"
        label="Entity Forecast Pop 1 (optional)" allow-custom-entity @value-changed=${this._valueChangedPicker}>
      </ha-entity-picker>
      <ha-entity-picker .hass=${this.hass} .configValue=${'entity_pos_1'} .value=${this._entity_pos_1} name="entity_pos_1"
        label="Entity Forecast Possible 1 (optional)" allow-custom-entity @value-changed=${this._valueChangedPicker}>
      </ha-entity-picker>
      ${this._daily_forecast_layout === 'vertical' ? html`<ha-entity-picker .hass=${this.hass} .configValue=${'entity_extended_1'}
        .value=${this._entity_extended_1} name="entity_extended_1" label="Entity Forecast Extended 1 (optional)"
        allow-custom-entity
        @value-changed=${this._valueChangedPicker}>
      </ha-entity-picker>
      <div class="side-by-side">
        <div>
          <mwc-formfield .label=${'Use Attribute'}>
            <mwc-switch .checked=${this._daily_extended_use_attr !== false} .configValue=${'daily_extended_use_attr'}
              @change=${this._valueChanged}>
            </mwc-switch>
          </mwc-formfield>
        </div>
        ${this._daily_extended_use_attr === true ? html`<ha-entity-attribute-picker .hass=${this.hass} .entityId=${this._entity_extended_1}
          .configValue=${'daily_extended_name_attr'} .value=${this._daily_extended_name_attr} name="daily_extended_name_attr" label="Attribute (optional)"
          allow-custom-value
          @value-changed=${this._valueChangedPicker}>
        </ha-entity-attribute-picker>` : html``}
      </div>` : ``}
    `;
  }

  private _optionGlobalOptionsEditor(): TemplateResult {
    return html`
      <div class="side-by-side">
        <div>
          <mwc-formfield .label=${'Show static Icons'}>
            <mwc-switch .checked=${this._option_static_icons !== false} .configValue=${'option_static_icons'}
              @change=${this._valueChanged}>
            </mwc-switch>
          </mwc-formfield>
        </div>
        <ha-select label="Icon Set (optional)" .configValue=${'option_icon_set'} .value=${this._option_icon_set} @closed=${(ev: { stopPropagation: () => any; }) => ev.stopPropagation()}
          @selected=${this._valueChanged}>
          <mwc-list-item></mwc-list-item>
          <mwc-list-item value="new">New</mwc-list-item>
          <mwc-list-item value="hybrid">Hybrid</mwc-list-item>
          <mwc-list-item value="old">Old</mwc-list-item>
        </ha-select>
      </div>
      <div class="side-by-side">
        <ha-select label="Time Format (optional)" .configValue=${'option_time_format'} .value=${this._option_time_format} @closed=${(ev: { stopPropagation: () => any; }) => ev.stopPropagation()}
          @selected=${this._valueChanged}>
          <mwc-list-item></mwc-list-item>
          <mwc-list-item value="system">System</mwc-list-item>
          <mwc-list-item value="12hour">12 hour</mwc-list-item>
          <mwc-list-item value="24hour">24 hour</mwc-list-item>
        </ha-select>
        <mwc-textfield label="Locale (optional)" .value=${this._option_locale} .configValue=${'option_locale'} @input=${this._valueChanged}>
        </mwc-textfield>
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
      case 'section_title':
        subel.push(this._sectionTitleEditor());
        break;
      case 'section_main':
        subel.push(this._sectionMainEditor());
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
      case 'option_global_options':
        subel.push(this._optionGlobalOptionsEditor());
        break;
    }
    return html`${subel}`;
  }

  private _goBack(): void {
    this._subElementEditor = undefined;
  }

  get _show_section_title(): boolean {
    return this._config?.show_section_title === true; // default off
  }

  get _show_section_main(): boolean {
    return this._config?.show_section_main !== false; //default on
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
      case 'title':
        return html`
          <div class="main-flex edit-title-section">
            <mwc-formfield .label=${`Title Section`}>
              <mwc-switch .checked=${this._show_section_title !== false} .configValue=${'show_section_title'}
                @change=${this._valueChanged}>
              </mwc-switch>
            </mwc-formfield>
            <div>
              <ha-icon-button class="down-icon" .value=${'title'} .path=${mdiArrowDown} .disabled=${last} @click="${this._moveDown}">
              </ha-icon-button>
              <ha-icon-button class="up-icon" .value=${'title'} .path=${mdiArrowUp} .disabled=${first} @click="${this._moveUp}">
              </ha-icon-button>
              <ha-icon-button class="edit-icon" .value=${'section_title'} .path=${mdiPencil} @click="${this._editSubmenu}">
              </ha-icon-button>
              <div class="no-icon"></div>
            </div>
          </div>
        `;
      case 'main':
        return html`
          <div class="main-flex edit-main-section">
            <mwc-formfield .label=${`Main Section`}>
              <mwc-switch .checked=${this._show_section_main !== false} .configValue=${'show_section_main'}
                @change=${this._valueChanged}>
              </mwc-switch>
            </mwc-formfield>
            <div>
              <ha-icon-button class="down-icon" .value=${'main'} .path=${mdiArrowDown} .disabled=${last} @click="${this._moveDown}">
              </ha-icon-button>
              <ha-icon-button class="up-icon" .value=${'main'} .path=${mdiArrowUp} .disabled=${first} @click="${this._moveUp}">
              </ha-icon-button>
              <ha-icon-button class="edit-icon" .value=${'section_main'} .path=${mdiPencil} @click="${this._editSubmenu}">
              </ha-icon-button>
              <div class="no-icon"></div>
            </div>
          </div>
        `;
      case 'extended':
        return html`
          <div class="main-flex edit-extended-section">
            <mwc-formfield .label=${`Extended Section`}>
              <mwc-switch .checked=${this._show_section_extended !== false} .configValue=${'show_section_extended'}
                @change=${this._valueChanged}>
              </mwc-switch>
            </mwc-formfield>
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
          <div class="main-flex edit-slots-section">
            <mwc-formfield .label=${`Slots Section`}>
              <mwc-switch .checked=${this._show_section_slots !== false} .configValue=${'show_section_slots'}
                @change=${this._valueChanged}>
              </mwc-switch>
            </mwc-formfield>
            <div>
              <ha-icon-button class="down-icon" .value=${'slots'} .path=${mdiArrowDown} .disabled=${last} @click="${this._moveDown}">
              </ha-icon-button>
              <ha-icon-button class="up-icon" .value=${'slots'} .path=${mdiArrowUp} .disabled=${first} @click="${this._moveUp}">
              </ha-icon-button>
              <ha-icon-button class="edit-icon" .value=${'section_slots'} .path=${mdiPencil} @click="${this._editSubmenu}">
              </ha-icon-button>
              <ha-icon-button class="options-icon" .value=${'option_slots'} .path=${mdiBacteria} @click="${this._editSubmenu}">
              </ha-icon-button>
            </div>
          </div>
        `;
      case 'daily_forecast':
        return html`
          <div class="main-flex edit-daily-forecast-section">
            <mwc-formfield .label=${`Daily Forecast Section`}>
              <mwc-switch .checked=${this._show_section_daily_forecast !== false} .configValue=${'show_section_daily_forecast'}
                @change=${this._valueChanged}>
              </mwc-switch>
            </mwc-formfield>
            <div>
              <ha-icon-button class="down-icon" .value=${'daily_forecast'} .path=${mdiArrowDown} .disabled=${last} @click="${this._moveDown}">
              </ha-icon-button>
              <ha-icon-button class="up-icon" .value=${'daily_forecast'} .path=${mdiArrowUp} .disabled=${first} @click="${this._moveUp}">
              </ha-icon-button>
              <ha-icon-button class="edit-icon" .value=${'section_daily_forecast'} .path=${mdiPencil} @click="${this._editSubmenu}">
              </ha-icon-button>
              <div class="no-icon"></div>
            </div>
          </div>
        `;
      case 'global_options':
        return html`
          <div class="main-flex">
            <mwc-formfield class="no-switch" .label=${`Global Options`}>
            </mwc-formfield>
            <div>
              <div class="no-icon"></div>
              <ha-icon-button class="edit-icon" .value=${'option_global_options'} .path=${mdiBacteria}
                @click="${this._editSubmenu}">
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
    if (this[`_${target.configValue}`] === target.value) {
      return;
    }
    if (target.configValue) {
      if (target.value) {
        this._config = {
          ...this._config,
          [target.configValue]: target.value,
        };
      } else {
        delete this._config[target.configValue];
      }
    }
    fireEvent(this, 'config-changed', { config: this._config });
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
      if (this._config['section_order']) {
        const slot = this._config['section_order'].findIndex(t => t === target.value)
        console.info(`MoveUp ${slot}`);
        [this._config['section_order'][slot], this._config['section_order'][slot - 1]] = [this._config['section_order'][slot - 1], this._config['section_order'][slot]];
      }
    }
    fireEvent(this, 'config-changed', { config: this._config });
  }

  private _moveDown(ev): void {
    if (!this._config || !this.hass) {
      return;
    }
    if (ev.currentTarget) {
      const target = ev.currentTarget;
      if (this._config['section_order']) {
        const slot = this._config['section_order'].findIndex(t => t === target.value)
        console.info(`MoveUp ${slot}`);
        [this._config['section_order'][slot], this._config['section_order'][slot + 1]] = [this._config['section_order'][slot + 1], this._config['section_order'][slot]];
      }
    }
    fireEvent(this, 'config-changed', { config: this._config });
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
    fireEvent(this, 'config-changed', { config: this._config });
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
    fireEvent(this, 'config-changed', { config: this._config });
  }

  // private _valueChangedString(ev: CustomEvent): void {
  //   const config = ev.detail.value;

  //   if (config.icon_height && !config.icon_height.endsWith("px")) {
  //     config.icon_height += "px";
  //   }

  //   fireEvent(this, "config-changed", { config });
  // }

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
    mwc-textfield {
      display: block;
    }
    mwc-switch {
      --mdc-theme-secondary: var(--switch-checked-color);
    }
    mwc-formfield {
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
    .main-flex {
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
    .no-switch {
      padding-left: 48px;
    }
  `;
}
