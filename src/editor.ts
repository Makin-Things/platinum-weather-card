/* eslint-disable @typescript-eslint/no-explicit-any */
import { LitElement, html, TemplateResult, css, CSSResultGroup } from 'lit';
import { HomeAssistant, fireEvent, LovelaceCardEditor } from 'custom-card-helpers';

import { ScopedRegistryHost } from '@lit-labs/scoped-registry-mixin';
import { WeatherCardConfig } from './types';
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

  private _initialized = false;

  static elementDefinitions = {
    "ha-card": customElements.get("ha-card"),  // This works because ha-card is ALWAYS loaded before custom cards (for now)
    ...textfieldDefinition,
    ...selectDefinition,
    ...switchDefinition,
    ...formfieldDefinition,
  };

  public setConfig(config: WeatherCardConfig): void {
    this._config = config;

    this.loadCardHelpers();
  }

  protected shouldUpdate(): boolean {
    if (!this._initialized) {
      this._initialize();
    }

    return true;
  }

  get _card_title(): string {
    return this._config?.card_title || '';
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

  get _entity_uv_summary(): string {
    return this._config?.entity_uv_alert_summary || '';
  }

  get _entity_fire_summary(): string {
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

  get _optional_entities(): TemplateResult {
    const entities = new Set();
    for (const slot of
      [
        this._config?.slot_l1 || 'daytime_high' as string,
        this._config?.slot_l2 || 'daytime_low' as string,
        this._config?.slot_l3 || 'wind' as string,
        this._config?.slot_l4 || 'pressure' as string,
        this._config?.slot_l5 || 'sun_next' as string,
        this._config?.slot_r1 || 'pop' as string,
        this._config?.slot_r2 || 'humidity' as string,
        this._config?.slot_r3 || 'uv_summary' as string,
        this._config?.slot_r4 || 'fire_summary' as string,
        this._config?.slot_r5 || 'sun_following' as string
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
          entities.add('entity_wind_visibility');
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
          entities.add('entity_uv_summary');
          break;
        case 'fire_summary':
          entities.add('entity_fire_summary');
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
      }
    }

    const entity_daytime_high = entities.has("entity_daytime_high") ?
      html`<ha-entity-picker .hass=${this.hass} .configValue=${'entity_daytime_high'} .value=${this._entity_daytime_high}
  name="entity_daytime_high" label="Entity Daytime High (optional)" allow-custom-entity
  @value-changed=${this._valueChangedPicker}></ha-entity-picker>` : '';

    const entity_daytime_low = entities.has("entity_daytime_low") ?
      html`<ha-entity-picker .hass=${this.hass} .configValue=${'entity_daytime_low'} .value=${this._entity_daytime_low}
  name="entity_daytime_low" label="Entity Daytime Low (optional)" allow-custom-entity
  @value-changed=${this._valueChangedPicker}></ha-entity-picker>` : '';

    const entity_temp_next = entities.has("entity_temp_next") ?
      html`<ha-entity-picker .hass=${this.hass} .configValue=${'entity_temp_next'} .value=${this._entity_temp_next}
  name="entity_temp_next" label="Entity Temp Next (optional)" allow-custom-entity
  @value-changed=${this._valueChangedPicker}></ha-entity-picker>` : '';

    const entity_temp_next_label = entities.has("entity_temp_next_label") ?
      html`<ha-entity-picker .hass=${this.hass} .configValue=${'entity_temp_next_label'} .value=${this._entity_temp_next_label}
  name="entity_temp_next_label" label="Entity Temp Next Label (optional)" allow-custom-entity
  @value-changed=${this._valueChangedPicker}></ha-entity-picker>` : '';

    const entity_temp_following = entities.has("entity_temp_following") ?
      html`<ha-entity-picker .hass=${this.hass} .configValue=${'entity_temp_following'} .value=${this._entity_temp_following}
  name="entity_temp_following" label="Entity Temp Following (optional)" allow-custom-entity
  @value-changed=${this._valueChangedPicker}></ha-entity-picker>` : '';

    const entity_temp_following_label = entities.has("entity_temp_following_label") ?
      html`<ha-entity-picker .hass=${this.hass} .configValue=${'entity_temp_following_label'}
  .value=${this._entity_temp_following_label} name="entity_temp_following_label"
  label="Entity Temp Following Label (optional)" allow-custom-entity @value-changed=${this._valueChangedPicker}>
</ha-entity-picker>` : '';

    const entity_wind_bearing = entities.has("entity_wind_bearing") ?
      html`<ha-entity-picker .hass=${this.hass} .configValue=${'entity_wind_bearing'} .value=${this._entity_wind_bearing}
  name="entity_wind_bearing" label="Entity Wind Bearing (optional)" allow-custom-entity
  @value-changed=${this._valueChangedPicker}></ha-entity-picker>` : '';

    const entity_wind_speed = entities.has("entity_wind_speed") ?
      html`<ha-entity-picker .hass=${this.hass} .configValue=${'entity_wind_speed'} .value=${this._entity_wind_speed}
  name="entity_wind_speed" label="Entity Wind Speed (optional)" allow-custom-entity
  @value-changed=${this._valueChangedPicker}></ha-entity-picker>` : '';

    const entity_wind_gust = entities.has("entity_wind_gust") ?
      html`<ha-entity-picker .hass=${this.hass} .configValue=${'entity_wind_gust'} .value=${this._entity_wind_gust}
  name="entity_wind_gust" label="Entity Wind Gust (optional)" allow-custom-entity
  @value-changed=${this._valueChangedPicker}></ha-entity-picker>` : '';

    const entity_wind_speed_kt = entities.has("entity_wind_speed_kt") ?
      html`<ha-entity-picker .hass=${this.hass} .configValue=${'entity_wind_speed_kt'} .value=${this._entity_wind_speed_kt}
  name="entity_wind_speed_kt" label="Entity Wind Speed Kt (optional)" allow-custom-entity
  @value-changed=${this._valueChangedPicker}></ha-entity-picker>` : '';

    const entity_wind_gust_kt = entities.has("entity_wind_gust_kt") ?
      html`<ha-entity-picker .hass=${this.hass} .configValue=${'entity_wind_gust_kt'} .value=${this._entity_wind_gust_kt}
  name="entity_wind_gust_kt" label="Entity Wind Gust Kt (optional)" allow-custom-entity
  @value-changed=${this._valueChangedPicker}></ha-entity-picker>` : '';

    const entity_visibility = entities.has("entity_visibility") ?
      html`<ha-entity-picker .hass=${this.hass} .configValue=${'entity_visibility'} .value=${this._entity_visibility}
  name="entity_visibility" label="Entity Visibility (optional)" allow-custom-entity
  @value-changed=${this._valueChangedPicker}></ha-entity-picker>` : '';

    const entity_sun = entities.has("entity_sun") ?
      html`<ha-entity-picker .hass=${this.hass} .configValue=${'entity_sun'} .value=${this._entity_sun} name="entity_sun"
  label="Entity Sun (optional)" allow-custom-entity @value-changed=${this._valueChangedPicker}></ha-entity-picker>` : '';

    const entity_pop = entities.has("entity_pop") ?
      html`<ha-entity-picker .hass=${this.hass} .configValue=${'entity_pop'} .value=${this._entity_pop} name="entity_pop"
  label="Chance or Rain (optional)" allow-custom-entity @value-changed=${this._valueChangedPicker}></ha-entity-picker>` : '';

    const entity_possible_today = entities.has("entity_possible_today") ?
      html`<ha-entity-picker .hass=${this.hass} .configValue=${'entity_possible_today'} .value=${this._entity_possible_today}
  name="entity_possible_today" label="Possible Rain Today (optional)" allow-custom-entity
  @value-changed=${this._valueChangedPicker}></ha-entity-picker>` : '';

    const entity_possible_tomorrow = entities.has("entity_possible_tomorrow") ?
      html`<ha-entity-picker .hass=${this.hass} .configValue=${'entity_possible_tomorrow'} .value=${this._entity_possible_tomorrow}
  name="entity_possible_tomorrow" label="Possible Rain Tomorrow (optional)" allow-custom-entity
  @value-changed=${this._valueChangedPicker}></ha-entity-picker>` : '';

    const entity_humidity = entities.has("entity_humidity") ?
      html`<ha-entity-picker .hass=${this.hass} .configValue=${'entity_humidity'} .value=${this._entity_humidity}
  name="entity_humidity" label="Humidity (optional)" allow-custom-entity @value-changed=${this._valueChangedPicker}>
</ha-entity-picker>` : '';

    const entity_pressure = entities.has("entity_pressure") ?
      html`<ha-entity-picker .hass=${this.hass} .configValue=${'entity_pressure'} .value=${this._entity_pressure}
  name="entity_pressure" label="Atmospheric Pressure (optional)" allow-custom-entity
  @value-changed=${this._valueChangedPicker}></ha-entity-picker>` : '';

    const entity_uv_summary = entities.has("entity_uv_summary") ?
      html`<ha-entity-picker .hass=${this.hass} .configValue=${'entity_uv_alert_summary'} .value=${this._entity_uv_summary}
  name="entity_uv_summary" label="UV Alert Summary (optional)" allow-custom-entity
  @value-changed=${this._valueChangedPicker}>
</ha-entity-picker>` : '';

    const entity_fire_summary = entities.has("entity_fire_summary") ?
      html`<ha-entity-picker .hass=${this.hass} .configValue=${'entity_fire_danger_summary'} .value=${this._entity_fire_summary}
  name="entity_fire_summary" label="Fire Danger Summary (optional)" allow-custom-entity
  @value-changed=${this._valueChangedPicker}></ha-entity-picker>` : '';

    const entity_rainfall = entities.has("entity_rainfall") ?
      html`<ha-entity-picker .hass=${this.hass} .configValue=${'entity_rainfall'} .value=${this._entity_rainfall}
  name="entity_rainfall" label="Todays Rain (optional)" allow-custom-entity @value-changed=${this._valueChangedPicker}>
</ha-entity-picker>` : '';

    const entity_custom1 = entities.has("custom1") ?
      html`<ha-entity-picker .hass=${this.hass} .configValue=${'custom1_value'} .value=${this._custom1_value} name="custom1_value"
  label="Custom 1 Value (optional)" allow-custom-entity @value-changed=${this._valueChangedPicker}>
</ha-entity-picker>
<div class="side-by-side">
  <ha-icon-picker .hass=${this.hass} .configValue=${'custom1_icon'} .value=${this._custom1_icon} name="custom1_icon"
    label="Custom 1 Icon (optional)" @value-changed=${this._valueChanged}></ha-icon-picker>
  <mwc-textfield label="Custom 1 Units (optional)" .value=${this._custom1_units} .configValue=${'custom1_units'}
    @input=${this._valueChanged}>
  </mwc-textfield>
</div>` : '';

    const entity_custom2 = entities.has("custom2") ?
      html`<ha-entity-picker .hass=${this.hass} .configValue=${'custom2_value'} .value=${this._custom2_value} name="custom2_value"
  label="Custom 2 Value (optional)" allow-custom-entity @value-changed=${this._valueChangedPicker}>
</ha-entity-picker>
<div class="side-by-side">
  <ha-icon-picker .hass=${this.hass} .configValue=${'custom2_icon'} .value=${this._custom2_icon} name="custom2_icon"
    label="Custom 2 Icon (optional)" @value-changed=${this._valueChanged}></ha-icon-picker>
  <mwc-textfield label="Custom 2 Units (optional)" .value=${this._custom2_units} .configValue=${'custom2_units'}
    @input=${this._valueChanged}>
  </mwc-textfield>
</div>` : '';

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
      ${entity_uv_summary}
      ${entity_fire_summary}
      ${entity_rainfall}
      ${entity_custom1}
      ${entity_custom2}`;
  }

  get _show_warning(): boolean {
    return this._config?.show_warning || false;
  }

  get _show_error(): boolean {
    return this._config?.show_error || false;
  }

  protected async firstUpdated(): Promise<void> {
    this.loadEntityPicker();
    this.loadSelect();
    this.loadIconPicker();
  }

  async loadEntityPicker() {
    // Get the local customElement registry
    const registry = (this.shadowRoot as any)?.customElements;
    if (!registry) return;

    // Check if the element we want is already defined in the local scope
    if (registry.get("ha-entity-picker")) return;

    // Load in ha-entity-picker
    // This part will differ for every element you want
    const ch = await (window as any).loadCardHelpers();
    const c = await ch.createCardElement({ type: "button", button: [] });
    await c.constructor.getConfigElement();

    // Since ha-elements are not using scopedRegistry we can get a reference to
    // the newly loaded element from the global customElement registry...
    const haEntityPicker = window.customElements.get("ha-entity-picker");

    // ... and use that reference to register the same element in the local registry
    registry.define("ha-entity-picker", haEntityPicker);
  }

  async loadSelect() {
    // Get the local customElement registry
    const registry = (this.shadowRoot as any)?.customElements;
    if (!registry) return;

    // Check if the element we want is already defined in the local scope
    if (registry.get("ha-select")) return;

    // Load in ha-select
    // This part will differ for every element you want
    const ch = await (window as any).loadCardHelpers();
    const c = await ch.createCardElement({ type: "button", button: [] });
    await c.constructor.getConfigElement();

    // Since ha-elements are not using scopedRegistry we can get a reference to
    // the newly loaded element from the global customElement registry...
    const haSelect = window.customElements.get("ha-select");

    // ... and use that reference to register the same element in the local registry
    registry.define("ha-select", haSelect);
  }

  async loadIconPicker() {
    // Get the local customElement registry
    const registry = (this.shadowRoot as any)?.customElements;
    if (!registry) return;

    // Check if the element we want is already defined in the local scope
    if (registry.get("ha-icon-picker")) return;

    // Load in ha-icon-picker
    // This part will differ for every element you want
    const ch = await (window as any).loadCardHelpers();
    const c = await ch.createCardElement({ type: "button", button: [] });
    await c.constructor.getConfigElement();

    // Since ha-elements are not using scopedRegistry we can get a reference to
    // the newly loaded element from the global customElement registry...
    const haIconPicker = window.customElements.get("ha-icon-picker");

    // ... and use that reference to register the same element in the local registry
    registry.define("ha-icon-picker", haIconPicker);
  }

  protected render(): TemplateResult | void {
    if (!this.hass || !this._helpers) {
      return html``;
    }

    const slotValues = html`<mwc-list-item></mwc-list-item>
<mwc-list-item value="daytime_high">daytime_high</mwc-list-item>
<mwc-list-item value="daytime_low">daytime_low</mwc-list-item>
<mwc-list-item value="temp_next">temp_next</mwc-list-item>
<mwc-list-item value="temp_following">temp_following</mwc-list-item>
<mwc-list-item value="wind">wind</mwc-list-item>
<mwc-list-item value="wind_kt">wind_kt</mwc-list-item>
<mwc-list-item value="visibility">visibility</mwc-list-item>
<mwc-list-item value="sun_next">sun_next</mwc-list-item>
<mwc-list-item value="sun_following">sun_following</mwc-list-item>
<mwc-list-item value="pop">pop</mwc-list-item>
<mwc-list-item value="popforecast">popforecast</mwc-list-item>
<mwc-list-item value="humidity">humidity</mwc-list-item>
<mwc-list-item value="pressure">pressure</mwc-list-item>
<mwc-list-item value="uv_summary">uv_summary</mwc-list-item>
<mwc-list-item value="fire_summary">fire_summary</mwc-list-item>
<mwc-list-item value="possible_today">possible_today</mwc-list-item>
<mwc-list-item value="possible_tomorrow">possible_tomorrow</mwc-list-item>
<mwc-list-item value="rainfall">rainfall</mwc-list-item>
<mwc-list-item value="custom1">custom1</mwc-list-item>
<mwc-list-item value="custom2">custom2</mwc-list-item>
<mwc-list-item value="empty">empty</mwc-list-item>
<mwc-list-item value="remove">remove</mwc-list-item>`;

    return html`
        <mwc-textfield label="Card Title (optional)" .value=${this._card_title} .configValue=${'card_title'}
          @input=${this._valueChanged}>
        </mwc-textfield>
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
          <ha-select label="Slot Left 1 (optional)" .configValue=${'slot_l1'} .value=${this._slot_l1}
            @selected=${this._valueChanged} @closed=${(ev: { stopPropagation: () => any; }) => ev.stopPropagation()}
            fixedMenuPosition
            naturalMenuWidth>
            ${slotValues}
          </ha-select>
          <ha-select label="Slot Right 1 (optional)" .configValue=${'slot_r1'} .value=${this._slot_r1}
            @selected=${this._valueChanged} @closed=${(ev: { stopPropagation: () => any; }) => ev.stopPropagation()}
            fixedMenuPosition
            naturalMenuWidth>
            ${slotValues}
          </ha-select>
        </div>
        <div class="side-by-side">
          <ha-select label="Slot Left 2 (optional)" .configValue=${'slot_l2'} .value=${this._slot_l2}
            @selected=${this._valueChanged} @closed=${(ev: { stopPropagation: () => any; }) => ev.stopPropagation()}
            fixedMenuPosition
            naturalMenuWidth>
            ${slotValues}
          </ha-select>
          <ha-select label="Slot Right 2 (optional)" .configValue=${'slot_r2'} .value=${this._slot_r2}
            @selected=${this._valueChanged} @closed=${(ev: { stopPropagation: () => any; }) => ev.stopPropagation()}
            fixedMenuPosition
            naturalMenuWidth>
            ${slotValues}
          </ha-select>
        </div>
        <div class="side-by-side">
          <ha-select label="Slot Left 3 (optional)" .configValue=${'slot_l3'} .value=${this._slot_l3}
            @selected=${this._valueChanged} @closed=${(ev: { stopPropagation: () => any; }) => ev.stopPropagation()}
            fixedMenuPosition
            naturalMenuWidth>
            ${slotValues}
          </ha-select>
          <ha-select label="Slot Right 3 (optional)" .configValue=${'slot_r3'} .value=${this._slot_r3}
            @selected=${this._valueChanged} @closed=${(ev: { stopPropagation: () => any; }) => ev.stopPropagation()}
            fixedMenuPosition
            naturalMenuWidth>
            ${slotValues}
          </ha-select>
        </div>
        <div class="side-by-side">
          <ha-select label="Slot Left 4 (optional)" .configValue=${'slot_l4'} .value=${this._slot_l4}
            @selected=${this._valueChanged} @closed=${(ev: { stopPropagation: () => any; }) => ev.stopPropagation()}
            fixedMenuPosition
            naturalMenuWidth>
            ${slotValues}
          </ha-select>
          <ha-select label="Slot Right 4 (optional)" .configValue=${'slot_r4'} .value=${this._slot_r4}
            @selected=${this._valueChanged} @closed=${(ev: { stopPropagation: () => any; }) => ev.stopPropagation()}
            fixedMenuPosition
            naturalMenuWidth>
            ${slotValues}
          </ha-select>
        </div>
        <div class="side-by-side">
          <ha-select label="Slot Left 5 (optional)" .configValue=${'slot_l5'} .value=${this._slot_l5}
            @selected=${this._valueChanged} @closed=${(ev: { stopPropagation: () => any; }) => ev.stopPropagation()}
            fixedMenuPosition
            naturalMenuWidth>
            ${slotValues}
          </ha-select>
          <ha-select label="Slot Right 5 (optional)" .configValue=${'slot_r5'} .value=${this._slot_r5}
            @selected=${this._valueChanged} @closed=${(ev: { stopPropagation: () => any; }) => ev.stopPropagation()}
            fixedMenuPosition
            naturalMenuWidth>
            ${slotValues}
          </ha-select>
        </div>
        ${this._optional_entities}
        <br>
        <mwc-formfield .label=${`Toggle warning ${this._show_warning ? 'off' : 'on'}`}>
          <mwc-switch .checked=${this._show_warning !==false} .configValue=${'show_warning'} @change=${this._valueChanged}>
          </mwc-switch>
        </mwc-formfield>
        <mwc-formfield .label=${`Toggle error ${this._show_error ? 'off' : 'on' }`}>
          <mwc-switch .checked=${this._show_error !==false} .configValue=${'show_error'} @change=${this._valueChanged}>
          </mwc-switch>
        </mwc-formfield>
        `;
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

  // private _valueChangedString(ev: CustomEvent): void {
  //   const config = ev.detail.value;

  //   if (config.icon_height && !config.icon_height.endsWith("px")) {
  //     config.icon_height += "px";
  //   }

  //   fireEvent(this, "config-changed", { config });
  // }

  static styles: CSSResultGroup = css`
    mwc-select,
    mwc-textfield {
      display: block;
    }
    mwc-formfield {
      padding-bottom: 8px;
    }
    mwc-switch {
      --mdc-theme-secondary: var(--switch-checked-color);
    }
    .option {
      padding: 4px 0px;
      cursor: pointer;
    }
    .row {
      display: flex;
      margin-bottom: -14px;
      pointer-events: none;
    }
    .title {
      padding-left: 16px;
      margin-top: -6px;
      pointer-events: none;
    }
    .secondary {
      padding-left: 40px;
      color: var(--secondary-text-color);
      pointer-events: none;
    }
    .values {
      padding-left: 16px;
      background: var(--secondary-background-color);
    }
    ha-switch {
      padding: 16px 6px;
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
  `;
}
