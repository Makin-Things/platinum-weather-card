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
        console.info(`update: %s=%s`, entity, this.hass.states[entity].state);
        return true;
      }
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
    })
    super.performUpdate();
  }

  // https://lit.dev/docs/components/rendering/
  protected render(): TemplateResult | void {
    console.info(`Weather: render`);
    if (this._error.length !== 0) return this._showConfigWarning(this._error);

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
        <div class="apparent">${this.localeTextfeelsLike} <span id="apparent-temp-text">${this.apparentTemperature}</span>
        </div>
        <div class="apparentc"> ${this.getUOM('temperature')}</div>
      </div>
    `;

    const currentText = this.config.entity_current_text !== undefined ? this.hass.states[this.config.entity_current_text].state ?? '---' : '---';

    return html`
      <style>
        ${this.styles}
      </style>
      <ha-card class="card">
        <div class="content">
          <div class="top-row">
            <div class="top-left">${biggerIcon}</div>
            <div class="currentTemps">${currentTemp}${apparentTemp}</div>
          </div>
          <div class="current-text">${currentText}</div>
          <div><p>This is where slots go</p></div>
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
