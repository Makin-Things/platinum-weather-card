import { HassEntity } from 'home-assistant-js-websocket';
import { LocalizeFunc, formatDate, formatTime, formatDateTime, FrontendLocaleData } from 'custom-card-helpers';

const UNAVAILABLE = 'unavailable';
const UNKNOWN = 'unknown';

function computeDomain(entityId: string): string {
    return entityId.split('.')[0];
}

export const entityComputeStateDisplay = (
    localize: LocalizeFunc,
    stateObj: HassEntity,
    locale: FrontendLocaleData,
): string | undefined => {
    if (stateObj.state === UNKNOWN || stateObj.state === UNAVAILABLE) {
        return localize(`state.default.${stateObj.state}`);
    }

    if (stateObj.attributes.unit_of_measurement) {
        return `${stateObj.state}${stateObj.attributes.unit_of_measurement}`;
    }

    const domain = computeDomain(stateObj.entity_id);

    if (domain === 'input_datetime') {
        let date: Date;
        if (!stateObj.attributes.has_time) {
            date = new Date(stateObj.attributes.year, stateObj.attributes.month - 1, stateObj.attributes.day);
            return formatDate(date, locale);
        }
        if (!stateObj.attributes.has_date) {
            const now = new Date();
            date = new Date(
                // Due to bugs.chromium.org/p/chromium/issues/detail?id=797548
                // don't use artificial 1970 year.
                now.getFullYear(),
                now.getMonth(),
                now.getDay(),
                stateObj.attributes.hour,
                stateObj.attributes.minute,
            );
            return formatTime(date, locale);
        }

        date = new Date(
            stateObj.attributes.year,
            stateObj.attributes.month - 1,
            stateObj.attributes.day,
            stateObj.attributes.hour,
            stateObj.attributes.minute,
        );
        return formatDateTime(date, locale);
    }

    return (
        // Return device class translation
        (stateObj.attributes.device_class &&
            localize(`component.${domain}.state.${stateObj.attributes.device_class}.${stateObj.state}`)) ||
        // Return default translation
        localize(`component.${domain}.state._.${stateObj.state}`) ||
        // We don't know! Return the raw state.
        stateObj.state
    );
};

export const stringComputeStateDisplay = (
    localize: LocalizeFunc,
    stringObj: string,
): string | undefined => {

    return (
        // Return default translation
        localize(`component.weather.state._.${stringObj}`) ||
        // We don't know! Return the raw state.
        stringObj
    );
};