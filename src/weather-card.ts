/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { LitElement, html, TemplateResult, css, PropertyValues, CSSResult, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators';
import { HomeAssistant, hasConfigOrEntityChanged, LovelaceCardEditor, getLovelace } from 'custom-card-helpers';

import type { WeatherCardConfig } from './types';
import { CARD_VERSION } from './const';
import { localize } from './localize/localize';

/* eslint no-console: 0 */
console.info(
  `%c  MAKIN-THINGS-WEATHER-CARD \n%c  ${localize('common.version')} ${CARD_VERSION}    `,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray',
);

// This puts your card into the UI card picker dialog
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'weather-card',
  name: 'Weather Card',
  description: 'A Weather Card that has a GUI configuration',
});

// TODO Name your custom element
@customElement('weather-card')
export class WeatherCard extends LitElement {
  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import('./editor');
    return document.createElement('weather-card-editor');
  }

  public static getStubConfig(): Record<string, unknown> {
    return {};
  }

  // TODO Add any properities that should cause your element to re-render here
  // https://lit.dev/docs/components/properties/
  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private config!: WeatherCardConfig;

  private _error: string[] = [];

  // https://lit.dev/docs/components/properties/#accessors-custom
  public setConfig(config: WeatherCardConfig): void {
    // TODO Check for required fields and that they are of the proper format
    if (!config) {
      throw new Error(localize('common.invalid_configuration'));
    }

    if (config.test_gui) {
      getLovelace().setEditMode(true);
    }

    this.config = {
      name: 'Weather',
      ...config,
    };
  }

  // https://lit.dev/docs/components/lifecycle/#reactive-update-cycle-performing
  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (!this.config) {
      return false;
    }

    if (changedProps.has('hass')) {
      console.info('hass change');
    }

    if (changedProps.has('config')) {
      console.info('config change');
    }

    const oldHass = changedProps.get("hass") as HomeAssistant || undefined;

    if (
      !oldHass ||
      oldHass.themes !== this.hass.themes ||
      oldHass.locale !== this.hass.locale
    ) {
      return true;
    }

    for (const entity of [this.config.entity_temperature as string, this.config.entity_apparent_temp as string, this.config.entity_current_conditions as string, this.config.entity_current_text as string]) {
      // console.info(`entity: %s`, entity);
      // console.info(`oh state: %s`, JSON.stringify(oldHass.states[entity], null, 2));
      if (oldHass.states[entity] !== this.hass.states[entity]) {
        return true;
      }
    }

    if (hasConfigOrEntityChanged(this, changedProps, false)) {
      console.info('Something changed');
    }

    return hasConfigOrEntityChanged(this, changedProps, false);
  }

  public async performUpdate(): Promise<void> {
    this._error = [];
    Object.keys(this.config).forEach(key => {
      if (key.match(/^entity_/) !== null) {
        if (this.hass.states[this.config[key]] === undefined) {
          this._error.push(`'${key}=${this.config[key]}' not found`);
        }
      }
    });
    const days = this.config['daily_forecast_days'] || 5;
    console.info(`days=${days}`);
    for (const entity of ['entity_forecast_icon_1', 'entity_summary_1', 'entity_forecast_low_temp_1', 'entity_forecast_high_temp_1', 'entity_pop_1', 'entity_pos_1']) {
      if (this.config[entity] !== undefined) {
        // check there is a number in the name
        if (this.config[entity].match(/(\d+)(?!.*\d)/g)) {

        } else {
          this._error.push(`'${entity}=${this.config[entity]}' value needs to have a number)`);
        }
      }
    }
    super.performUpdate();
  }

  private _renderTitleSection(): TemplateResult {
    if ((this.config?.show_section_title !== true) || ((this.config.text_card_title === undefined) && (this.config.entity_update_time == undefined))) return html``;

    var updateTime: string;
    if ((this.config.entity_update_time !== undefined) && (this.hass.states[this.config.entity_update_time].state !== undefined)){
      const d = new Date(this.hass.states[this.config.entity_update_time].state);
      if (this.is12Hour) {
        updateTime = d.toLocaleString(this.config.locale, { hour: 'numeric', minute: '2-digit', hour12: true }).replace(" am", "am, ").replace(" pm", "pm, ") + d.toLocaleDateString(this.config.locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).replace(",", "");
      } else {
        updateTime = d.toLocaleString(this.config.locale, { hour: '2-digit', minute: '2-digit', hour12: false }).replace(" am", "am, ").replace(" pm", "pm, ") + d.toLocaleDateString(this.config.locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).replace(",", "");
      }
    } else {
      updateTime = '---';
    }

    return html`
      <div class="title-section">
        ${this.config.text_card_title ? html`<div class="title">${this.config.text_card_title}</div>` : html``}
        ${this.config.entity_update_time ? html`<div class="updated">${this.config.text_update_time_prefix ? this.config.text_update_time_prefix+' ' : ''}${updateTime}</div>` : html``}
      </div>
    `;
  }

  private _renderMainSection(): TemplateResult {
    if (this.config?.show_section_main === false) return html``;

    const url = new URL('icons/' + (this.config.static_icons ? 'static' : 'animated') + '/' + this.weatherIcon + '.svg', import.meta.url);
    const hoverText = this.weatherIcon !== 'unknown' ? '' : `Unknown condition\n${this.currentConditions}`;
    const biggerIcon = html`<div class="big-icon"><img src="${url.href}" width="100%" height="100%" title="${hoverText}"></div>`;

    const currentTemp = html`
      <div class="current-temp">
        <div class="temp" id="current-temp-text">${this.currentTemperature}</div>
        <div class="tempc">${this.getUOM('temperature')}</div>
      </div>
    `;

    const apparentTemp = html`
      <div class="apparent-temp">
        <div class="apparent">${this.localeTextfeelsLike} <span
            id="apparent-temp-text">${this.currentApparentTemperature}</span>
        </div>
        <div class="apparentc"> ${this.getUOM('temperature')}</div>
      </div>
    `;

    var separator = this.config.show_separator === true ? html`<hr class=line>` : ``;

    const currentText = this.config.entity_current_text !== undefined ? this.hass.states[this.config.entity_current_text].state ?? '---' : '---';

    return html`
      <div class="top-row">
        <div class="top-left">${biggerIcon}</div>
        <div class="currentTemps">${currentTemp}${apparentTemp}</div>
      </div>
      ${separator}
      <div class="current-text">${currentText}</div>
    `;
  }

  private _renderSlotsSection(): TemplateResult {
    if (this.config?.show_section_slots === false) return html``;

    var slot_section = (this.config.use_old_column_format === true) ? html`
      <div>
        <ul class="variations-ugly">
          <li>
            <ul class="slot-list">${this.slotL1}${this.slotL2}${this.slotL3}${this.slotL4}${this.slotL5}${this.slotL6}</ul>
          </li>
          <li>
            <ul class="slot-list">${this.slotR1}${this.slotR2}${this.slotR3}${this.slotR4}${this.slotR5}${this.slotR6}</ul>
          </li>
        </ul>
      </div>
    ` : html`
      <div>
        <ul class="variations">
          <li class="slot-list-item-1">
            <ul class="slot-list">
              ${this.slotL1}${this.slotL2}${this.slotL3}${this.slotL4}${this.slotL5}${this.slotL6}
            </ul>
          </li>
          <li>
            <ul class="slot-list">
              ${this.slotR1}${this.slotR2}${this.slotR3}${this.slotR4}${this.slotR5}${this.slotR6}
            </ul>
          </li>
        </ul>
      </div>
    `;

    return html`
      <div>${slot_section}</div>
    `;
  }

  // https://lit.dev/docs/components/rendering/
  protected render(): TemplateResult | void {
    const htmlCode: TemplateResult[] = [];
    if (this._error.length !== 0) htmlCode.push(this._showConfigWarning(this._error));

    htmlCode.push(html`
      <style>
        ${this.styles}
      </style>
      <ha-card class="card">
        <div class="content">
          ${this._renderTitleSection()}
          ${this._renderMainSection()}
          ${this._renderSlotsSection()}
        </div>
      </ha-card>
    `);
    return html`${htmlCode}`;
  }

  // slots - returns the value to be displyed in a specific current condition slot
  get slotL1(): TemplateResult {
    return this.slotValue('l1', this.config.slot_l1);
  }

  get slotL2(): TemplateResult {
    return this.slotValue('l2', this.config.slot_l2);
  }

  get slotL3(): TemplateResult {
    return this.slotValue('l3', this.config.slot_l3);
  }

  get slotL4(): TemplateResult {
    return this.slotValue('l4', this.config.slot_l4);
  }

  get slotL5(): TemplateResult {
    return this.slotValue('l5', this.config.slot_l5);
  }

  get slotL6(): TemplateResult {
    return this.slotValue('l6', this.config.slot_l6);
  }

  get slotR1(): TemplateResult {
    return this.slotValue('r1', this.config.slot_r1);
  }

  get slotR2(): TemplateResult {
    return this.slotValue('r2', this.config.slot_r2);
  }

  get slotR3(): TemplateResult {
    return this.slotValue('r3', this.config.slot_r3);
  }

  get slotR4(): TemplateResult {
    return this.slotValue('r4', this.config.slot_r4);
  }

  get slotR5(): TemplateResult {
    return this.slotValue('r5', this.config.slot_r5);
  }

  get slotR6(): TemplateResult {
    return this.slotValue('r6', this.config.slot_r6);
  }

  // slots - calculates the specific slot value
  slotValue(slot: string, value: string | undefined): TemplateResult {
    switch (value) {
      case 'pop': return this.slotPopForecast;
      case 'popforecast': return this.slotPopForecast;
      case 'possible_today': return this.slotPossibleToday;
      case 'possible_tomorrow': return this.slotPossibleTomorrow;
      case 'rainfall': return this.slotRainfall;
      case 'humidity': return this.slotHumidity;
      case 'pressure': return this.slotPressure;
      case 'daytime_high': return this.slotDaytimeHigh;
      case 'daytime_low': return this.slotDaytimeLow;
      case 'temp_next': return this.slotTempNext;
      case 'temp_following': return this.slotTempFollowing;
      case 'uv_summary': return this.slotUvSummary;
      case 'fire_summary': return this.slotFireSummary;
      case 'wind': return this.slotWind;
      case 'wind_kt': return this.slotWindKt;
      case 'visibility': return this.slotVisibility;
      case 'sun_next': return this.slotSunNext;
      case 'sun_following': return this.slotSunFollowing;
      case 'custom1': return this.slotCustom1;
      case 'custom2': return this.slotCustom2;
      case 'empty': return this.slotEmpty;
      case 'remove': return this.slotRemove;
    }

    // If no value can be matched pass back a default for the slot
    switch (slot) {
      case 'l1': return this.slotDaytimeHigh;
      case 'l2': return this.slotDaytimeLow;
      case 'l3': return this.slotWind;
      case 'l4': return this.slotPressure;
      case 'l5': return this.slotSunNext;
      case 'l6': return this.slotRemove;
      case 'r1': return this.slotPop;
      case 'r2': return this.slotHumidity;
      case 'r3': return this.slotUvSummary;
      case 'r4': return this.slotFireSummary;
      case 'r5': return this.slotSunFollowing;
      case 'r6': return this.slotRemove;
    }
    return this.slotEmpty;
  }

  // getters that return the html for an individual slot
  get slotEmpty(): TemplateResult {
    return html`<li>&nbsp;</li>`;
  }

  get slotRemove(): TemplateResult {
    return html``;
  }

  get slotPop(): TemplateResult {
    try {
      var intensity = this.config.entity_pop_intensity && !this.config.entity_pop_intensity_rate ? html`<span id="intensity-text"> -
  ${(Number(this.hass.states[this.config.entity_pop_intensity].state)).toLocaleString()}</span><span
  class="unit">${this.getUOM('precipitation')}</span>` : this.config.entity_pop_intensity_rate && !this.config.entity_pop_intensity ? html`<span id="intensity-text"> -
  ${(Number(this.hass.states[this.config.entity_pop_intensity_rate].state)).toLocaleString()}</span><span
  class="unit">${this.getUOM('intensity')}</span>` : ` Config Error`;
      if (this.config.alt_pop) {
        return html`<li><span class="ha-icon">
    <ha-icon icon="mdi:weather-rainy"></ha-icon>
  </span><span id="alt-pop">${this.hass.states[this.config.alt_pop].state}</span></li>`;
      } else {
        return this.config.entity_pop ? html`<li><span class="ha-icon">
    <ha-icon icon="mdi:weather-rainy"></ha-icon>
  </span><span id="pop-text">${this.hass.states[this.config.entity_pop] !== undefined ?
            Math.round(Number(this.hass.states[this.config.entity_pop].state)) : "Config Error"}</span><span
    class="unit">%</span><span>${intensity}</span></li>` : html``;
      }
    } catch (e) {
      return html`<li><span class="ha-icon">
    <ha-icon icon="mdi:weather-rainy"></ha-icon>
  </span><span id="pop-text">Config Error</span></li>`;
    }
  }

  get slotPopForecast(): TemplateResult {
    try {
      if (this.config.alt_pop) {
        return html`<li><span class="ha-icon">
    <ha-icon icon="mdi:weather-rainy"></ha-icon>
  </span><span id="alt-pop">${this.hass.states[this.config.alt_pop].state}</span></li>`;
      } else {
        return this.config.entity_pop && this.config.entity_possible_today ? html`<li><span class="ha-icon">
    <ha-icon icon="mdi:weather-rainy"></ha-icon>
  </span><span id="pop-text">${Math.round(Number(this.hass.states[this.config.entity_pop].state))}</span><span
    class="unit">%</span><span> - <span
      id="pop-text-today">${this.hass.states[this.config.entity_possible_today].state}</span></span><span
    class="unit">${this.getUOM('precipitation')}</span></li>` : html``;
      }
    } catch (e) {
      return html`<li><span class="ha-icon">
    <ha-icon icon="mdi:weather-rainy"></ha-icon>
  </span><span id="pop-text">Config Error</span></li>`;
    }
  }

  get slotPossibleToday(): TemplateResult {
    try {
      return this.config.entity_possible_today ? html`<li><span class="ha-icon">
    <ha-icon icon="mdi:weather-rainy"></ha-icon>
  </span>${this.localeTextposToday} <span
    id="possible_today-text">${this.hass.states[this.config.entity_possible_today].state}</span><span
    class="unit">${this.getUOM('precipitation')}</span></li>` : html``;
    } catch (e) {
      return html`<li><span class="ha-icon">
    <ha-icon icon="mdi:weather-rainy"></ha-icon>
  </span><span id="possible_today-text">Config Error</span></li>`;
    }
  }

  get slotPossibleTomorrow(): TemplateResult {
    try {
      return this.config.entity_pos_1 ? html`<li><span class="ha-icon">
    <ha-icon icon="mdi:weather-rainy"></ha-icon>
  </span>${this.localeTextposTomorrow} <span
    id="possible_tomorrow-text">${this.hass.states[this.config.entity_pos_1].state}</span><span
    class="unit">${this.getUOM('precipitation')}</span></li>` : html``;
    } catch (e) {
      return html`<li><span class="ha-icon">
    <ha-icon icon="mdi:weather-rainy"></ha-icon>
  </span><span id="possible_tomorrow-text">Config Error</span></li>`;
    }
  }

  get slotRainfall(): TemplateResult {
    try {
      return this.config.entity_rainfall ? html`<li><span class="ha-icon">
    <ha-icon icon="mdi:weather-rainy"></ha-icon>
  </span><span id="rainfall-text">${this.hass.states[this.config.entity_rainfall].state}</span><span
    class="unit">${this.getUOM('precipitation')}</span></li>` : html``;
    } catch (e) {
      return html`<li><span class="ha-icon">
    <ha-icon icon="mdi:weather-rainy"></ha-icon>
  </span><span id="rainfall-text">Config Error</span></li>`;
    }
  }

  get slotHumidity(): TemplateResult {
    try {
      if (this.config.alt_humidity) {
        return html`<li><span class="ha-icon">
    <ha-icon icon="mdi:water-percent"></ha-icon>
  </span><span id="alt-humidity">${this.hass.states[this.config.alt_humidity].state}</span></li>`;
      } else {
        return this.config.entity_humidity ? html`<li><span class="ha-icon">
    <ha-icon icon="mdi:water-percent"></ha-icon>
  </span><span id="humidity-text">${this.currentHumidity}</span><span class="unit">%</span></li>` : html``;
      }
    } catch (e) {
      return html`<li><span class="ha-icon">
    <ha-icon icon="mdi:water-percent"></ha-icon>
  </span><span id="humidity-text">Config Error</span></li>`;
    }
  }

  get slotPressure(): TemplateResult {
    try {
      if (this.config.alt_pressure) {
        return html`<li><span class="ha-icon">
    <ha-icon icon="mdi:gauge"></ha-icon>
  </span><span id="alt-pressure">${this.hass.states[this.config.alt_pressure].state}</span></li>`;
      } else {
        return this.config.entity_pressure ? html`<li><span class="ha-icon">
    <ha-icon icon="mdi:gauge"></ha-icon>
  </span><span id="pressure-text">${this.currentPressure}</span><span class="unit">${this.config.pressure_units ?
            this.config.pressure_units : this.getUOM('air_pressure')}</span></li>` : html``;
      }
    } catch (e) {
      return html`<li><span class="ha-icon">
    <ha-icon icon="mdi:gauge"></ha-icon>
  </span><span id="pressure-text">Config Error</span></li>`;
    }
  }

  get slotDaytimeHigh(): TemplateResult {
    try {
      if (this.config.alt_daytime_high) {
        return html`<li><span class="ha-icon">
    <ha-icon icon="mdi:thermometer-high"></ha-icon>
  </span><span id="alt-daytime-high">${this.hass.states[this.config.alt_daytime_high].state}</span></li>`;
      } else {
        return this.config.entity_daytime_high && this.config.show_decimals_today ? html`<li>
  <div class="slot">
    <div class="slot-icon">
      <ha-icon icon="mdi:thermometer-high"></ha-icon>
    </div>
    <div class="slot-text">${this.localeTextmaxToday}&nbsp;</div>
    <div class="slot-text" id="daytime-high-text">
      ${(Number(this.hass.states[this.config.entity_daytime_high].state)).toLocaleString(undefined,
            { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</div>
    <div class="unitc">${this.getUOM('temperature')}</div>
  </div>
</li>` : this.config.entity_daytime_high && !this.config.show_decimals_today ? html`<li>
  <div class="slot">
    <div class="slot-icon">
      <ha-icon icon="mdi:thermometer-high"></ha-icon>
    </div>
    <div class="slot-text">${this.localeTextmaxToday}&nbsp;</div>
    <div class="slot-text" id="daytime-high-text">
      ${(Number(this.hass.states[this.config.entity_daytime_high].state).toFixed(0)).toLocaleString()}</div>
    <div class="unitc">${this.getUOM('temperature')}</div>
  </div>
</li>` : html``;
      }
    } catch (e) {
      return html`<li><span class="ha-icon">
    <ha-icon icon="mdi:thermometer-high"></ha-icon>
  </span><span id="daytime-high-text">Config Error</span></li>`;
    }
  }

  get slotDaytimeLow(): TemplateResult {
    try {
      if (this.config.alt_daytime_low) {
        return html`<li><span class="ha-icon">
    <ha-icon icon="mdi:thermometer-low"></ha-icon>
  </span><span id="alt-daytime-low">${this.hass.states[this.config.alt_daytime_low].state}</span></li>`;
      } else {
        return this.config.entity_daytime_low && this.config.show_decimals_today ? html`<li>
  <div class="slot">
    <div class="slot-icon">
      <ha-icon icon="mdi:thermometer-low"></ha-icon>
    </div>
    <div class="slot-text">${this.localeTextminToday}&nbsp;</div>
    <div class="slot-text" id="daytime-low-text">
      ${(Number(this.hass.states[this.config.entity_daytime_low].state)).toLocaleString(undefined,
        { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</div>
    <div class="unitc">${this.getUOM('temperature')}</div>
  </div>
</li>` : this.config.entity_daytime_low && !this.config.show_decimals_today ? html`<li>
  <div class="slot">
    <div class="slot-icon">
      <ha-icon icon="mdi:thermometer-low"></ha-icon>
    </div>
    <div class="slot-text">${this.localeTextminToday}&nbsp;</div>
    <div class="slot-text" id="daytime-low-text">
      ${(Number(this.hass.states[this.config.entity_daytime_low].state).toFixed(0)).toLocaleString()}</div>
    <div class="unitc">${this.getUOM('temperature')}</div>
  </div>
</li>` : html``;
      }
    } catch (e) {
      return html`<li><span class="ha-icon">
    <ha-icon icon="mdi:thermometer-low"></ha-icon>
  </span><span id="daytime-low-text">Config Error</span></li>`;
    }
  }

  get slotTempNext(): TemplateResult {
    try {
      return this.config.entity_temp_next && this.config.entity_temp_next_label ? html`<li><div class="slot"><div class="slot-icon">
    <ha-icon id="temp-next-icon" icon="${this.tempNextIcon}"></ha-icon>
  </div><div class="slot-text" id="temp-next-text">${this.tempNextText}</div><div class="unitc">${this.getUOM('temperature')}</div>
  </div></li>` : html``;
    } catch (e) {
      return html`<li><span class="ha-icon">
    <ha-icon icon="mdi:thermometer"></ha-icon>
  </span><span id="temp-next-text">Config Error</span></li>`;
    }
  }

  get tempNextIcon(): string {
    return this.hass.states[this.config.entity_temp_next_label].state.includes("Min") ? "mdi:thermometer-low" : "mdi:thermometer-high";
  }

  get tempNextText(): TemplateResult {
    return this.config.entity_temp_next && this.config.entity_temp_next_label ? html`${this.hass.states[this.config.entity_temp_next_label].state} ${this.hass.states[this.config.entity_temp_next].state}` : html``;
  }

  get slotTempFollowing(): TemplateResult {
    try {
      return this.config.entity_temp_following && this.config.entity_temp_following_label ? html`<li><div class="slot"><div class="slot-icon">
    <ha-icon id="temp-following-icon" icon="${this.tempFollowingIcon}"></ha-icon>
  </div><div class="slot-text" id="temp-following-text">${this.tempFollowingText}</div><div
    class="unitc">${this.getUOM('temperature')}</div></div></li>` : html``;
    } catch (e) {
      return html`<li><span class="ha-icon">
    <ha-icon icon="mdi:thermometer"></ha-icon>
  </span><span id="temp-following-text">Config Error</span></li>`;
    }
  }

  get tempFollowingIcon(): string {
    return this.hass.states[this.config.entity_temp_following_label].state.includes("Min") ? "mdi:thermometer-low" : "mdi:thermometer-high";
  }

  get tempFollowingText(): TemplateResult {
    return this.config.entity_temp_following && this.config.entity_temp_following_label ? html`${this.hass.states[this.config.entity_temp_following_label].state}
${this.hass.states[this.config.entity_temp_following].state}` : html``;
  }

  get slotUvSummary(): TemplateResult {
    try {
      return this.config.entity_uv_alert_summary ? html`<li><span class="ha-icon">
    <ha-icon icon="mdi:weather-sunny"></ha-icon>
  </span>${this.localeTextuvRating} <span
    id="daytime-uv-text">${this.hass.states[this.config.entity_uv_alert_summary].state}</span></li>` : html``;
    } catch (e) {
      return html`<li><span class="ha-icon">
    <ha-icon icon="mdi:weather-sunny"></ha-icon>
  </span><span id="daytime-uv-text">Config Error</span></li>`;
    }
  }

  get slotFireSummary(): TemplateResult {
    try {
      return this.config.entity_fire_danger_summary ? html`<li><span class="ha-icon">
    <ha-icon icon="mdi:fire"></ha-icon>
  </span>${this.localeTextfireDanger} <span
    id="daytime-firedanger-text">${this.hass.states[this.config.entity_fire_danger_summary].state !== 'unknown' ?
          this.hass.states[this.config.entity_fire_danger_summary].state : 'N/A'}</span></li>` : html``;
    } catch (e) {
      return html`<li><span class="ha-icon">
    <ha-icon icon="mdi:fire"></ha-icon>
  </span><span id="daytime-firedanger-text">Config Error</span></li>`;
    }
  }

  get slotWind(): TemplateResult {
    try {
      var windBearing = this.config.entity_wind_bearing ? html`<span id="wind-bearing-text">${this.currentWindBearing}</span>` : ``;
      var beaufortRating = this.config.entity_wind_speed ? html`<span id="beaufort-text">${this.currentBeaufort}</span>` : ``;
      return this.config.alt_wind ? html`<li><span class="ha-icon">
    <ha-icon icon="mdi:weather-windy"></ha-icon>
  </span><span id="alt-wind">${this.hass.states[this.config.alt_wind].state}</span></li>` : this.config.entity_wind_bearing && this.config.entity_wind_speed && this.config.entity_wind_gust ? html`<li><span class="ha-icon">
    <ha-icon icon="mdi:weather-windy"></ha-icon>
  </span><span>${beaufortRating}</span><span>${windBearing}</span><span id="wind-speed-text">
    ${this.currentWindSpeed}</span><span class="unit">${this.getUOM('length')}/h</span><span id="wind-gust-text"> (Gust
    ${this.currentWindGust}</span><span class="unit">${this.getUOM('length')}/h)</span></li>` : this.config.entity_wind_bearing && this.config.entity_wind_speed ? html`<li><span class="ha-icon">
    <ha-icon icon="mdi:weather-windy"></ha-icon>
  </span><span>${beaufortRating}</span><span>${windBearing}</span><span id="wind-speed-text">
    ${this.currentWindSpeed}</span><span class="unit"> ${this.getUOM('length')}/h</span></li>` : html``;
    } catch (e) {
      return html`<li><span class="ha-icon">
    <ha-icon icon="mdi:weather-windy"></ha-icon>
  </span><span id="wind-error-text">Config Error</span></li>`;
    }
  }

  get slotWindKt(): TemplateResult {
    try {
      var windBearing = this.config.entity_wind_bearing ? html`<span id="wind-bearing-kt-text">${this.currentWindBearing}</span>` : ``;
      var beaufortRatingKt = this.config.entity_wind_speed_kt ? html`<span id="beaufort-kt-text">${this.currentBeaufortkt}</span>` : ``;
      return this.config.entity_wind_bearing && this.config.entity_wind_speed_kt && this.config.entity_wind_gust_kt ? html`<li><span class="ha-icon">
    <ha-icon icon="mdi:weather-windy"></ha-icon>
  </span><span>${beaufortRatingKt}</span><span>${windBearing}</span><span id="wind-speed-kt-text">
    ${this.currentWindSpeedKt}</span><span class="unit">kt</span><span id="wind-gust-kt-text"> (Gust
    ${this.currentWindGustKt}</span><span class="unit">kt)</span></li>` : this.config.entity_wind_bearing && this.config.entity_wind_speed_kt ? html`<li><span class="ha-icon">
    <ha-icon icon="mdi:weather-windy"></ha-icon>
  </span><span>${beaufortRatingKt}</span><span>${windBearing}</span><span
    id="wind-speed-kt-text">${this.currentWindSpeedKt}</span><span class="unit">kt</span></li>` : html``;
    } catch (e) {
      return html`<li><span class="ha-icon">
    <ha-icon icon="mdi:weather-windy"></ha-icon>
  </span><span id="wind-error-text">Config Error</span></li>`;
    }
  }

  get slotVisibility(): TemplateResult {
    try {
      return this.config.alt_visibility ? html`<li><span class="ha-icon">
    <ha-icon icon="mdi:weather-fog"></ha-icon>
  </span><span id="alt-visibility">${this.hass.states[this.config.alt_visibility].state}</span></li>` : this.config.entity_visibility ? html`<li><span class="ha-icon">
    <ha-icon icon="mdi:weather-fog"></ha-icon>
  </span><span id="visibility-text">${this.currentVisibility}</span><span class="unit"> ${this.getUOM('length')}</span>
</li>` : html``;
    } catch (e) {
      return html`<li><span class="ha-icon">
    <ha-icon icon="mdi:weather-fog"></ha-icon>
  </span><span id="visibility-text">Config Error</span></li>`;
    }
  }

  get slotSunNext(): TemplateResult {
    try {
      if (this.config.alt_sun_next) {
        return html`<li><span id="alt-sun-next">${this.hass.states[this.config.alt_sun_next].state}</span></li>`;
      } else {
        return this.config.entity_sun ? this.sunSet.next : html``;
      }
    } catch (e) {
      return html`<li><span class="ha-icon">
    <ha-icon icon="mdi:weather-sunset"></ha-icon>
  </span><span id="sun-next-text">Config Error</span></li>`;
    }
  }

  get slotSunFollowing(): TemplateResult {
    try {
      if (this.config.alt_sun_following) {
        return html`<li><span id="alt-sun-following">${this.hass.states[this.config.alt_sun_following].state}</span></li>`;
      } else {
        return this.config.entity_sun ? this.sunSet.following : html``;
      }
    } catch (e) {
      return html`<li><span class="ha-icon">
    <ha-icon icon="mdi:weather-sunset"></ha-icon>
  </span><span id="sun-following-text">Config Error</span></li>`;
    }
  }

  get slotCustom1(): TemplateResult {
    try {
      var icon = this.config.custom1_icon ? this.config.custom1_icon : 'mdi:help-box';
      var value = this.config.custom1_value ? this.hass.states[this.config.custom1_value].state : 'unknown';
      var unit = this.config.custom1_units ? this.config.custom1_units : '';
      return html`<li><span class="ha-icon">
    <ha-icon icon=${icon}></ha-icon>
  </span><span id="custom-1-text">${value}</span><span class="unit">${unit}</span></li>`;
    } catch (e) {
      return html`<li><span class="ha-icon">
    <ha-icon icon="mdi:help-box"></ha-icon>
  </span><span id="custom-1-text">Config Error</span></li>`;
    }
  }

  get slotCustom2(): TemplateResult {
    try {
      var icon = this.config.custom2_icon ? this.config.custom2_icon : 'mdi:help-box';
      var value = this.config.custom2_value ? this.hass.states[this.config.custom2_value].state : 'unknown';
      var unit = this.config.custom2_units ? this.config.custom2_units : '';
      return html`<li><span class="ha-icon">
    <ha-icon icon=${icon}></ha-icon>
  </span><span id="custom-2-text">${value}</span><span class="unit">${unit}</span></li>`;
    } catch (e) {
      return html`<li><span class="ha-icon">
    <ha-icon icon="mdi:help-box"></ha-icon>
  </span><span id="custom-2-text">Config Error</span></li>`;
    }
  }

  // getters that return the value to be shown
  get currentConditions(): string {
    const entity = this.config.entity_current_conditions;
    return entity && this.hass.states[entity]
      ? this.hass.states[entity].state
      : '---';
  }

  get currentTemperature(): string {
    const entity = this.config.entity_temperature;
    return entity && this.hass.states[entity]
      ? this.config.show_decimals !== true
        ? String(Math.round(Number(this.hass.states[entity].state)))
        : this.hass.states[entity].state
      : '---';
  }

  get currentApparentTemperature(): string {
    const entity = this.config.entity_apparent_temp;
    return entity && this.hass.states[entity]
      ? this.config.show_decimals !== true
        ? String(Math.round(Number(this.hass.states[entity].state)))
        : this.hass.states[entity].state
      : '---';
  }

  get currentHumidity(): string {
    const entity = this.config.entity_humidity;
    return entity && this.hass.states[entity]
      ? (Number(this.hass.states[entity].state)).toLocaleString() : '---';
  }

  get currentPressure(): string {
    const entity = this.config.entity_pressure;
    var places = this.config.show_decimals_pressure ? Math.max(Math.min(this.config.show_decimals_pressure, 3), 0) : 0;
    return entity && this.hass.states[entity]
      ? (Number(this.hass.states[entity].state)).toLocaleString(undefined, { minimumFractionDigits: places, maximumFractionDigits: places }) : '---';
  }

  get currentVisibility(): string {
    const entity = this.config.entity_visibility;
    return entity && this.hass.states[entity]
      ? (Number(this.hass.states[entity].state)).toLocaleString() : '---';
  }

  get currentWindBearing(): string {
    const entity = this.config.entity_wind_bearing;
    return entity && this.hass.states[entity]
      ? isNaN(Number(this.hass.states[entity].state)) ? this.hass.states[entity].state : this.windDirections[(Math.round((Number(this.hass.states[entity].state) / 360) * 16))] : '---';
  }

  get currentWindSpeed(): string {
    const entity = this.config.entity_wind_speed;
    return entity && this.hass.states[entity]
      ? Math.round(Number(this.hass.states[entity].state)).toLocaleString() : '---';
  }

  get currentWindGust(): string {
    const entity = this.config.entity_wind_gust;
    return entity && this.hass.states[entity]
      ? Math.round(Number(this.hass.states[entity].state)).toLocaleString() : '---';
  }

  get currentWindSpeedKt(): string {
    const entity = this.config.entity_wind_speed_kt;
    return entity && this.hass.states[entity]
      ? Math.round(Number(this.hass.states[entity].state)).toLocaleString() : '---';
  }

  get currentWindGustKt(): string {
    const entity = this.config.entity_wind_gust_kt;
    return entity && this.hass.states[entity]
      ? Math.round(Number(this.hass.states[entity].state)).toLocaleString() : '---';
  }

  get currentBeaufort() {
    return this.config.show_beaufort == true ? html`Bft: ${this.beaufortWind} - ` : ``;
  }

  get currentBeaufortkt() {
    return this.config.show_beaufort === true ? html`Bft: ${this.beaufortWindKt} - ` : ``;
  }

  // windDirections - returns set of possible wind directions by specified language
  get windDirections(): string[] {
    const windDirections_en = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW', 'N'];
    const windDirections_fr = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSO', 'SO', 'OSO', 'O', 'ONO', 'NO', 'NNO', 'N'];
    const windDirections_de = ['N', 'NNO', 'NO', 'ONO', 'O', 'OSO', 'SO', 'SSO', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW', 'N'];
    const windDirections_nl = ['N', 'NNO', 'NO', 'ONO', 'O', 'OZO', 'ZO', 'ZZO', 'Z', 'ZZW', 'ZW', 'WZW', 'W', 'WNW', 'NW', 'NNW', 'N'];
    const windDirections_he = ['צפון', 'צ-צ-מז', 'צפון מזרח', 'מז-צ-מז', 'מזרח', 'מז-ד-מז', 'דרום מזרח', 'ד-ד-מז', 'דרום', 'ד-ד-מע', 'דרום מערב', 'מע-ד-מע', 'מערב', 'מע-צ-מע', 'צפון מערב', 'צ-צ-מע', 'צפון'];
    const windDirections_da = ['N', 'NNØ', 'NØ', 'ØNØ', 'Ø', 'ØSØ', 'SØ', 'SSØ', 'S', 'SSV', 'SV', 'VSV', 'V', 'VNV', 'NV', 'NNV', 'N'];
    const windDirections_ru = ['С', 'ССВ', 'СВ', 'ВСВ', 'В', 'ВЮВ', 'ЮВ', 'ЮЮВ', 'Ю', 'ЮЮЗ', 'ЮЗ', 'ЗЮЗ', 'З', 'ЗСЗ', 'СЗ', 'ССЗ', 'С'];

    switch (this.config.locale) {
      case "it":
      case "fr":
        return windDirections_fr;
      case "de":
        return windDirections_de;
      case "nl":
        return windDirections_nl;
      case "he":
        return windDirections_he;
      case "ru":
        return windDirections_ru;
      case "da":
        return windDirections_da;
      default:
        return windDirections_en;
    }
  }

  // beaufortWind - returns the wind speed on the beaufort scale
  // reference https://en.wikipedia.org/wiki/Beaufort_scale
  get beaufortWind(): string {
    const entity = this.config.entity_wind_speed;
    if (entity && this.hass.states[entity] && !isNaN(Number(this.hass.states[entity].state))) {
      const value = Number(this.hass.states[entity].state);
      switch (this.hass.states[entity].attributes.unit_of_measurement) {
        case 'mph':
          if (value >= 73) return '12';
          if (value >= 64) return '11';
          if (value >= 55) return '10';
          if (value >= 47) return '9';
          if (value >= 39) return '8';
          if (value >= 32) return '7';
          if (value >= 25) return '6';
          if (value >= 19) return '5';
          if (value >= 13) return '4';
          if (value >= 8) return '3';
          if (value >= 4) return '2';
          if (value >= 1) return '1';
          return '0';
        case 'm/s':
          if (value >= 32.7) return '12';
          if (value >= 28.5) return '11';
          if (value >= 24.5) return '10';
          if (value >= 20.8) return '9';
          if (value >= 17.2) return '8';
          if (value >= 13.9) return '7';
          if (value >= 10.8) return '6';
          if (value >= 8) return '5';
          if (value >= 5.5) return '4';
          if (value >= 3.4) return '3';
          if (value >= 1.6) return '2';
          if (value >= 0.5) return '1';
          return '0';
        default: // Assume km/h
          if (value >= 118) return '12';
          if (value >= 103) return '11';
          if (value >= 89) return '10';
          if (value >= 75) return '9';
          if (value >= 62) return '8';
          if (value >= 50) return '7';
          if (value >= 39) return '6';
          if (value >= 29) return '5';
          if (value >= 20) return '4';
          if (value >= 12) return '3';
          if (value >= 6) return '2';
          if (value >= 2) return '1';
          return '0';
      }
    }
    return '---';
  }

  get beaufortWindKt(): string {
    const entity = this.config.entity_wind_speed_kt;
    if (entity && this.hass.states[entity] && !isNaN(Number(this.hass.states[entity].state))) {
      const value = Number(this.hass.states[entity].state);
      {
        if (value >= 64) return '12';
        if (value >= 56) return '11';
        if (value >= 48) return '10';
        if (value >= 41) return '9';
        if (value >= 34) return '8';
        if (value >= 28) return '7';
        if (value >= 22) return '6';
        if (value >= 17) return '5';
        if (value >= 11) return '4';
        if (value >= 7) return '3';
        if (value >= 4) return '2';
        if (value >= 1) return '1';
        return '0';
      }
    }
    return '---';
  }

  // SunSetAndRise: returns set and rise information
  get sunSet(): { next: TemplateResult, following: TemplateResult, nextText: string, followingText: string, nextIcon: string, followingIcon: string } {
    var nextSunSet: string;
    var nextSunRise: string;
    if (this.is12Hour) {
      nextSunSet = new Date(this.hass.states[this.config.entity_sun].attributes.next_setting).toLocaleTimeString(this.config.locale, { hour: 'numeric', minute: '2-digit', hour12: true }).replace(" am","am").replace(" pm","pm");
      nextSunRise = new Date(this.hass.states[this.config.entity_sun].attributes.next_rising).toLocaleTimeString(this.config.locale, { hour: 'numeric', minute: '2-digit', hour12: true }).replace(" am","am").replace(" pm","pm");
    } else {
      nextSunSet = new Date(this.hass.states[this.config.entity_sun].attributes.next_setting).toLocaleTimeString(this.config.locale, { hour: '2-digit', minute: '2-digit', hour12: false });
      nextSunRise = new Date(this.hass.states[this.config.entity_sun].attributes.next_rising).toLocaleTimeString(this.config.locale, { hour: '2-digit', minute: '2-digit', hour12: false });
    }
    var nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 1);
    if (this.hass.states[this.config.entity_sun].state == "above_horizon") {
      nextSunRise = nextDate.toLocaleDateString(this.config.locale, { weekday: 'short' }) + " " + nextSunRise;
      return {
        'next': html`<li><span class="ha-icon">
    <ha-icon id="sun-next-icon" icon="mdi:weather-sunset-down"></ha-icon>
  </span><span id="sun-next-text">${nextSunSet}</span></li>`,
        'following': html`<li><span class="ha-icon">
    <ha-icon id="sun-following-icon" icon="mdi:weather-sunset-up"></ha-icon>
  </span><span id="sun-following-text">${nextSunRise}</span></li>`,
        'nextText': nextSunSet,
        'followingText': nextSunRise,
        'nextIcon': "mdi:weather-sunset-down",
        'followingIcon': "mdi:weather-sunset-up",
      };
    } else {
      if (new Date().getDate() != new Date(this.hass.states[this.config.entity_sun].attributes.next_rising).getDate()) {
        nextSunRise = nextDate.toLocaleDateString(this.config.locale, { weekday: 'short' }) + " " + nextSunRise;
        nextSunSet = nextDate.toLocaleDateString(this.config.locale, { weekday: 'short' }) + " " + nextSunSet;
      }
      return {
        'next': html`<li><span class="ha-icon">
    <ha-icon id="sun-next-icon" icon="mdi:weather-sunset-up"></ha-icon>
  </span><span id="sun-next-text">${nextSunRise}</span></li>`,
        'following': html`<li><span class="ha-icon">
    <ha-icon id="sun-following-icon" icon="mdi:weather-sunset-down"></ha-icon>
  </span><span id="sun-following-text">${nextSunSet}</span></li>`,
        'nextText': nextSunRise,
        'followingText': nextSunSet,
        'nextIcon': "mdi:weather-sunset-up",
        'followingIcon': "mdi:weather-sunset-down",
      };
    }
  }

  // is12Hour - returns true if 12 hour clock or false if 24
  get is12Hour(): boolean {
    var hourFormat = this.config.time_format ? this.config.time_format : 12
    switch (hourFormat) {
      case 24:
        return false;
      default:
        return true;
    }
  }

  // get the icon that matches the current conditions
  get weatherIcon(): string {
    switch (this.currentConditions) {
      case 'sunny': return this.iconSunny;
      case 'clear': return this.iconClear;
      case 'mostly-sunny':
      case 'mostly_sunny': return this.iconMostlySunny;
      case 'partly-cloudy':
      case 'partly_cloudy':
      case 'partlycloudy': return this.iconPartlyCloudy;
      case 'cloudy': return this.iconCloudy;
      case 'hazy':
      case 'hazey':
      case 'haze': return this.iconHazy;
      case 'frost': return this.iconFrost;
      case 'light-rain':
      case 'light_rain': return this.iconLightRain;
      case 'wind':
      case 'windy': return this.iconWindy;
      case 'fog':
      case 'foggy': return this.iconFog;
      case 'showers':
      case 'shower': return this.iconShowers;
      case 'rain':
      case 'rainy': return this.iconRain;
      case 'dust':
      case 'dusty': return this.iconDust;
      case 'snow':
      case 'snowy': return this.iconSnow;
      case 'snowy-rainy':
      case 'snowy_rainy':
      case 'snowyrainy': return this.iconSnowRain;
      case 'storm':
      case 'stormy': return this.iconStorm;
      case 'light-showers':
      case 'light-shower':
      case 'light_showers':
      case 'light_shower': return this.iconLightShowers;
      case 'heavy-showers':
      case 'heavy-shower':
      case 'heavy_showers':
      case 'heavy_shower':
      case 'pouring': return this.iconHeavyShowers;
      case 'tropical-cyclone':
      case 'tropical_cyclone':
      case 'tropicalcyclone': return this.iconCyclone;
      case 'clear-day':
      case 'clear_day': return this.iconClearDay;
      case 'clear-night':
      case 'clear_night': return this.iconClearNight;
      case 'sleet': return this.iconSleet;
      case 'partly-cloudy-day':
      case 'partly_cloudy_day': return this.iconPartlyCloudyDay;
      case 'partly-cloudy-night':
      case 'partly_cloudy_night': return this.iconPartlyCloudyNight;
      case 'hail': return this.iconHail;
      case 'lightning':
      case 'lightning-rainy':
      case 'lightning_rainy':
      case 'thunderstorm': return this.iconLightning;
      case 'windy-variant':
      case 'windy_variant': return this.iconWindyVariant;
    }
    return 'unknown';
  }

  get dayOrNight(): string {
    const transformDayNight = { "below_horizon": "night", "above_horizon": "day", };
    return this.config.entity_sun && this.hass.states[this.config.entity_sun] !== undefined ? transformDayNight[this.hass.states[this.config.entity_sun].state] : 'day';
  }

  get iconStyle(): string {
    return (this.config.old_icon === "hybrid") ? `hybrid` : (this.config.old_icon === "false") ? `false` : `true`;
  }

  get iconSunny(): string {
    const iconStyle = this.iconStyle;
    return (iconStyle === "true") ? `${this.dayOrNight}` : (iconStyle === "hybrid") ? `sunny-${this.dayOrNight}` : `sunny-${this.dayOrNight}`;
  }

  get iconClear(): string {
    const iconStyle = this.iconStyle;
    return (iconStyle === "true") ? `${this.dayOrNight}` : (iconStyle === "hybrid") ? `sunny-${this.dayOrNight}` : `clear-${this.dayOrNight}`;
  }

  get iconMostlySunny(): string {
    const iconStyle = this.iconStyle;
    return (iconStyle === "true") ? `fair-${this.dayOrNight}` : (iconStyle === "hybrid") ? `fair-${this.dayOrNight}` : `fair-${this.dayOrNight}`;
  }

  get iconPartlyCloudy(): string {
    const iconStyle = this.iconStyle;
    return (iconStyle === "true") ? `cloudy-${this.dayOrNight}-3` : (iconStyle === "hybrid") ? `cloudy-${this.dayOrNight}-3` : `partly-cloudy-${this.dayOrNight}`;
  }

  get iconCloudy(): string {
    const iconStyle = this.iconStyle;
    return (iconStyle === "true") ? `cloudy-original` : (iconStyle === "hybrid") ? `cloudy-original` : `cloudy`;
  }

  get iconHazy(): string {
    const iconStyle = this.iconStyle;
    return (iconStyle === "true") ? `cloudy-${this.dayOrNight}-1` : (iconStyle === "hybrid") ? `haze` : `haze`;
  }

  get iconFrost(): string {
    const iconStyle = this.iconStyle;
    return (iconStyle === "true") ? `cloudy-${this.dayOrNight}-1` : (iconStyle === "hybrid") ? `cloudy-${this.dayOrNight}-1` : `cloudy-${this.dayOrNight}-1`;
  }

  get iconLightRain(): string {
    const iconStyle = this.iconStyle;
    return (iconStyle === "true") ? `rainy-1` : (iconStyle === "hybrid") ? `rainy-1-${this.dayOrNight}` : `rainy-1-${this.dayOrNight}`;
  }

  get iconWindy(): string {
    const iconStyle = this.iconStyle;
    return (iconStyle === "true") ? `cloudy-original` : (iconStyle === "hybrid") ? `wind` : `wind`;
  }

  get iconFog(): string {
    const iconStyle = this.iconStyle;
    return (iconStyle === "true") ? `cloudy-original` : (iconStyle === "hybrid") ? `fog` : `fog`;
  }

  get iconShowers(): string {
    const iconStyle = this.iconStyle;
    return (iconStyle === "true") ? `rainy-1` : (iconStyle === "hybrid") ? `rainy-1-${this.dayOrNight}` : `rainy-1-${this.dayOrNight}`;
  }

  get iconRain(): string {
    const iconStyle = this.iconStyle;
    return (iconStyle === "true") ? `rainy-5` : (iconStyle === "hybrid") ? `rainy-5` : `rain`;
  }

  get iconDust(): string {
    const iconStyle = this.iconStyle;
    return (iconStyle === "true") ? `cloudy-${this.dayOrNight}-1` : (iconStyle === "hybrid") ? `haze` : `haze`;
  }

  get iconSnow(): string {
    const iconStyle = this.iconStyle;
    return (iconStyle === "true") ? `snowy-6` : (iconStyle === "hybrid") ? `snowy-6` : `snow`;
  }

  get iconSnowRain(): string {
    const iconStyle = this.iconStyle;
    return (iconStyle === "true") ? `snowy-6` : (iconStyle === "hybrid") ? `rain-and-snow-mix` : `rain-and-snow-mix`;
  }

  get iconStorm(): string {
    const iconStyle = this.iconStyle;
    return (iconStyle === "true") ? `scattered-thunderstorms` : (iconStyle === "hybrid") ? `scattered-thunderstorms` : `scattered-thunderstorms`;
  }

  get iconLightShowers(): string {
    const iconStyle = this.iconStyle;
    return (iconStyle === "true") ? `rainy-2` : (iconStyle === "hybrid") ? `rainy-2` : `rainy-2`;
  }

  get iconHeavyShowers(): string {
    const iconStyle = this.iconStyle;
    return (iconStyle === "true") ? `rainy-6` : (iconStyle === "hybrid") ? `rainy-6` : `rainy-6`;
  }


  get iconCyclone(): string {
    const iconStyle = this.iconStyle;
    return (iconStyle === "true") ? `tornado` : (iconStyle === "hybrid") ? `tornado` : `tornado`;
  }

  get iconClearDay(): string {
    const iconStyle = this.iconStyle;
    return (iconStyle === "true") ? `day` : (iconStyle === "hybrid") ? `day` : `clear-day`;
  }

  get iconClearNight(): string {
    const iconStyle = this.iconStyle;
    return (iconStyle === "true") ? `night` : (iconStyle === "hybrid") ? `night` : `clear-night`;
  }

  get iconSleet(): string {
    const iconStyle = this.iconStyle;
    return (iconStyle === "true") ? `rainy-2` : (iconStyle === "hybrid") ? `rain-and-sleet-mix` : `rain-and-sleet-mix`;
  }

  get iconPartlyCloudyDay(): string {
    const iconStyle = this.iconStyle;
    return (iconStyle === "true") ? `cloudy-day-3` : (iconStyle === "hybrid") ? `cloudy-day-3` : `partly-cloudy-day`;
  }

  get iconPartlyCloudyNight(): string {
    const iconStyle = this.iconStyle;
    return (iconStyle === "true") ? `cloudy-night-3` : (iconStyle === "hybrid") ? `cloudy-night-3` : `partly-cloudy-night`;
  }

  get iconHail(): string {
    const iconStyle = this.iconStyle;
    return (iconStyle === "true") ? `rainy-7` : (iconStyle === "hybrid") ? `rainy-7` : `rainy-7`;
  }

  get iconLightning(): string {
    const iconStyle = this.iconStyle;
    return (iconStyle === "true") ? `thunder` : (iconStyle === "hybrid") ? `thunder` : `thunder`;
  }

  get iconWindyVariant(): string {
    const iconStyle = this.iconStyle;
    return (iconStyle === "true") ? `cloudy-${this.dayOrNight}-3` : (iconStyle === "hybrid") ? `cloudy-${this.dayOrNight}-3` : `cloudy-${this.dayOrNight}-3`;
  }

  get localeTextfeelsLike(): string {
    switch (this.config.locale) {
      case 'it': return "Percepito";
      case 'fr': return "Ressenti";
      case 'de': return "Gefühlt";
      case 'nl': return "Voelt als";
      case 'pl': return "Odczuwalne";
      case 'he': return "מרגיש כמו";
      case 'da': return "Føles som";
      case 'ru': return "Ощущается как";
      case 'ua': return "Відчувається як";
      default: return "Feels like";
    }
  }

  get localeTextmaxToday(): string {
    switch (this.config.locale) {
      case 'it': return "Max oggi";
      case 'fr': return "Max aujourd'hui";
      case 'de': return "Max heute";
      case 'nl': return "Max vandaag";
      case 'pl': return "Najwyższa dziś";
      case 'he': return "מקסימלי היום";
      case 'da': return "Højeste i dag";
      case 'ru': return "Макс сегодня";
      case 'ua': return "Макс сьогодні";
      default: return "Today's High";
    }
  }

  get localeTextminToday(): string {
    switch (this.config.locale) {
      case 'it': return "Min oggi";
      case 'fr': return "Min aujourd'hui";
      case 'de': return "Min heute";
      case 'nl': return "Min vandaag";
      case 'pl': return "Najniższa dziś";
      case 'he': return "דקות היום";
      case 'da': return "Laveste i dag";
      case 'ru': return "мин сегодня";
      case 'ua': return "Мін сьогодні";
      default: return "Today's Low";
    }
  }

  get localeTextposToday(): string {
    switch (this.config.locale) {
      case 'it': return "Previsione";
      case 'fr': return "Prévoir";
      case 'de': return "Vorhersage";
      case 'nl': return "Prognose";
      case 'pl': return "Prognoza";
      case 'he': return "תַחֲזִית";
      case 'da': return "Vejrudsigt";
      case 'ru': return "Прогноз";
      case 'ua': return "Прогноз";
      default: return "Forecast";
    }
  }

  get localeTextposTomorrow(): string {
    switch (this.config.locale) {
      case 'it': return "Prev per domani";
      case 'fr': return "Prév demain";
      case 'de': return "Prog morgen";
      case 'nl': return "Prog morgen";
      case 'pl': return "Prog jutro";
      case 'he': return "תחזית מחר";
      case 'da': return "Prog i morgen";
      case 'ru': return "Прогноз на завтра";
      case 'ua': return "Прогноз на завтра";
      default: return "Fore Tom";
    }
  }

  get localeTextuvRating(): string {
    switch (this.config.locale) {
      case 'it': return "UV";
      case 'fr': return "UV";
      case 'de': return "UV";
      case 'nl': return "UV";
      case 'pl': return "UV";
      case 'he': return "UV";
      case 'da': return "UV";
      case 'ru': return "УФ";
      case 'ua': return "УФ";
      default: return "UV";
    }
  }

  get localeTextfireDanger(): string {
    switch (this.config.locale) {
      case 'it': return "Fuoco";
      case 'fr': return "Feu";
      case 'de': return "Feuer";
      case 'nl': return "Brand";
      case 'pl': return "Ogień";
      case 'he': return "אֵשׁ";
      case 'da': return "Brand";
      case 'ru': return "Огонь";
      case 'ua': return "Вогонь";
      default: return "Fire";
    }
  }

  getUOM(measure: string): string {
    const lengthUnit = this.hass.config.unit_system.length;

    switch (measure) {
      case 'air_pressure':
        return this.config.entity_pressure !== undefined && this.hass.states[this.config.entity_pressure].attributes.unit_of_measurement !== undefined ?
          this.hass.states[this.config.entity_pressure].attributes.unit_of_measurement as string :
          lengthUnit === 'km' ?
            'hPa' :
            'mbar';
      case 'length':
        return lengthUnit;
      case 'precipitation':
        return lengthUnit === 'km' ? 'mm' : 'in';
      case 'intensity':
        return lengthUnit === 'km' ? 'mm/h' : 'in/h';
      default:
        return this.hass.config.unit_system[measure] || '';
    }
  }

  private _showConfigWarning(warnings: string[]): TemplateResult {
    // const errorCard = <LovelaceCard>document.createElement('hui-error-card');
    // eslint-disable-next-line no-console
    return html`
      <hui-warning>
        <div>Weather Card</div>
        ${warnings.map(warning => html`<div>${warning}</div>`)}
      </hui-warning>
    `;
  }

  private _showWarning(warning: string): TemplateResult {
    return html`<hui-warning>${warning}</hui-warning>`;
  }

  private _showError(error: string): TemplateResult {
    const errorCard = document.createElement('hui-error-card');
    errorCard.setConfig({
      type: 'error',
      error,
      origConfig: this.config,
    });

    return html`${errorCard}`;
  }

  // https://lit.dev/docs/components/styles/
  get styles(): CSSResult {
    // Get config flags or set defaults if not configured
    // var tooltipBGColor = this.config.tooltip_bg_color || "rgb( 75,155,239)";
    // var tooltipFGColor = this.config.tooltip_fg_color || "#fff";
    // var tooltipBorderColor = this.config.tooltip_border_color || "rgb(255,161,0)";
    // var tooltipBorderWidth = this.config.tooltip_border_width || "1";
    // var tooltipCaretSize = this.config.tooltip_caret_size || "5";
    // var tooltipWidth = this.config.tooltip_width || "110";
    // var tooltipLeftOffset = this.config.tooltip_left_offset || "-12";
    // var tooltipVisible = this.config.tooltips ? "visible" : "hidden";
    // const tempTopMargin = this.config.temp_top_margin || "0px";
    const tempFontWeight = this.config.temp_font_weight || "300";
    const tempFontSize = this.config.temp_font_size || "4em";
    // const tempRightPos = this.config.temp_right_pos || "0.85em";
    // const tempUOMTopMargin = this.config.temp_uom_top_margin || "-12px";
    // const tempUOMRightMargin = this.config.temp_uom_right_margin || "4px";
    // var apparentTopMargin = this.config.apparent_top_margin || "45px";
    // var apparentRightPos =  this.config.apparent_right_pos || "1em";
    // var apparentRightMargin = this.config.apparent_right_margin || "1em";
    // var currentTextTopMargin = this.config.current_text_top_margin || "4.5em";
    // var currentTextLeftPos = this.config.current_text_left_pos || "0px";
    const currentTextFontSize = this.config.current_text_font_size || "1.5em";
    // var currentTextWidth = this.config.current_text_width || "100%";
    const currentTextAlignment = this.config.current_text_alignment || "center";
    // var largeIconTopMargin = this.config.large_icon_top_margin || "-3.2em";
    // var largeIconLeftPos = this.config.large_icon_left_pos || "0px";
    // var currentDataTopMargin = this.config.current_data_top_margin ? this.config.current_data_top_margin : this.config.show_separator ? "1em" : "10em"; //TODO - check if really needed, was using in variations
    // var separatorTopMargin = this.config.separator_top_margin || "6em";
    // var summaryTopPadding = this.config.summary_top_padding || "2em";
    // var summaryFontSize = this.config.summary_font_size || "0.8em";

    return css`
      .card {
        padding: 16px;
      }
      .content {
        align-items: center;
      }
      .title-section {
        padding-bottom: 1.5em;
      }
      .title {
        font-size: 1.5em;
        color: var(--primary-text-color);
      }
      .updated {
        font-size: 0.9em;
        font-weight: 300;
        color: var(--primary-text-color);
      }
      .top-row {
        display: flex;
        justify-content: space-between;
        flex-wrap: nowrap;
      }
      .top-left {
        display: flex;
        flex-direction: column;
        height: 8em;
      }
      .big-icon {
        height: 10em;
        width: 10em;
        position: relative;
        left: -1em;
        top: -2em;
      }
      .currentTemps {
        display: flex;
        align-self: flex-start;
        flex-direction: column;
        padding: 0px 10px;
      }
      .current-temp {
        display: table-row;
        margin-left: auto;
        padding: 4px 0px;
      }
      .temp {
        display:table-cell;
        font-weight: ${unsafeCSS(tempFontWeight)};
        font-size: ${unsafeCSS(tempFontSize)};
        color: var(--primary-text-color);
        position: relative;
        line-height: 74%;
      }
      .tempc {
        display: table-cell;
        vertical-align: top;
        font-weight: ${unsafeCSS(tempFontWeight)};
        font-size: 1.5em;
        color: var(--primary-text-color);
        position: relative;
        line-height: 74%;
      }
      .apparent-temp {
        display: table-row;
        margin-left: auto;
        padding: 8px 0px;
      }
      .apparent {
        display: table-cell;
        color: var(--primary-text-color);
        position: relative;
        line-height: 80%;
      }
      .apparentc {
        display: table-cell;
        vertical-align: top;
        font-size: 0.75em;
        color: var(--primary-text-color);
        position: relative;
        line-height: 80%;
      }
      .line {
        margin-left: 0.5em;
        margin-right: 0.5em;
        margin-top : -12px;
        margin-bottom: 10px;
      }
      .current-text {
        font-size: ${unsafeCSS(currentTextFontSize)};
        color: var(--secondary-text-color);
        overflow: hidden;
        white-space: nowrap;
        text-align: ${unsafeCSS(currentTextAlignment)};
        padding-bottom: 0.2em;
      }
      .variations {
        display: flex;
        flex-flow: row wrap;
        font-weight: 300;
        color: var(--primary-text-color);
        list-style: none;
        padding: 0.2em;
      }
      .slot-list-item-1 {
        min-width:50%;
        padding-right: 16px;
      }
      .slot-list {
        list-style: none;
        padding: 0;
      }
      .slot-list li {
        height:24px;
      }
      .variations-ugly {
        display: flex;
        flex-flow: row wrap;
        justify-content: space-between;
        font-weight: 300;
        color: var(--primary-text-color);
        list-style: none;
        padding: 0.2em;
      }
      .ha-icon {
        height: 24px;
        margin-right: 5px;
        color: var(--paper-item-icon-color);
      }
      .unit {
        font-size: 0.8em;
      }
      .slot {
        display: table-row;
      }
      .slot-icon {
        display: table-cell;
        position: relative;
        height: 18px;
        padding-right: 5px;
        color: var(--paper-item-icon-color);
      }
      .slot-text {
        display: table-cell;
        position: relative;
      }
      .unitc {
        display: table-cell;
        position: relative;
        vertical-align: top;
        font-size: 0.75em;
        line-height: 80%;
        padding-top: 7px;
      }
      `;
  }
}
