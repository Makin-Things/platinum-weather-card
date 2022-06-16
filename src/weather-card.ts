/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { LitElement, html, TemplateResult, css, PropertyValues, CSSResult, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators';
import { HomeAssistant, LovelaceCardEditor, getLovelace } from 'custom-card-helpers';

import type { timeFormat, WeatherCardConfig } from './types';
import { CARD_VERSION } from './const';
import { localize } from './localize/localize';

/* eslint no-console: 0 */
console.info(
  `%c  MAKIN-THINGS-WEATHER-CARD  \n%c  ${localize('common.version')} ${CARD_VERSION}             `,
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

  @state() private _config!: WeatherCardConfig;

  private _error: string[] = [];

  public getCardSize(): number {
    console.info(`getCardSize`);
    var cardHeight = 16;
    cardHeight += this._config.show_section_title === true ? 56 : 0;
    cardHeight += this._config.overview !== false ? 162 : 0;
    cardHeight += this._config.show_section_extended !== false ? 58 : 0;
    const cardSize = Math.ceil(cardHeight / 50);
    console.info(`CardHeight=${cardHeight} CardSize=${cardSize}`);
    return cardSize;
  }

  // https://lit.dev/docs/components/properties/#accessors-custom
  public setConfig(config: WeatherCardConfig): void {
    // TODO Check for required fields and that they are of the proper format
    if (!config) {
      throw new Error(localize('common.invalid_configuration'));
    }

    if (config.test_gui) {
      getLovelace().setEditMode(true);
    }

    this._config = {
      name: 'Weather',
      ...config,
    };
  }

  // https://lit.dev/docs/components/lifecycle/#reactive-update-cycle-performing
  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (!this._config) {
      return false;
    }

    const oldHass = changedProps.get("hass") as HomeAssistant || undefined;

    if (
      !oldHass ||
      oldHass.themes !== this.hass.themes ||
      oldHass.locale !== this.hass.locale
    ) {
      return true;
    }

    // Check if any entities mentioned in the config have changed
    if (Object.keys(this._config).every(entity => {
      if (entity.match(/^entity_/) !== null) {
        if (oldHass.states[this._config[entity]] !== this.hass.states[this._config[entity]]) {
          return false;
        }
      }
      return true;
    }) === false) {
      return true;
    }

    // check if any of the calculated forecast entities have changed, but only if the daily slot is shown
    if (this._config['show_section_daily_forecast']) {
      const days = this._config['daily_forecast_days'] || 5;
      for (const entity of ['entity_forecast_icon_1', 'entity_summary_1', 'entity_forecast_low_temp_1', 'entity_forecast_high_temp_1', 'entity_pop_1', 'entity_pos_1']) {
        if (this._config[entity] !== undefined) {
          // check there is a number in the name
          const start = this._config[entity].match(/(\d+)(?!.*\d)/g);
          if (start) {
            // has a number so now check all the extra entities exist
            for (var _i = 1; _i < days; _i++) {
              const newEntity = this._config[entity].replace(/(\d+)(?!.*\d)/g, Number(start) + _i);
              if (oldHass.states[newEntity] !== this.hass.states[newEntity]) {
                return true;
              }
            }
          }
        }
      }
    }

    return changedProps.has('config');
  }

  private _checkForErrors(): boolean {
    this._error = [];
    Object.keys(this._config).forEach(entity => {
      if (entity.match(/^entity_/) !== null) {
        if (this.hass.states[this._config[entity]] === undefined) {
          this._error.push(`'${entity}=${this._config[entity]}' not found`);
        }
      }
    });
    const days = this._config['daily_forecast_days'] || 5;
    for (const entity of ['entity_forecast_icon_1', 'entity_summary_1', 'entity_forecast_low_temp_1', 'entity_forecast_high_temp_1', 'entity_pop_1', 'entity_pos_1']) {
      if (this._config[entity] !== undefined) {
        // check there is a number in the name
        const start = this._config[entity].match(/(\d+)(?!.*\d)/g);
        if (start) {
          // has a number so now check all the extra entities exist
          for (var _i = 1; _i < days; _i++) {
            const newEntity = this._config[entity].replace(/(\d+)(?!.*\d)/g, Number(start) + _i);
            if (this.hass.states[newEntity] === undefined) {
              this._error.push(`'${entity}'+${_i}=${newEntity}' not found`);
            }
          }
        } else {
          this._error.push(`'${entity}=${this._config[entity]}' value needs to have a number`);
        }
      }
    }
    return this._error.length !== 0;
  }

  private _renderTitleSection(): TemplateResult {
    if ((this._config?.show_section_title !== true) || ((this._config.text_card_title === undefined) && (this._config.entity_update_time == undefined))) return html``;

    var updateTime: string;
    if ((this._config.entity_update_time) && (this.hass.states[this._config.entity_update_time]) && (this.hass.states[this._config.entity_update_time].state !== undefined)) {
      const d = new Date(this.hass.states[this._config.entity_update_time].state);
      switch (this.timeFormat) {
        case '12hour':
          updateTime = d.toLocaleString(this.locale, { hour: 'numeric', minute: '2-digit', hour12: true }).replace(" ", "") + ", " + d.toLocaleDateString(this.locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).replace(",", "");
          break;
        case '24hour':
          updateTime = d.toLocaleString(this.locale, { hour: '2-digit', minute: '2-digit', hour12: false }) + ", " + d.toLocaleDateString(this.locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).replace(",", "");
          break;
        case 'system':
          updateTime = d.toLocaleTimeString(navigator.language, { timeStyle: 'short' }).replace(" ", "") + ", " + d.toLocaleDateString(navigator.language).replace(",", "");
          break;
      }
    } else {
      updateTime = '---';
    }

    return html`
      <div class="title-section section">
        ${this._config.text_card_title ? html`<div class="card-header">${this._config.text_card_title}</div>` : html``}
        ${this._config.entity_update_time ? html`<div class="updated">${this._config.text_update_time_prefix ?
        this._config.text_update_time_prefix + ' ' : ''}${updateTime}</div>` : html``}
      </div>
    `;
  }

  private _renderOverviewSection(): TemplateResult {
    if (this._config?.show_section_overview === false) return html``;

    const weatherIcon = this._weatherIcon(this.currentConditions);
    const url = new URL('icons/' + (this._config.option_static_icons ? 'static' : 'animated') + '/' + weatherIcon + '.svg', import.meta.url);
    const hoverText = weatherIcon !== 'unknown' ? '' : `Unknown condition\n${this.currentConditions}`;
    const biggerIcon = html`<div class="big-icon"><img src="${url.href}" width="100%" height="100%" title="${hoverText}"></div>`;

    const currentTemp = html`
      <div class="current-temp">
        <div class="temp" id="current-temp-text">${this.currentTemperature}</div>
        <div class="tempc">${this.getUOM('temperature')}</div>
      </div>
    `;

    const apparentTemp = html`
      <div class="apparent-temp">
        <div class="apparent">${this.localeTextFeelsLike} <span
            id="apparent-temp-text">${this.currentApparentTemperature}</span>
        </div>
        <div class="apparentc"> ${this.getUOM('temperature')}</div>
      </div>
    `;

    const separator = this._config.show_separator === true ? html`<hr class=line>` : ``;

    const currentText = (this._config.entity_current_text) && (this.hass.states[this._config.entity_current_text]) ? this.hass.states[this._config.entity_current_text].state ?? '---' : '---';

    return html`
      <div class="overview-section section">
        <div class="overview-top">
          <div class="top-left">${biggerIcon}</div>
          <div class="currentTemps">${currentTemp}${apparentTemp}</div>
        </div>
        <div class="current-text">${currentText}</div>
        ${separator}
      </div>
    `;
  }

  private _renderExtendedSection(): TemplateResult {
    if (this._config?.show_section_extended === false) return html``;

    const extendedEntity = this._config['entity_daily_summary'] || '';
    var extended: TemplateResult[] = [];
    if (this.hass.states[extendedEntity] !== undefined) {
      if (this._config['extended_use_attr'] === true) {
        if (this._config['extended_name_attr'] !== undefined) {
          const attribute = this._config['extended_name_attr'].toLowerCase().split(".").reduce((retval, value) => retval !== undefined ? retval[value] : undefined, this.hass.states[extendedEntity].attributes);
          if (attribute !== undefined) extended.push(html`${attribute}`);
        }
      } else {
        if (this.hass.states[extendedEntity] !== undefined) extended.push(html`${this.hass.states[extendedEntity].state}`);
      }
    }
    extended.push(html`${this._config['entity_todays_uv_forecast'] && this.hass.states[this._config['entity_todays_uv_forecast']] &&
      this.hass.states[this._config['entity_todays_uv_forecast']].state !== "unknown" ? " " +
    this.hass.states[this._config['entity_todays_uv_forecast']].state : ""}`);
    extended.push(html`${this._config['entity_todays_fire_danger'] && this.hass.states[this._config['entity_todays_fire_danger']] &&
      this.hass.states[this._config['entity_todays_fire_danger']].state !== "unknown" ? " " +
    this.hass.states[this._config['entity_todays_fire_danger']].state : ""}`);

    return html`
      <div class="extended-section section">
        <div class="f-extended">
          ${extended}
        </div>
      </div>
    `;
  }

  private _renderSlotsSection(): TemplateResult {
    if (this._config?.show_section_slots === false) return html``;

    var slot_section = (this._config.use_old_column_format === true) ? html`
      <div>
        <ul class="variations-ugly">
          <li>
            <ul class="slot-list">${this.slotL1}${this.slotL2}${this.slotL3}${this.slotL4}${this.slotL5}${this.slotL6}${this.slotL7}${this.slotL8}</ul>
          </li>
          <li>
            <ul class="slot-list">${this.slotR1}${this.slotR2}${this.slotR3}${this.slotR4}${this.slotR5}${this.slotR6}${this.slotR7}${this.slotR8}</ul>
          </li>
        </ul>
      </div>
    ` : html`
      <div>
        <ul class="variations">
          <li class="slot-list-item-1">
            <ul class="slot-list">
              ${this.slotL1}${this.slotL2}${this.slotL3}${this.slotL4}${this.slotL5}${this.slotL6}${this.slotL7}${this.slotL8}
            </ul>
          </li>
          <li>
            <ul class="slot-list">
              ${this.slotR1}${this.slotR2}${this.slotR3}${this.slotR4}${this.slotR5}${this.slotR6}${this.slotR7}${this.slotR8}
            </ul>
          </li>
        </ul>
      </div>
    `;

    return html`
      <div class="slot-section section">${slot_section}</div>
    `;
  }

  private _renderHorizontalDailyForecastSection(): TemplateResult {
    const htmlDays: TemplateResult[] = [];
    const days = this._config.daily_forecast_days || 5;

    for (var i = 0; i < days; i++) {
      const forecastDate = new Date();
      forecastDate.setDate(forecastDate.getDate() + i + 1);
      var start = this._config['entity_forecast_icon_1'] ? this._config['entity_forecast_icon_1'].match(/(\d+)(?!.*\d)/g) : false;
      const iconEntity = this._config['entity_forecast_icon_1'] ? this._config['entity_forecast_icon_1'].replace(/(\d+)(?!.*\d)/g, String(Number(start) + i)) : undefined;
      const url = new URL(('icons/' + (this._config.option_static_icons ? 'static' : 'animated') + '/' + (iconEntity && this.hass.states[iconEntity] ? this._weatherIcon(this.hass.states[iconEntity].state) : 'unknown') + '.svg').replace("-night", "-day"), import.meta.url);
      const htmlIcon = html`<i class="icon" style="background: none, url(${url.href}) no-repeat; background-size: contain;"></i><br>`;
      start = this._config['entity_forecast_high_temp_1'] ? this._config['entity_forecast_high_temp_1'].match(/(\d+)(?!.*\d)/g) : false;
      const maxEntity = start && this._config['entity_forecast_high_temp_1'] ? this._config['entity_forecast_high_temp_1'].replace(/(\d+)(?!.*\d)/g, String(Number(start) + i)) : undefined;
      start = this._config['entity_forecast_low_temp_1'] ? this._config['entity_forecast_low_temp_1'].match(/(\d+)(?!.*\d)/g) : false;
      const minEntity = start && this._config['entity_forecast_low_temp_1'] ? this._config['entity_forecast_low_temp_1'].replace(/(\d+)(?!.*\d)/g, String(Number(start) + i)) : undefined;
      const tempUnit = html`<div class="unitc">${this.getUOM("temperature")}</div>`;
      const minMax = this._config.old_daily_format === true
        ?
        html`
          <div class="f-slot">
            <div class="highTemp">${maxEntity && this.hass.states[maxEntity] ? Math.round(Number(this.hass.states[maxEntity].state)) : '---'}</div>
            <div>${tempUnit}</div>
          </div>
          <br>
          <div class="f-slot">
            <div class="lowTemp">${minEntity && this.hass.states[minEntity] ? Math.round(Number(this.hass.states[minEntity].state)) : '---'}</div>
            <div>${tempUnit}</div>
          </div>`
        :
        this._config.tempformat === "highlow"
          ?
          html`
            <div class="f-slot">
              <div class="highTemp">${maxEntity && this.hass.states[maxEntity] ? Math.round(Number(this.hass.states[maxEntity].state)) : "---"}</div>
              <div class="slash">/</div>
              <div class="lowTemp">${minEntity && this.hass.states[minEntity] ? Math.round(Number(this.hass.states[minEntity].state)) : "---"}</div>
              <div>${tempUnit}</div>
            </div>`
          :
          html`
            <div class="f-slot">
              <div class="lowTemp">${minEntity && this.hass.states[minEntity] ? Math.round(Number(this.hass.states[minEntity].state)) : "---"}</div>
              <div class="slash">/</div>
              <div class="highTemp">${maxEntity && this.hass.states[maxEntity] ? Math.round(Number(this.hass.states[maxEntity].state)) : "---"}</div>
              <div>${tempUnit}</div>
            </div>`;
      start = this._config['entity_pop_1'] ? this._config['entity_pop_1'].match(/(\d+)(?!.*\d)/g) : false;
      const popEntity = start && this._config['entity_pop_1'] ? this._config['entity_pop_1'].replace(/(\d+)(?!.*\d)/g, String(Number(start) + i)) : undefined;
      const pop = start ? html`<br><div class="f-slot"><div class="pop">${popEntity && this.hass.states[popEntity] ? Math.round(Number(this.hass.states[popEntity].state)) : "---"}</div><div class="unit">%</div></div>` : ``;
      start = this._config['entity_pos_1'] ? this._config['entity_pos_1'].match(/(\d+)(?!.*\d)/g) : false;
      const posEntity = start && this._config['entity_pos_1'] ? this._config['entity_pos_1'].replace(/(\d+)(?!.*\d)/g, String(Number(start) + i)) : undefined;
      const pos = start ? html`<br><div class="f-slot"><div class="pos">${posEntity && this.hass.states[posEntity] ? this.hass.states[posEntity].state : "---"}</div><div class="unit">${this.getUOM('precipitation')}</div></div>` : ``;
      start = this._config['entity_summary_1'] ? this._config['entity_summary_1'].match(/(\d+)(?!.*\d)/g) : false;
      const tooltipEntity = start && this._config['entity_summary_1'] ? this._config['entity_summary_1'].replace(/(\d+)(?!.*\d)/g, String(Number(start) + i)) : undefined;
      const tooltip = html`<div class="fcasttooltiptext" id="fcast-summary-${i}">${this._config.option_tooltips && tooltipEntity ? this.hass.states[tooltipEntity] ? this.hass.states[tooltipEntity].state : "---" : ""}</div>`;

      htmlDays.push(html`
        <div class="day-horiz fcasttooltip">
          <span class="dayname">${forecastDate ? forecastDate.toLocaleDateString(this.locale, { weekday: 'short' }) :
          "---"}</span>
          <br>${htmlIcon}
          ${minMax}
          ${pop}
          ${pos}
          ${tooltip}
        </div>
      `);
    }
    return html`
      <div class="daily-forecast-horiz-section section">
        ${htmlDays}
      </div>
    `;
  }

  private _renderVerticalDailyForecastSection(): TemplateResult {
    const htmlDays: TemplateResult[] = [];
    const days = this._config.daily_forecast_days || 5;

    for (var i = 0; i < days; i++) {
      const forecastDate = new Date();
      forecastDate.setDate(forecastDate.getDate() + i + 1);
      var start = this._config['entity_forecast_icon_1'] ? this._config['entity_forecast_icon_1'].match(/(\d+)(?!.*\d)/g) : false;
      const iconEntity = start && this._config['entity_forecast_icon_1'] ? this._config['entity_forecast_icon_1'].replace(/(\d+)(?!.*\d)/g, String(Number(start) + i)) : undefined;
      if (!iconEntity || this.hass.states[iconEntity] === undefined || this.hass.states[iconEntity].state === 'unknown') { // Stop adding forecast days as soon as an undefined entity is encountered
        break;
      }
      const url = new URL(('icons/' + (this._config.option_static_icons ? 'static' : 'animated') + '/' + (this.hass.states[iconEntity] !== undefined ? this._weatherIcon(this.hass.states[iconEntity].state) : 'unknown') + '.svg').replace("-night", "-day"), import.meta.url);
      const htmlIcon = html`<i class="icon" style="background: none, url(${url.href}) no-repeat; background-size: contain;"></i><br>`;
      start = this._config['entity_forecast_high_temp_1'] ? this._config['entity_forecast_high_temp_1'].match(/(\d+)(?!.*\d)/g) : false;
      const maxEntity = start && this._config['entity_forecast_high_temp_1'] ? this._config['entity_forecast_high_temp_1'].replace(/(\d+)(?!.*\d)/g, String(Number(start) + i)) : undefined;
      start = this._config['entity_forecast_low_temp_1'] ? this._config['entity_forecast_low_temp_1'].match(/(\d+)(?!.*\d)/g) : false;
      const minEntity = start && this._config['entity_forecast_low_temp_1'] ? this._config['entity_forecast_low_temp_1'].replace(/(\d+)(?!.*\d)/g, String(Number(start) + i)) : undefined;
      const tempUnit = html`<div class="unitc">${this.getUOM("temperature")}</div>`;
      const min = minEntity && this.hass.states[minEntity] ? html`
        <div class="temp-label">Min: </div>
        <div class="low-temp">${Math.round(Number(this.hass.states[minEntity].state))}</div>${tempUnit}` : html`---`;
      const max = maxEntity && this.hass.states[maxEntity] ? html`
        <div class="temp-label">Max: </div>
        <div class="high-temp">${Math.round(Number(this.hass.states[maxEntity].state))}</div>${tempUnit}` : html`---`;
      const minMax = this._config.tempformat === "highlow"
        ?
        html`
          <div class="f-slot">
            <div class="highTemp">${maxEntity && this.hass.states[maxEntity] ? Math.round(Number(this.hass.states[maxEntity].state)) : "---"}</div>
            <div class="slash">/</div>
            <div class="lowTemp">${minEntity && this.hass.states[minEntity] ? Math.round(Number(this.hass.states[minEntity].state)) : "---"}</div>
            <div>${tempUnit}</div>
          </div>`
        :
        html`
          <div class="f-slot">${min}${max}</div>`;
      start = this._config['entity_summary_1'] ? this._config['entity_summary_1'].match(/(\d+)(?!.*\d)/g) : false;
      const summaryEntity = start && this._config['entity_summary_1'] ? this._config['entity_summary_1'].replace(/(\d+)(?!.*\d)/g, String(Number(start) + i)) : undefined;
      const summary = start ? html`
        <br><div class="f-slot">${summaryEntity && this.hass.states[summaryEntity] ? this.hass.states[summaryEntity].state : "---"}</div>` : ``;
      start = this._config['entity_pop_1'] ? this._config['entity_pop_1'].match(/(\d+)(?!.*\d)/g) : false;
      const popEntity = start && this._config['entity_pop_1'] ? this._config['entity_pop_1'].replace(/(\d+)(?!.*\d)/g, String(Number(start) + i)) : undefined;
      const pop = start ? html`
        <div class="f-slot"><div class="f-label">Chance of rain </div>
        <div class="pop">${popEntity && this.hass.states[popEntity] ? Math.round(Number(this.hass.states[popEntity].state)) : "---"}</div><div class="unit">%</div></div>` : ``;
      start = this._config['entity_pos_1'] ? this._config['entity_pos_1'].match(/(\d+)(?!.*\d)/g) : false;
      const posEntity = start && this._config['entity_pos_1'] ? this._config['entity_pos_1'].replace(/(\d+)(?!.*\d)/g, String(Number(start) + i)) : undefined;
      const pos = start ? html`
        <br><div class="f-slot"><div class="f-label">Possible rain </div>
        <div class="pos">${posEntity && this.hass.states[posEntity] ? this.hass.states[posEntity].state : "---"}</div>
        <div class="unit">${this.getUOM('precipitation')}</div></div>` : ``;
      start = this._config['entity_extended_1'] && i < (this._config['daily_extended_forecast_days'] !== 0 ? this._config['daily_extended_forecast_days'] || 7 : 0) ? this._config['entity_extended_1'].match(/(\d+)(?!.*\d)/g) : false;
      var extended: TemplateResult = html``;
      if (this._config['option_daily_show_extended'] === true) {
        if (this._config['daily_extended_use_attr'] === true) {
          start = this._config['entity_extended_1'] ? this._config['entity_extended_1'].match(/(\d+)(?!.*\d)/g) : false;
          const extendedEntity = start && this._config['entity_extended_1'] ? this._config['entity_extended_1'].replace(/(\d+)(?!.*\d)/g, String(Number(start) + i)) : this._config['entity_extended_1'];
          if (extendedEntity && this.hass.states[extendedEntity] !== undefined) {
            start = this._config['daily_extended_name_attr'] && i < (this._config['daily_extended_forecast_days'] !== 0 ? this._config['daily_extended_forecast_days'] || 7 : 0) ? this._config['daily_extended_name_attr'].match(/(\d+)(?!.*\d)/g) : false;
            const attribute = start == null && extendedEntity && this._config['daily_extended_name_attr'] ? this.hass.states[extendedEntity].attributes[this._config['daily_extended_name_attr']] : start && this._config['daily_extended_name_attr'] && extendedEntity ? this._config['daily_extended_name_attr'].replace(/(\d+)(?!.*\d)/g, String(Number(start) + i)).toLowerCase().split(".").reduce((retval, value) => retval !== undefined ? retval[value] : undefined, this.hass.states[extendedEntity].attributes) : undefined;
            extended = attribute ? html`<div class="f-extended">${attribute}</div>` : html``;
          }
        } else {
          const extendedEntity = start && this._config['entity_extended_1'] ? this._config['entity_extended_1'].replace(/(\d+)(?!.*\d)/g, String(Number(start) + i)) : undefined;
          extended = start ? html`<div class="f-extended">${extendedEntity && this.hass.states[extendedEntity] ? this.hass.states[extendedEntity].state :
            "---"}</div>` : html``;
        }
      }

      htmlDays.push(html`
        <div class="day-vert fcasttooltip">
          <div class="day-vert-top">
            <div class="day-vert-dayicon">
              <span class="dayname">${forecastDate ? forecastDate.toLocaleDateString(this.locale, { weekday: 'short' }) : "---"}</span>
              <br>${htmlIcon}
            </div>
            <div class="day-vert-values">
              ${minMax}
              ${summary}
            </div>
            <div class="day-vert-values">
              ${pop}
              ${pos}
            </div>
          </div>
          <div class="day-vert-bottom">
            ${extended}
          </div>
        </div>
      `);
    }

    return html`
      <div class="daily-forecast-vert-section section">
        ${htmlDays}
      </div>
    `;
  }

  private _renderDailyForecastSection(): TemplateResult {
    if (this._config?.show_section_daily_forecast === false) return html``;

    if (this._config.daily_forecast_layout !== 'vertical') {
      return this._renderHorizontalDailyForecastSection();
    } else {
      return this._renderVerticalDailyForecastSection();
    }

    // return html`
    //   <div>${daily_forecast_section}</div>
    // `;
  }

  protected render(): TemplateResult | void {
    const htmlCode: TemplateResult[] = [];
    if (this._checkForErrors()) htmlCode.push(this._showConfigWarning(this._error));

    const sections: TemplateResult[] = [];
    this._config.section_order.forEach(section => {
      switch (section) {
        case 'title':
          sections.push(this._renderTitleSection());
          break;
        case 'overview':
          sections.push(this._renderOverviewSection());
          break;
        case 'extended':
          sections.push(this._renderExtendedSection());
          break;
        case 'slots':
          sections.push(this._renderSlotsSection());
          break;
        case 'daily_forecast':
          sections.push(this._renderDailyForecastSection());
          break;
      }
    });

    htmlCode.push(html`
      <style>
        ${this.styles}
      </style>
      <ha-card class="card">
        <div class="content">
          ${sections}
        </div>
      </ha-card>
    `);
    return html`${htmlCode}`;
  }

  // slots - returns the value to be displyed in a specific current condition slot
  get slotL1(): TemplateResult {
    return this.slotValue('l1', this._config.slot_l1);
  }

  get slotL2(): TemplateResult {
    return this.slotValue('l2', this._config.slot_l2);
  }

  get slotL3(): TemplateResult {
    return this.slotValue('l3', this._config.slot_l3);
  }

  get slotL4(): TemplateResult {
    return this.slotValue('l4', this._config.slot_l4);
  }

  get slotL5(): TemplateResult {
    return this.slotValue('l5', this._config.slot_l5);
  }

  get slotL6(): TemplateResult {
    return this.slotValue('l6', this._config.slot_l6);
  }

  get slotL7(): TemplateResult {
    return this.slotValue('l7', this._config.slot_l7);
  }

  get slotL8(): TemplateResult {
    return this.slotValue('l8', this._config.slot_l8);
  }

  get slotR1(): TemplateResult {
    return this.slotValue('r1', this._config.slot_r1);
  }

  get slotR2(): TemplateResult {
    return this.slotValue('r2', this._config.slot_r2);
  }

  get slotR3(): TemplateResult {
    return this.slotValue('r3', this._config.slot_r3);
  }

  get slotR4(): TemplateResult {
    return this.slotValue('r4', this._config.slot_r4);
  }

  get slotR5(): TemplateResult {
    return this.slotValue('r5', this._config.slot_r5);
  }

  get slotR6(): TemplateResult {
    return this.slotValue('r6', this._config.slot_r6);
  }

  get slotR7(): TemplateResult {
    return this.slotValue('r7', this._config.slot_r7);
  }

  get slotR8(): TemplateResult {
    return this.slotValue('r8', this._config.slot_r8);
  }

  // slots - calculates the specific slot value
  slotValue(slot: string, value: string | undefined): TemplateResult {
    switch (value) {
      case 'pop': return this.slotPop;
      case 'popforecast': return this.slotPopForecast;
      case 'possible_today': return this.slotPossibleToday;
      case 'possible_tomorrow': return this.slotPossibleTomorrow;
      case 'rainfall': return this.slotRainfall;
      case 'humidity': return this.slotHumidity;
      case 'pressure': return this.slotPressure;
      case 'observed_max': return this.slotObservedMax;
      case 'observed_min': return this.slotObservedMin;
      case 'forecast_max': return this.slotForecastMax;
      case 'forecast_min': return this.slotForecastMin;
      case 'temp_next': return this.slotTempNext;
      case 'temp_following': return this.slotTempFollowing;
      case 'temp_maximums': return this.slotTempMaximums;
      case 'temp_minimums': return this.slotTempMinimums;
      case 'uv_summary': return this.slotUvSummary;
      case 'fire_summary': return this.slotFireSummary;
      case 'wind': return this.slotWind;
      case 'wind_kt': return this.slotWindKt;
      case 'visibility': return this.slotVisibility;
      case 'sun_next': return this.slotSunNext;
      case 'sun_following': return this.slotSunFollowing;
      case 'custom1': return this.slotCustom1;
      case 'custom2': return this.slotCustom2;
      case 'custom3': return this.slotCustom3;
      case 'custom4': return this.slotCustom4;
      case 'empty': return this.slotEmpty;
      case 'remove': return this.slotRemove;
    }

    // If no value can be matched pass back a default for the slot
    switch (slot) {
      case 'l1': return this.slotForecastMax;
      case 'l2': return this.slotForecastMin;
      case 'l3': return this.slotWind;
      case 'l4': return this.slotPressure;
      case 'l5': return this.slotSunNext;
      case 'l6': return this.slotRemove;
      case 'l7': return this.slotRemove;
      case 'l8': return this.slotRemove;
      case 'r1': return this.slotPopForecast;
      case 'r2': return this.slotHumidity;
      case 'r3': return this.slotUvSummary;
      case 'r4': return this.slotFireSummary;
      case 'r5': return this.slotSunFollowing;
      case 'r6': return this.slotRemove;
      case 'r7': return this.slotRemove;
      case 'r8': return this.slotRemove;
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

  // No longer used - will be removed later
  // get slotPop(): TemplateResult {
  //   var intensity = this._config.entity_pop_intensity && !this._config.entity_pop_intensity_rate ?
  //     html`<span id="intensity-text"> - ${(Number(this.hass.states[this._config.entity_pop_intensity].state)).toLocaleString()}</span><span class="unit">${this.getUOM('precipitation')}</span>` :
  //     this._config.entity_pop_intensity_rate && !this._config.entity_pop_intensity ? html`<span id="intensity-text"> - ${(Number(this.hass.states[this._config.entity_pop_intensity_rate].state)).toLocaleString()}</span><span class="unit">${this.getUOM('intensity')}</span>` : ` ---`;
  //   return this._config.entity_pop ?
  //     html`<li><span class="ha-icon"><ha-icon icon="mdi:weather-rainy"></ha-icon></span><span id="pop-text">${this.hass.states[this._config.entity_pop] !== undefined ?
  //     Math.round(Number(this.hass.states[this._config.entity_pop].state)) : "---"}</span><span class="unit">%</span><span>${intensity}</span></li>` : html``;
  // }

  get slotPopForecast(): TemplateResult {
    const pop = this._config.entity_pop ? Math.round(Number(this.hass.states[this._config.entity_pop].state)) : "---";
    const pop_units = pop !== "---" ? html`<div class="slot-text unit">%</div>` : html``;
    const pos = this._config.entity_possible_today ? this.hass.states[this._config.entity_possible_today].state : "---";
    const pos_units = pos !== "---" ? html`<div class="slot-text unit">${this.getUOM('precipitation')}</div>` : html``;
    return html`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:weather-rainy"></ha-icon>
          </div>
          <div class="slot-text pop-text">${pop}</div>${pop_units}<div class="slot-text">&nbsp;-&nbsp;</div>
          <div class="slot-text pop-text-today">${pos}</div>${pos_units}
        </div>
      </li>
    `;
  }

  get slotPop(): TemplateResult {
    const pop = this._config.entity_pop ? Math.round(Number(this.hass.states[this._config.entity_pop].state)) : "---";
    const pop_units = pop !== "---" ? html`<div class="slot-text unit">%</div>` : html``;
    return html`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:weather-rainy"></ha-icon>
          </div>
          <div class="slot-text pop-text">${pop}</div>${pop_units}<div class="slot-text"></div>
        </div>
      </li>
    `;
  }

  get slotPossibleToday(): TemplateResult {
    const pos = this._config.entity_possible_today ? this.hass.states[this._config.entity_possible_today].state : "---";
    const units = pos !== "---" ? html`<div class="slot-text unit">${this.getUOM('precipitation')}</div>` : html``;
    return html`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:weather-rainy"></ha-icon>
          </div>${this.localeTextPosToday}&nbsp;<div class="slot-text possible_today-text">${pos}</div>${units}
        </div>
      </li>
    `;
  }

  get slotPossibleTomorrow(): TemplateResult {
    const pos = this._config.entity_possible_tomorrow ? this.hass.states[this._config.entity_possible_tomorrow].state : "---";
    const units = pos !== "---" ? html`<div class="slot-text unit">${this.getUOM('precipitation')}</div>` : html``;
    return html`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:weather-rainy"></ha-icon>
          </div>${this.localeTextPosTomorrow}&nbsp;<div class="slot-text possible_tomorrow-text">${pos}</div>${units}
        </div>
      </li>
    `;
  }

  get slotRainfall(): TemplateResult {
    const rainfall = this.currentRainfall;
    const units = rainfall !== "---" ? html`<div class="slot-text unit"></span>${this.getUOM('precipitation')}</div>` : html``;
    return html`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:weather-rainy"></ha-icon>
          </div>
          <div class="slot-text rainfall-text">${rainfall}</div>${units}
        </div>
      </li>
    `;
  }

  get slotHumidity(): TemplateResult {
    const humidity = this.currentHumidity;
    const units = humidity !== '---' ? html`<div class="slot-text unit">%</div>` : html``;
    return html`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:water-percent"></ha-icon>
          </div>
          <div class="slot-text humidity-text">${humidity}</div>${units}
        </div>
      </li>`;
  }

  get slotPressure(): TemplateResult {
    const pressure = this.currentPressure;
    const units = pressure !== "---" ? html`<div class="slot-text unit">${this._config.pressure_units ? this._config.pressure_units : this.getUOM('air_pressure')}</div>` : html``;
    return html`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:gauge"></ha-icon>
          </div>
          <div class="slot-text pressure-text">${this.currentPressure}</div>${units}
        </div>
      </li>
    `;
  }

  get slotObservedMax(): TemplateResult {
    const digits = this._config.option_today_decimals === true ? 1 : 0;
    const temp = this._config.entity_observed_max ? (Number(this.hass.states[this._config.entity_observed_max].state)).toLocaleString(this.locale, { minimumFractionDigits: digits, maximumFractionDigits: digits }) : "---";
    const units = temp !== "---" ? html`<div class="unitc">${this.getUOM('temperature')}</div>` : html``;
    return html`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:thermometer-high"></ha-icon>
          </div>
          <div class="slot-text">${this.localeTextObservedMax}&nbsp;</div>
          <div class="slot-text observed-max-text">${temp}</div>${units}
        </div>
      </li>
    `;
  }

  get slotObservedMin(): TemplateResult {
    const digits = this._config.option_today_decimals === true ? 1 : 0;
    const temp = this._config.entity_observed_min ? (Number(this.hass.states[this._config.entity_observed_min].state)).toLocaleString(this.locale, { minimumFractionDigits: digits, maximumFractionDigits: digits }) : "---";
    const units = temp !== "---" ? html`<div class="unitc">${this.getUOM('temperature')}</div>` : html``;
    return html`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:thermometer-low"></ha-icon>
          </div>
          <div class="slot-text">${this.localeTextObservedMin}&nbsp;</div>
          <div class="slot-text observed-min-text">${temp}</div>${units}
        </div>
      </li>
    `;
  }

  get slotForecastMax(): TemplateResult {
    const digits = this._config.option_today_decimals === true ? 1 : 0;
    const temp = this._config.entity_forecast_max ? (Number(this.hass.states[this._config.entity_forecast_max].state)).toLocaleString(this.locale, { minimumFractionDigits: digits, maximumFractionDigits: digits }) : "---";
    const units = temp !== "---" ? html`<div class="unitc">${this.getUOM('temperature')}</div>` : html``;
    return html`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:thermometer-high"></ha-icon>
          </div>
          <div class="slot-text">${this.localeTextForecastMax}&nbsp;</div>
          <div class="slot-text forecast-max-text">${temp}</div>${units}
        </div>
      </li>
    `;
  }

  get slotForecastMin(): TemplateResult {
    const digits = this._config.option_today_decimals === true ? 1 : 0;
    const temp = this._config.entity_forecast_min ? (Number(this.hass.states[this._config.entity_forecast_min].state)).toLocaleString(this.locale, { minimumFractionDigits: digits, maximumFractionDigits: digits }) : "---";
    const units = temp !== "---" ? html`<div class="unitc">${this.getUOM('temperature')}</div>` : html``;
    return html`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:thermometer-low"></ha-icon>
          </div>
          <div class="slot-text">${this.localeTextForecastMin}&nbsp;</div>
          <div class="slot-text forecast-min-text">${temp}</div>${units}
        </div>
      </li>
    `;
  }

  get slotTempNext(): TemplateResult {
    const digits = this._config.option_today_decimals === true ? 1 : 0;
    const icon = this._config.entity_temp_next_label ? this.hass.states[this._config.entity_temp_next_label].state.includes("Min") ? "mdi:thermometer-low" : "mdi:thermometer-high" : "mdi:help-box";
    const temp = this._config.entity_temp_next ? (Number(this.hass.states[this._config.entity_temp_next].state)).toLocaleString(this.locale, { minimumFractionDigits: digits, maximumFractionDigits: digits }) : "---";
    const label = this._config.entity_temp_next_label ? this.hass.states[this._config.entity_temp_next_label].state : "";
    const units = temp !== "---" ? html`<div class="slot-text unitc">${this.getUOM('temperature')}</div>` : html``;
    return html`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="${icon}"></ha-icon>
          </div>
          <div class="slot-text temp-next-text">${label} ${temp}</div>
          ${units}
        </div>
      </li>
    `;
  }

  get slotTempFollowing(): TemplateResult {
    const digits = this._config.option_today_decimals === true ? 1 : 0;
    const icon = this._config.entity_temp_following_label ? this.hass.states[this._config.entity_temp_following_label].state.includes("Min") ? "mdi:thermometer-low" : "mdi:thermometer-high" : "mdi:help-box";
    const temp = this._config.entity_temp_following ? (Number(this.hass.states[this._config.entity_temp_following].state)).toLocaleString(this.locale, { minimumFractionDigits: digits, maximumFractionDigits: digits }) : "---";
    const label = this._config.entity_temp_following_label ? this.hass.states[this._config.entity_temp_following_label].state : "";
    const units = temp !== "---" ? html`<div class="slot-text unitc">${this.getUOM('temperature')}</div>` : html``;
    return html`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="${icon}"></ha-icon>
          </div>
          <div class="slot-text temp-following-text">${label} ${temp}</div>
          ${units}
        </div>
      </li>
    `;
  }

  get slotTempMaximums(): TemplateResult {
    const digits = this._config.option_today_decimals === true ? 1 : 0;
    const temp_obs = this._config.entity_observed_max ? (Number(this.hass.states[this._config.entity_observed_max].state)).toLocaleString(this.locale, { minimumFractionDigits: digits, maximumFractionDigits: digits }) : "---";
    const temp_for = this._config.entity_forecast_max ? (Number(this.hass.states[this._config.entity_forecast_max].state)).toLocaleString(this.locale, { minimumFractionDigits: digits, maximumFractionDigits: digits }) : "---";
    const units = temp_obs !== "---" ? html`<div class="unitc">${this.getUOM('temperature')}</div>` : html``;
    return html`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:thermometer-high"></ha-icon>
          </div>
          <div class="slot-text">${this.localeTextObsMax}&nbsp;</div>
          <div class="slot-text observed-max-text">${temp_obs}</div>${units}
          <div class="slot-text">&nbsp;(${this.localeTextFore}&nbsp;</div>
          <div class="slot-text forecast-max-text">${temp_for}</div>${units}
          <div class="slot-text">)</div>
        </div>
      </li>
    `;
  }

  get slotTempMinimums(): TemplateResult {
    const digits = this._config.option_today_decimals === true ? 1 : 0;
    const temp_obs = this._config.entity_observed_min ? (Number(this.hass.states[this._config.entity_observed_min].state)).toLocaleString(this.locale, { minimumFractionDigits: digits, maximumFractionDigits: digits }) : "---";
    const temp_for = this._config.entity_forecast_min ? (Number(this.hass.states[this._config.entity_forecast_min].state)).toLocaleString(this.locale, { minimumFractionDigits: digits, maximumFractionDigits: digits }) : "---";
    const units = temp_obs !== "---" ? html`<div class="unitc">${this.getUOM('temperature')}</div>` : html``;
    return html`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:thermometer-low"></ha-icon>
          </div>
          <div class="slot-text">${this.localeTextObsMin}&nbsp;</div>
          <div class="slot-text observed-min-text">${temp_obs}</div>${units}
          <div class="slot-text">&nbsp;(${this.localeTextFore}&nbsp;</div>
          <div class="slot-text forecast-min-text">${temp_for}</div>${units}
          <div class="slot-text">)</div>
        </div>
      </li>
    `;
  }

  get slotUvSummary(): TemplateResult {
    const uv = this._config.entity_uv_alert_summary ? this.hass.states[this._config.entity_uv_alert_summary].state !== "unknown" ? this.hass.states[this._config.entity_uv_alert_summary].state : "n/a" : "---";
    return html`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:weather-sunny"></ha-icon>
          </div>
          <div class="slot-text daytime-uv-text">${this.localeTextUVRating} ${uv}</div>
        </div>
      </li>
    `;
  }

  get slotFireSummary(): TemplateResult {
    const fire = this._config.entity_fire_danger_summary ? this.hass.states[this._config.entity_fire_danger_summary].state !== 'unknown' ? this.hass.states[this._config.entity_fire_danger_summary].state : "n/a" : "---";
    return html`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:fire"></ha-icon>
          </div>
          <div class="slot-text fire-danger-text">${this.localeTextFireDanger} ${fire}</div>
        </div>
      </li>`;
  }

  get slotWind(): TemplateResult {
    const beaufort = this._config.entity_wind_speed && this._config.option_show_beaufort ? html`<div class="slot-text"></div>BFT: ${this.currentBeaufort} -&nbsp;</div>` : "";
    const bearing = this._config.entity_wind_bearing ? html`<div class="slot-text">${this.currentWindBearing}&nbsp;</div>` : "";
    const units = html`<div class="slot-text unit">${this.getUOM('length')}/h</div>`;
    const speed = this._config.entity_wind_speed ? html`<div class="slot-text">${this.currentWindSpeed}</div>${units}&nbsp;` : "";
    const gust = this._config.entity_wind_gust ? html`<div class="slot-text">(Gust ${this.currentWindGust}</div>${units})` : "";
    return html`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:weather-windy"></ha-icon>
          </div>
          ${beaufort}${bearing}${speed}${gust}
        </div>
      </li>
    `;
  }

  get slotWindKt(): TemplateResult {
    const beaufort = this._config.entity_wind_speed_kt && this._config.option_show_beaufort ? html`<div class="slot-text"></div>BFT: ${this.currentBeaufortKt} -&nbsp;</div>` : "";
    const bearing = this._config.entity_wind_bearing ? html`<div class="slot-text">${this.currentWindBearing}&nbsp;</div>` : "";
    const units = html`<div class="slot-text unit">Kt</div>`;
    const speed = this._config.entity_wind_speed_kt ? html`<div class="slot-text">${this.currentWindSpeedKt}</div>${units}&nbsp;` : "";
    const gust = this._config.entity_wind_gust_kt ? html`<div class="slot-text">(Gust ${this.currentWindGustKt}</div>${units})` : "";
    return html`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:weather-windy"></ha-icon>
          </div>
          ${beaufort}${bearing}${speed}${gust}
        </div>
      </li>
    `;
  }

  get slotVisibility(): TemplateResult {
    const vis = this.currentVisibility;
    const units = vis !== "---" ? this.getUOM('length') : "";
    return html`
      <li>
        <div class="slot-icon">
          <ha-icon icon="mdi:weather-fog"></ha-icon>
        </div>
        <div class="slot-text visibility-text">${vis}</div>
        <div class="slot-text unit"> ${units}
        </div>
      </li>
    `;
  }

  get slotSunNext(): TemplateResult {
    return this._config.entity_sun ? this.sunSet.next : html``;
  }

  get slotSunFollowing(): TemplateResult {
    return this._config.entity_sun ? this.sunSet.following : html``;
  }

  get slotCustom1(): TemplateResult {
    var icon = this._config.custom1_icon ? this._config.custom1_icon : 'mdi:help-box';
    var value = this._config.custom1_value ? this.hass.states[this._config.custom1_value].state : 'unknown';
    var unit = this._config.custom1_units ? this._config.custom1_units : '';
    return html`
      <li>
        <div class="slot-icon">
          <ha-icon icon=${icon}></ha-icon>
        </div>
        <div class="slot-text custom-1-text">${value}</div><div class="slot-text unit">${unit}</div>
      </li>
    `;
  }

  get slotCustom2(): TemplateResult {
    var icon = this._config.custom2_icon ? this._config.custom2_icon : 'mdi:help-box';
    var value = this._config.custom2_value ? this.hass.states[this._config.custom2_value].state : 'unknown';
    var unit = this._config.custom2_units ? this._config.custom2_units : '';
    return html`
      <li>
        <div class="slot-icon">
          <ha-icon icon=${icon}></ha-icon>
        </div>
        <div class="slot-text custom-2-text">${value}</div><div class="slot-text unit">${unit}</div>
      </li>
    `;
  }

  get slotCustom3(): TemplateResult {
    var icon = this._config.custom3_icon ? this._config.custom3_icon : 'mdi:help-box';
    var value = this._config.custom3_value ? this.hass.states[this._config.custom3_value].state : 'unknown';
    var unit = this._config.custom3_units ? this._config.custom3_units : '';
    return html`
      <li>
        <div class="slot-icon">
          <ha-icon icon=${icon}></ha-icon>
        </div>
        <div class="slot-text custom-3-text">${value}</div><div class="slot-text unit">${unit}</div>
      </li>
    `;
  }

  get slotCustom4(): TemplateResult {
    var icon = this._config.custom4_icon ? this._config.custom4_icon : 'mdi:help-box';
    var value = this._config.custom4_value ? this.hass.states[this._config.custom4_value].state : 'unknown';
    var unit = this._config.custom4_units ? this._config.custom4_units : '';
    return html`
      <li>
        <div class="slot-icon">
          <ha-icon icon=${icon}></ha-icon>
        </div>
        <div class="slot-text custom-4-text">${value}</div><div class="slot-text unit">${unit}</div>
      </li>
    `;
  }

  // getters that return the value to be shown
  get currentConditions(): string {
    const entity = this._config.entity_current_conditions;
    return entity && this.hass.states[entity]
      ? this.hass.states[entity].state
      : '---';
  }

  get currentTemperature(): string {
    const entity = this._config.entity_temperature;
    return entity && this.hass.states[entity]
      ? this._config.show_decimals !== true
        ? String(Math.round(Number(this.hass.states[entity].state)))
        : Number(this.hass.states[entity].state).toLocaleString(this.locale)
      : '---';
  }

  get currentApparentTemperature(): string {
    const entity = this._config.entity_apparent_temp;
    return entity && this.hass.states[entity]
      ? this._config.show_decimals !== true
        ? String(Math.round(Number(this.hass.states[entity].state)))
        : Number(this.hass.states[entity].state).toLocaleString(this.locale)
      : '---';
  }

  get currentHumidity(): string {
    const entity = this._config.entity_humidity;
    return entity && this.hass.states[entity]
      ? (Number(this.hass.states[entity].state)).toLocaleString(this.locale) : '---';
  }

  get currentRainfall(): string {
    const entity = this._config.entity_rainfall;
    return entity && this.hass.states[entity]
      ? (Number(this.hass.states[entity].state)).toLocaleString(this.locale) : '---';
  }

  get currentPressure(): string {
    const entity = this._config.entity_pressure;
    var places = this._config.option_pressure_decimals ? Math.max(Math.min(this._config.option_pressure_decimals, 3), 0) : 0;
    return entity && this.hass.states[entity]
      ? (Number(this.hass.states[entity].state)).toLocaleString(this.locale, { minimumFractionDigits: places, maximumFractionDigits: places }) : '---';
  }

  get currentVisibility(): string {
    const entity = this._config.entity_visibility;
    return entity && this.hass.states[entity]
      ? (Number(this.hass.states[entity].state)).toLocaleString(this.locale) : '---';
  }

  get currentWindBearing(): string {
    const entity = this._config.entity_wind_bearing;
    return entity && this.hass.states[entity]
      ? isNaN(Number(this.hass.states[entity].state)) ? this.hass.states[entity].state : this.windDirections[(Math.round((Number(this.hass.states[entity].state) / 360) * 16))] : '---';
  }

  get currentWindSpeed(): string {
    const entity = this._config.entity_wind_speed;
    return entity && this.hass.states[entity]
      ? Math.round(Number(this.hass.states[entity].state)).toLocaleString(this.locale) : '---';
  }

  get currentWindGust(): string {
    const entity = this._config.entity_wind_gust;
    return entity && this.hass.states[entity]
      ? Math.round(Number(this.hass.states[entity].state)).toLocaleString(this.locale) : '---';
  }

  get currentWindSpeedKt(): string {
    const entity = this._config.entity_wind_speed_kt;
    return entity && this.hass.states[entity]
      ? Math.round(Number(this.hass.states[entity].state)).toLocaleString(this.locale) : '---';
  }

  get currentWindGustKt(): string {
    const entity = this._config.entity_wind_gust_kt;
    return entity && this.hass.states[entity]
      ? Math.round(Number(this.hass.states[entity].state)).toLocaleString(this.locale) : '---';
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

    switch (this.locale) {
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
  get currentBeaufort(): string {
    const entity = this._config.entity_wind_speed;
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

  get currentBeaufortKt(): string {
    const entity = this._config.entity_wind_speed_kt;
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
    switch (this.timeFormat) {
      case '12hour':
        nextSunSet = this._config.entity_sun ? new Date(this.hass.states[this._config.entity_sun].attributes.next_setting).toLocaleTimeString(this.locale, { hour: 'numeric', minute: '2-digit', hour12: true }).replace(" am", "am").replace(" pm", "pm") : "";
        nextSunRise = this._config.entity_sun ? new Date(this.hass.states[this._config.entity_sun].attributes.next_rising).toLocaleTimeString(this.locale, { hour: 'numeric', minute: '2-digit', hour12: true }).replace(" am", "am").replace(" pm", "pm") : "";
        break;
      case '24hour':
        nextSunSet = this._config.entity_sun ? new Date(this.hass.states[this._config.entity_sun].attributes.next_setting).toLocaleTimeString(this.locale, { hour: '2-digit', minute: '2-digit', hour12: false }) : "";
        nextSunRise = this._config.entity_sun ? new Date(this.hass.states[this._config.entity_sun].attributes.next_rising).toLocaleTimeString(this.locale, { hour: '2-digit', minute: '2-digit', hour12: false }) : "";
        break;
      case 'system':
        nextSunSet = this._config.entity_sun ? new Date(this.hass.states[this._config.entity_sun].attributes.next_setting).toLocaleTimeString(navigator.language, { timeStyle: 'short' }).replace(" am", "am").replace(" pm", "pm") : "";
        nextSunRise = this._config.entity_sun ? new Date(this.hass.states[this._config.entity_sun].attributes.next_rising).toLocaleTimeString(navigator.language, { timeStyle: 'short' }).replace(" am", "am").replace(" pm", "pm") : "";
        break;
    }
    var nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 1);
    if (this._config.entity_sun) {
      if (this.hass.states[this._config.entity_sun].state == "above_horizon") {
        nextSunRise = nextDate.toLocaleDateString(this.locale, { weekday: 'short' }) + " " + nextSunRise;
        return {
          'next': html`
            <li>
              <div class="slot-icon">
                <ha-icon id="sun-next-icon" icon="mdi:weather-sunset-down"></ha-icon>
              </div>
              <div class="slot-text sun-next-text">${nextSunSet}</div>
            </li>`,
          'following': html`
            <li>
              <div class="slot-icon">
                <ha-icon id="sun-following-icon" icon="mdi:weather-sunset-up"></ha-icon>
              </div>
              <div class="slot-text sun-following-text">${nextSunRise}</div>
            </li>`,
          'nextText': nextSunSet,
          'followingText': nextSunRise,
          'nextIcon': "mdi:weather-sunset-down",
          'followingIcon': "mdi:weather-sunset-up",
        };
      } else {
        if (new Date().getDate() != new Date(this.hass.states[this._config.entity_sun].attributes.next_rising).getDate()) {
          nextSunRise = nextDate.toLocaleDateString(this.locale, { weekday: 'short' }) + " " + nextSunRise;
          nextSunSet = nextDate.toLocaleDateString(this.locale, { weekday: 'short' }) + " " + nextSunSet;
        }
        return {
          'next': html`
            <li>
              <div class="slot-icon">
                <ha-icon id="sun-next-icon" icon="mdi:weather-sunset-up"></ha-icon>
              </div>
              <div class="slot-text sun-next-text">${nextSunRise}</div>
            </li>`,
          'following': html`
            <li>
              <div class="slot-icon">
                <ha-icon id="sun-following-icon" icon="mdi:weather-sunset-down"></ha-icon>
              </div>
              <div class="slot-text sun-following-text">${nextSunSet}</div>
            </li>`,
          'nextText': nextSunRise,
          'followingText': nextSunSet,
          'nextIcon': "mdi:weather-sunset-up",
          'followingIcon': "mdi:weather-sunset-down",
        };
      }
    } else {
      return {
        'next': html``,
        'following': html``,
        nextText: "",
        followingText: "",
        nextIcon: "",
        followingIcon: ""
      }
    }
  }

  // is12Hour - returns true if 12 hour clock or false if 24
  get timeFormat(): timeFormat {
    return this._config.option_time_format ? this._config.option_time_format : 'system';
  }

  // get the icon that matches the current conditions
  private _weatherIcon(conditions: string): string {
    switch (conditions) {
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
    return this._config.entity_sun && this.hass.states[this._config.entity_sun] !== undefined ? transformDayNight[this.hass.states[this._config.entity_sun].state] : 'day';
  }

  get iconStyle(): string {
    return (this._config.option_icon_set) ? this._config.option_icon_set : 'old';
  }

  get iconSunny(): string {
    const iconStyle = this.iconStyle;
    return (iconStyle === 'old') ? `${this.dayOrNight}` : (iconStyle === 'hybrid') ? `sunny-${this.dayOrNight}` : `sunny-${this.dayOrNight}`;
  }

  get iconClear(): string {
    const iconStyle = this.iconStyle;
    return (iconStyle === 'old') ? `${this.dayOrNight}` : (iconStyle === 'hybrid') ? `sunny-${this.dayOrNight}` : `clear-${this.dayOrNight}`;
  }

  get iconMostlySunny(): string {
    const iconStyle = this.iconStyle;
    return (iconStyle === 'old') ? `fair-${this.dayOrNight}` : (iconStyle === 'hybrid') ? `fair-${this.dayOrNight}` : `fair-${this.dayOrNight}`;
  }

  get iconPartlyCloudy(): string {
    const iconStyle = this.iconStyle;
    return (iconStyle === 'old') ? `cloudy-${this.dayOrNight}-3` : (iconStyle === 'hybrid') ? `cloudy-${this.dayOrNight}-3` : `partly-cloudy-${this.dayOrNight}`;
  }

  get iconCloudy(): string {
    const iconStyle = this.iconStyle;
    return (iconStyle === 'old') ? `cloudy-original` : (iconStyle === 'hybrid') ? `cloudy-original` : `cloudy`;
  }

  get iconHazy(): string {
    const iconStyle = this.iconStyle;
    return (iconStyle === 'old') ? `cloudy-${this.dayOrNight}-1` : (iconStyle === 'hybrid') ? `haze` : `haze`;
  }

  get iconFrost(): string {
    const iconStyle = this.iconStyle;
    return (iconStyle === 'old') ? `cloudy-${this.dayOrNight}-1` : (iconStyle === 'hybrid') ? `cloudy-${this.dayOrNight}-1` : `cloudy-${this.dayOrNight}-1`;
  }

  get iconLightRain(): string {
    const iconStyle = this.iconStyle;
    return (iconStyle === 'old') ? `rainy-1` : (iconStyle === 'hybrid') ? `rainy-1-${this.dayOrNight}` : `rainy-1-${this.dayOrNight}`;
  }

  get iconWindy(): string {
    const iconStyle = this.iconStyle;
    return (iconStyle === 'old') ? `cloudy-original` : (iconStyle === 'hybrid') ? `wind` : `wind`;
  }

  get iconFog(): string {
    const iconStyle = this.iconStyle;
    return (iconStyle === 'old') ? `cloudy-original` : (iconStyle === 'hybrid') ? `fog` : `fog`;
  }

  get iconShowers(): string {
    const iconStyle = this.iconStyle;
    return (iconStyle === 'old') ? `rainy-1` : (iconStyle === 'hybrid') ? `rainy-1-${this.dayOrNight}` : `rainy-1-${this.dayOrNight}`;
  }

  get iconRain(): string {
    const iconStyle = this.iconStyle;
    return (iconStyle === 'old') ? `rainy-5` : (iconStyle === 'hybrid') ? `rainy-5` : `rain`;
  }

  get iconDust(): string {
    const iconStyle = this.iconStyle;
    return (iconStyle === 'old') ? `cloudy-${this.dayOrNight}-1` : (iconStyle === 'hybrid') ? `haze` : `haze`;
  }

  get iconSnow(): string {
    const iconStyle = this.iconStyle;
    return (iconStyle === 'old') ? `snowy-6` : (iconStyle === 'hybrid') ? `snowy-6` : `snow`;
  }

  get iconSnowRain(): string {
    const iconStyle = this.iconStyle;
    return (iconStyle === 'old') ? `snowy-6` : (iconStyle === 'hybrid') ? `rain-and-snow-mix` : `rain-and-snow-mix`;
  }

  get iconStorm(): string {
    const iconStyle = this.iconStyle;
    return (iconStyle === 'old') ? `scattered-thunderstorms` : (iconStyle === 'hybrid') ? `scattered-thunderstorms` : `scattered-thunderstorms`;
  }

  get iconLightShowers(): string {
    const iconStyle = this.iconStyle;
    return (iconStyle === 'old') ? `rainy-2` : (iconStyle === 'hybrid') ? `rainy-2` : `rainy-2`;
  }

  get iconHeavyShowers(): string {
    const iconStyle = this.iconStyle;
    return (iconStyle === 'old') ? `rainy-6` : (iconStyle === 'hybrid') ? `rainy-6` : `rainy-6`;
  }


  get iconCyclone(): string {
    const iconStyle = this.iconStyle;
    return (iconStyle === 'old') ? `tornado` : (iconStyle === 'hybrid') ? `tornado` : `tornado`;
  }

  get iconClearDay(): string {
    const iconStyle = this.iconStyle;
    return (iconStyle === 'old') ? `day` : (iconStyle === 'hybrid') ? `day` : `clear-day`;
  }

  get iconClearNight(): string {
    const iconStyle = this.iconStyle;
    return (iconStyle === 'old') ? `night` : (iconStyle === 'hybrid') ? `night` : `clear-night`;
  }

  get iconSleet(): string {
    const iconStyle = this.iconStyle;
    return (iconStyle === 'old') ? `rainy-2` : (iconStyle === 'hybrid') ? `rain-and-sleet-mix` : `rain-and-sleet-mix`;
  }

  get iconPartlyCloudyDay(): string {
    const iconStyle = this.iconStyle;
    return (iconStyle === 'old') ? `cloudy-day-3` : (iconStyle === 'hybrid') ? `cloudy-day-3` : `partly-cloudy-day`;
  }

  get iconPartlyCloudyNight(): string {
    const iconStyle = this.iconStyle;
    return (iconStyle === 'old') ? `cloudy-night-3` : (iconStyle === 'hybrid') ? `cloudy-night-3` : `partly-cloudy-night`;
  }

  get iconHail(): string {
    const iconStyle = this.iconStyle;
    return (iconStyle === 'old') ? `rainy-7` : (iconStyle === 'hybrid') ? `rainy-7` : `rainy-7`;
  }

  get iconLightning(): string {
    const iconStyle = this.iconStyle;
    return (iconStyle === 'old') ? `thunder` : (iconStyle === 'hybrid') ? `thunder` : `thunder`;
  }

  get iconWindyVariant(): string {
    const iconStyle = this.iconStyle;
    return (iconStyle === 'old') ? `cloudy-${this.dayOrNight}-3` : (iconStyle === 'hybrid') ? `cloudy-${this.dayOrNight}-3` : `cloudy-${this.dayOrNight}-3`;
  }

  get locale(): string | undefined {
    try {
      Intl.NumberFormat(this._config.option_locale);
      return this._config.option_locale;
    } catch (e) {
      return undefined;
    }
  }

  get localeTextFeelsLike(): string {
    switch (this.locale) {
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

  get localeTextObservedMax(): string {
    switch (this.locale) {
      default: return "Observed Max";
    }
  }

  get localeTextObservedMin(): string {
    switch (this.locale) {
      default: return "Observed Min";
    }
  }

  get localeTextObsMax(): string {
    switch (this.locale) {
      default: return "Obs Max";
    }
  }

  get localeTextObsMin(): string {
    switch (this.locale) {
      default: return "Obs Min";
    }
  }

  get localeTextForecastMax(): string {
    switch (this.locale) {
      case 'it': return "Max oggi";
      case 'fr': return "Max aujourd'hui";
      case 'de': return "Max heute";
      case 'nl': return "Max vandaag";
      case 'pl': return "Najwyższa dziś";
      case 'he': return "מקסימלי היום";
      case 'da': return "Højeste i dag";
      case 'ru': return "Макс сегодня";
      case 'ua': return "Макс сьогодні";
      default: return "Forecast Max";
    }
  }

  get localeTextForecastMin(): string {
    switch (this.locale) {
      case 'it': return "Min oggi";
      case 'fr': return "Min aujourd'hui";
      case 'de': return "Min heute";
      case 'nl': return "Min vandaag";
      case 'pl': return "Najniższa dziś";
      case 'he': return "דקות היום";
      case 'da': return "Laveste i dag";
      case 'ru': return "мин сегодня";
      case 'ua': return "Мін сьогодні";
      default: return "Forecast Min";
    }
  }

  get localeTextPosToday(): string {
    switch (this.locale) {
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

  get localeTextPosTomorrow(): string {
    switch (this.locale) {
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

  get localeTextFore(): string {
    switch (this.locale) {
      case 'it': return "Prev";
      case 'fr': return "Prév";
      case 'de': return "Prog";
      case 'nl': return "Prog";
      case 'pl': return "Prog";
      case 'he': return "תַחֲזִית";
      case 'da': return "Prog";
      case 'ru': return "Прогноз";
      case 'ua': return "Прогноз";
      default: return "Fore";
    }
  }

  get localeTextUVRating(): string {
    switch (this.locale) {
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

  get localeTextFireDanger(): string {
    switch (this.locale) {
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
        return this._config.entity_pressure !== undefined && this.hass.states[this._config.entity_pressure].attributes.unit_of_measurement !== undefined ?
          this.hass.states[this._config.entity_pressure].attributes.unit_of_measurement as string :
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
      origConfig: this._config,
    });

    return html`${errorCard}`;
  }

  // https://lit.dev/docs/components/styles/
  get styles(): CSSResult {
    // Get config flags or set defaults if not configured
    const tooltipBGColor = this._config.tooltip_bg_color || "rgb( 75,155,239)";
    const tooltipFGColor = this._config.tooltip_fg_color || "#fff";
    const tooltipBorderColor = this._config.tooltip_border_color || "rgb(255,161,0)";
    const tooltipBorderWidth = this._config.tooltip_border_width || "1";
    const tooltipCaretSize = this._config.tooltip_caret_size || "5";
    const tooltipWidth = this._config.tooltip_width || "200";
    // const tooltipLeftOffset = this._config.tooltip_left_offset || "-12";
    const tooltipVisible = this._config.option_tooltips ? "visible" : "hidden";
    // const tempTopMargin = this._config.temp_top_margin || "0px";
    const tempFontWeight = this._config.temp_font_weight || "300";
    const tempFontSize = this._config.temp_font_size || "4em";
    // const tempRightPos = this._config.temp_right_pos || "0.85em";
    // const tempUOMTopMargin = this._config.temp_uom_top_margin || "-12px";
    // const tempUOMRightMargin = this._config.temp_uom_right_margin || "4px";
    // var apparentTopMargin = this._config.apparent_top_margin || "45px";
    // var apparentRightPos =  this._config.apparent_right_pos || "1em";
    // var apparentRightMargin = this._config.apparent_right_margin || "1em";
    // var currentTextTopMargin = this._config.current_text_top_margin || "4.5em";
    // var currentTextLeftPos = this._config.current_text_left_pos || "0px";
    const currentTextFontSize = this._config.current_text_font_size || "1.5em";
    // var currentTextWidth = this._config.current_text_width || "100%";
    const currentTextAlignment = this._config.current_text_alignment || "center";
    // var largeIconTopMargin = this._config.large_icon_top_margin || "-3.2em";
    // var largeIconLeftPos = this._config.large_icon_left_pos || "0px";
    // var currentDataTopMargin = this._config.current_data_top_margin ? this._config.current_data_top_margin : this._config.show_separator ? "1em" : "10em"; //TODO - check if really needed, was using in variations
    // var separatorTopMargin = this._config.separator_top_margin || "6em";
    // var summaryTopPadding = this._config.summary_top_padding || "2em";
    // var summaryFontSize = this._config.summary_font_size || "0.8em";

    return css`
      .card {
        padding: 8px 16px 8px 16px;
      }
      .content {
        align-items: center;
      }
      .card-header {
        font-size: 1.5em;
        color: var(--primary-text-color);
      }
      .section {
        margin: -1px;
        border: 1px solid transparent;
        padding-top: 8px;
        padding-bottom: 8px;
      }
      .extended-section {
        padding-left: 8px;
        padding-right: 8px;
      }
      .updated {
        font-size: 0.9em;
        font-weight: 300;
        color: var(--primary-text-color);
      }
      .overview-top {
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
        height: 140px;
        width: 140px;
        position: relative;
        left: -8px;
        top: -20px;
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
        margin-top : 7px;
        margin-bottom: -9px;
        color: var(--primary-text-color);
      }
      .current-text {
        font-size: ${unsafeCSS(currentTextFontSize)};
        overflow: hidden;
        white-space: nowrap;
        text-align: ${unsafeCSS(currentTextAlignment)};
        line-height: 1.2em;
        padding-top: 8px;
      }
      .variations {
        display: flex;
        flex-flow: row wrap;
        font-weight: 300;
        color: var(--primary-text-color);
        list-style: none;
        margin-block-start: 0px;
        margin-block-end: 0px;
        padding-inline-start: 8px;
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
        margin-block-start: 0px;
        margin-block-end: 0px;
        padding-inline-start: 8px;
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
      .daily-forecast-horiz-section {
        display: flex;
        flex-flow: row wrap;
        width: 100%;
        margin: 0 auto;
        clear: both;
      }
      .daily-forecast-horiz-section .day-horiz:nth-last-child(1) {
        border-right: none;
      }
      .day-horiz {
        flex: 1;
        float: left;
        text-align: center;
        color: var(--primary-text-color);
        border-right: .1em solid #d9d9d9;
        line-height: 1.5;
        box-sizing: border-box;
      }
      .daily-forecast-vert-section {
        display: flex;
        flex-flow: column nowrap;
        margin: 0 auto;
        clear: both;
      }
      .day-vert {
        flex: 1;
        color: var(--primary-text-color);
        border-top: .1em solid #d9d9d9;
        line-height: 1.5;
        box-sizing: border-box;
        padding-left: 8px;
        padding-right: 8px;
        padding-bottom: 8px;
      }
      .day-vert-top {
        float: left;
      }
      .day-vert-dayicon {
        text-align: left;
        float: left;
        margin-bottom: -8px;
      }
      .day-vert-values {
        text-align: left;
        float: left;
        padding-left: 1em;
        margin-top: 1.5em;
      }
      .day-vert-bottom {
        text-align: left;
        float: left;
      }
      .dayname {
        text-transform: uppercase;
      }
      .icon {
        width: 50px;
        height: 50px;
        margin: auto;
        display: inline-block;
        background-size: contain;
        background-position: center center;
        background-repeat: no-repeat;
        text-indent: -9999px;
      }
      .f-slot {
        display: inline-table;
        height: 24px;
        font-weight: 300;
      }
      .f-extended {
        display: inline-table;
        font-size: 13px;
        font-weight: 300;
        padding-top: 8px;
      }
      .extended-section .f-extended {
        padding-top: 0;
      }
      .highTemp {
        display: table-cell;
        font-weight: bold;
      }
      .lowTemp {
        display: table-cell;
        font-weight: 300;
      }
      .slash {
        padding-left: 2px;
        padding-right: 2px;
      }
      .high-temp {
        display: table-cell;
        font-weight: bold;
        width: 1.5em;
        text-align: right;
      }
      .low-temp {
        display: table-cell;
        font-weight: 300;
        width: 1.5em;
        text-align: right;
      }
      .temp-label {
        width: 2em;
        font-weight: 300;
        padding-left: 0.5em;
      }
      .f-slot .temp-label:first-of-type {
        padding-left: 0;
      }
      .f-label {
        padding-right: 0.5em;
      }
      .pop {
        display: table-cell;
        font-weight: 300;
        color: var(--primary-text-color);
      }
      .pos {
        display: table-cell;
        font-weight: 300;
        color: var(--primary-text-color);
      }
      .fcasttooltip {
        position: relative;
        display: inline-block;
      }
      .fcasttooltip .fcasttooltiptext {
        visibility: hidden;
        width: ${unsafeCSS(tooltipWidth)}px;
        background-color: ${unsafeCSS(tooltipBGColor)};
        color: ${unsafeCSS(tooltipFGColor)};
        text-align: center;
        border-radius: 6px;
        border-style: solid;
        border-color: ${unsafeCSS(tooltipBorderColor)};
        border-width: ${unsafeCSS(tooltipBorderWidth)}px;
        padding: 5px 0;
        /* Position the tooltip */
        position: absolute;
        z-index: 1;
        bottom: 100%;
        left: 50%;
        -webkit-transform: translateX(-50%); /* Safari iOS */
        transform: translateX(-50%);
      }
      .fcasttooltip .fcasttooltiptext:after {
        content: "";
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -${unsafeCSS(tooltipCaretSize)}px;
        border-width: ${unsafeCSS(tooltipCaretSize)}px;
        border-style: solid;
        border-color: ${unsafeCSS(tooltipBorderColor)} transparent transparent transparent;
      }
      .fcasttooltip:hover .fcasttooltiptext {
        visibility: ${unsafeCSS(tooltipVisible)};
      }
      /* .section:hover {
        border: 1px solid red;
      } */
    `;
  }
}
