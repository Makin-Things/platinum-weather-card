import { FrontendLocaleData, HomeAssistant, NumberFormat } from 'custom-card-helpers';

export const getLocale = (hass: HomeAssistant): FrontendLocaleData =>
    hass.locale || {
        language: hass.language,
        number_format: NumberFormat.system,
    };
