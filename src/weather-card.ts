/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { LitElement, html, TemplateResult, css, PropertyValues, CSSResult, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators';
import {
  HomeAssistant,
  hasConfigOrEntityChanged,
  hasAction,
  ActionHandlerEvent,
  handleAction,
  LovelaceCardEditor,
  getLovelace,
} from 'custom-card-helpers'; // This is a community maintained npm module with common helper functions/types. https://github.com/custom-cards/custom-card-helpers

import type { WeatherCardConfig } from './types';
import { actionHandler } from './action-handler-directive';
import { CARD_VERSION } from './const';
import { localize } from './localize/localize';

/* eslint no-console: 0 */
console.info(
  `%c  WEATHER-CARD \n%c  ${localize('common.version')} ${CARD_VERSION}    `,
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

    const oldHass = changedProps.get("hass");

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
      if (
        oldHass.states[entity] !== this.hass.states[entity]
      ) {
        console.info(`update: %s=%s`, entity, this.hass.states[entity].state);
        return true;
      }
    }

    return hasConfigOrEntityChanged(this, changedProps, false);
  }

  // https://lit.dev/docs/components/rendering/
  protected render(): TemplateResult | void {
    console.info(`Weather: render`);
    // TODO Check for stateObj or other necessary things and render a warning if missing
    if (this.config.show_warning) {
      return this._showWarning(localize('common.show_warning'));
    }

    if (this.config.show_error) {
      return this._showError(localize('common.show_error'));
    }

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
        <div class="apparent">Feels like <span id="apparent-temp-text">${this.apparentTemperature}</span></div>
        <div class="apparentc"> ${this.getUOM('temperature')}</div>
      </div>
    `;

    const currentText = this.hass.states[this.config.entity_current_text].state ?? '---';

    return html`
      <style>
        ${this.styles}
      </style>
      <ha-card class="card"
        @action=${this._handleAction}
        .actionHandler=${actionHandler({
      hasHold: hasAction(this.config.hold_action),
      hasDoubleClick: hasAction(this.config.double_tap_action),
    })}
        tabindex="0"
        .label=${`Weather: ${this.config.entity || 'No Entity Defined'}`}
      >
        <div class="content">
          <div class="top-row">
            <div class="top-left">${biggerIcon}</div>
            <div class="currentTemps">${currentTemp}${apparentTemp}</div>
          </div>
          <div class="current-text">${currentText}</div>
        </div>
    </ha-card>
    `;
  }

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

  get apparentTemperature(): string {
    const entity = this.config.entity_apparent_temp;
    return entity && this.hass.states[entity]
      ? this.config.show_decimals !== true
        ? String(Math.round(Number(this.hass.states[entity].state)))
        : this.hass.states[entity].state
      : '---';
  }

  get weatherIcon(): string {
    const iconStyle = (this.config.old_icon === "hybrid") ? `hybrid` : (this.config.old_icon === "false") ? `false` : `true`;
    const sunny_icon = (iconStyle === "true") ? `${this.dayOrNight}` : (iconStyle === "hybrid") ? `sunny-${this.dayOrNight}` : `sunny-${this.dayOrNight}`;
    const clear_icon = (iconStyle === "true") ? `${this.dayOrNight}` : (iconStyle === "hybrid") ? `sunny-${this.dayOrNight}` : `clear-${this.dayOrNight}`;
    const mostly_sunny_icon = (iconStyle === "true") ? `fair-${this.dayOrNight}` : (iconStyle === "hybrid") ? `fair-${this.dayOrNight}` : `fair-${this.dayOrNight}`;
    const partly_cloudy_icon = (iconStyle === "true") ? `cloudy-${this.dayOrNight}-3` : (iconStyle === "hybrid") ? `cloudy-${this.dayOrNight}-3` : `partly-cloudy-${this.dayOrNight}`;
    const cloudy_icon = (iconStyle === "true") ? `cloudy-original` : (iconStyle === "hybrid") ? `cloudy-original` : `cloudy`;
    const hazy_icon = (iconStyle === "true") ? `cloudy-${this.dayOrNight}-1` : (iconStyle === "hybrid") ? `haze` : `haze`;
    const frost_icon = (iconStyle === "true") ? `cloudy-${this.dayOrNight}-1` : (iconStyle === "hybrid") ? `cloudy-${this.dayOrNight}-1` : `cloudy-${this.dayOrNight}-1`;
    const light_rain_icon = (iconStyle === "true") ? `rainy-1` : (iconStyle === "hybrid") ? `rainy-1-${this.dayOrNight}` : `rainy-1-${this.dayOrNight}`;
    const windy_icon = (iconStyle === "true") ? `cloudy-original` : (iconStyle === "hybrid") ? `wind` : `wind`;
    const fog_icon = (iconStyle === "true") ? `cloudy-original` : (iconStyle === "hybrid") ? `fog` : `fog`;
    const showers_icon = (iconStyle === "true") ? `rainy-1` : (iconStyle === "hybrid") ? `rainy-1-${this.dayOrNight}` : `rainy-1-${this.dayOrNight}`;
    const rain_icon = (iconStyle === "true") ? `rainy-5` : (iconStyle === "hybrid") ? `rainy-5` : `rain`;
    const dust_icon = (iconStyle === "true") ? `cloudy-${this.dayOrNight}-1` : (iconStyle === "hybrid") ? `haze` : `haze`;
    const snow_icon = (iconStyle === "true") ? `snowy-6` : (iconStyle === "hybrid") ? `snowy-6` : `snow`;
    const snow_rain_icon = (iconStyle === "true") ? `snowy-6` : (iconStyle === "hybrid") ? `rain-and-snow-mix` : `rain-and-snow-mix`;
    const storm_icon = (iconStyle === "true") ? `scattered-thunderstorms` : (iconStyle === "hybrid") ? `scattered-thunderstorms` : `scattered-thunderstorms`;
    const light_showers_icon = (iconStyle === "true") ? `rainy-2` : (iconStyle === "hybrid") ? `rainy-2` : `rainy-2`;
    const heavy_showers_icon = (iconStyle === "true") ? `rainy-6` : (iconStyle === "hybrid") ? `rainy-6` : `rainy-6`;
    const cyclone_icon = (iconStyle === "true") ? `tornado` : (iconStyle === "hybrid") ? `tornado` : `tornado`;
    const clear_day_icon = (iconStyle === "true") ? `day` : (iconStyle === "hybrid") ? `day` : `clear-day`;
    const clear_night_icon = (iconStyle === "true") ? `night` : (iconStyle === "hybrid") ? `night` : `clear-night`;
    const sleet_icon = (iconStyle === "true") ? `rainy-2` : (iconStyle === "hybrid") ? `rain-and-sleet-mix` : `rain-and-sleet-mix`;
    const partly_cloudy_day_icon = (iconStyle === "true") ? `cloudy-day-3` : (iconStyle === "hybrid") ? `cloudy-day-3` : `partly-cloudy-day`;
    const partly_cloudy_night_icon = (iconStyle === "true") ? `cloudy-night-3` : (iconStyle === "hybrid") ? `cloudy-night-3` : `partly-cloudy-night`;
    const hail_icon = (iconStyle === "true") ? `rainy-7` : (iconStyle === "hybrid") ? `rainy-7` : `rainy-7`;
    const lightning_icon = (iconStyle === "true") ? `thunder` : (iconStyle === "hybrid") ? `thunder` : `thunder`;
    const windy_variant_icon = (iconStyle === "true") ? `cloudy-${this.dayOrNight}-3` : (iconStyle === "hybrid") ? `cloudy-${this.dayOrNight}-3` : `cloudy-${this.dayOrNight}-3`;

    switch (this.currentConditions) {
      case 'sunny': return sunny_icon;
      case 'clear': return clear_icon;
      case 'mostly-sunny': return mostly_sunny_icon;
      case 'partly-cloudy': return partly_cloudy_icon;
      case 'mostly_sunny': return mostly_sunny_icon;
      case 'partly_cloudy': return partly_cloudy_icon;
      case 'partlycloudy': return partly_cloudy_icon;
      case 'cloudy': return cloudy_icon;
      case 'hazy': return hazy_icon;
      case 'hazey': return hazy_icon;
      case 'haze': return hazy_icon;
      case 'frost': return frost_icon;
      case 'light-rain': return light_rain_icon;
      case 'light_rain': return light_rain_icon;
      case 'wind': return windy_icon;
      case 'windy': return windy_icon;
      case 'fog': return fog_icon;
      case 'foggy': return fog_icon;
      case 'showers': return showers_icon;
      case 'shower': return showers_icon;
      case 'rain': return rain_icon;
      case 'rainy': return rain_icon;
      case 'dust': return dust_icon;
      case 'dusty': return dust_icon;
      case 'snow': return snow_icon;
      case 'snowy': return snow_icon;
      case 'snowy-rainy': return snow_rain_icon;
      case 'snowy_rainy': return snow_rain_icon;
      case 'snowyrainy': return snow_rain_icon;
      case 'storm': return storm_icon;
      case 'stormy': return storm_icon;
      case 'light-showers': return light_showers_icon;
      case 'light-shower': return light_showers_icon;
      case 'heavy-showers': return heavy_showers_icon;
      case 'heavy-shower': return heavy_showers_icon;
      case 'light_showers': return light_showers_icon;
      case 'light_shower': return light_showers_icon;
      case 'heavy_showers': return heavy_showers_icon;
      case 'heavy_shower': return heavy_showers_icon;
      case 'pouring': return heavy_showers_icon;
      case 'tropical-cyclone': return cyclone_icon;
      case 'tropical_cyclone': return cyclone_icon;
      case 'tropicalcyclone': return cyclone_icon;
      case 'clear-day': return clear_day_icon;
      case 'clear-night': return clear_night_icon;
      case 'clear_day': return clear_day_icon;
      case 'clear_night': return clear_night_icon;
      case 'sleet': return sleet_icon;
      case 'partly-cloudy-day': return partly_cloudy_day_icon;
      case 'partly-cloudy-night': return partly_cloudy_night_icon;
      case 'partly_cloudy_day': return partly_cloudy_day_icon;
      case 'partly_cloudy_night': return partly_cloudy_night_icon;
      case 'hail': return hail_icon;
      case 'lightning': return lightning_icon;
      case 'lightning-rainy': return lightning_icon;
      case 'lightning_rainy': return lightning_icon;
      case 'thunderstorm': return lightning_icon;
      case 'windy-variant': return windy_variant_icon;
      case 'windy_variant': return windy_variant_icon;
      case 'exceptional': return '!!';
    }
    return 'unknown';
  }

  get dayOrNight(): string {
    const transformDayNight = { "below_horizon": "night", "above_horizon": "day", };
    return this.config.entity_sun && this.hass.states[this.config.entity_sun] !== undefined ? transformDayNight[this.hass.states[this.config.entity_sun].state] : 'day';
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

  private _handleAction(ev: ActionHandlerEvent): void {
    if (this.hass && this.config && ev.detail.action) {
      handleAction(this, this.hass, this.config, ev.detail.action);
    }
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
    // var currentDataTopMargin = this.config.current_data_top_margin ? this.config.current_data_top_margin : this.config.show_separator ? "1em" : "10em";
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
      .current-text {
        font-size: ${unsafeCSS(currentTextFontSize)};
        color: var(--secondary-text-color);
        overflow: hidden;
        white-space: nowrap;
        text-align: ${unsafeCSS(currentTextAlignment)};
        padding-top: 0.5em;
        padding-bottom: 0.2em;
      }
    `;
  }
}
