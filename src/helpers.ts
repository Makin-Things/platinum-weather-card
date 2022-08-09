import { FrontendLocaleData, HomeAssistant, NumberFormat } from 'custom-card-helpers';

export const getLocale = (hass: HomeAssistant): FrontendLocaleData =>
    hass.locale || {
        language: hass.language,
        number_format: NumberFormat.system,
    };

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const installResizeObserver = async () => {
    if (typeof ResizeObserver !== "function") {
        window.ResizeObserver = (await import("resize-observer-polyfill")).default;
    }
};

// From: https://davidwalsh.name/javascript-debounce-function

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.

export const debounce = <T extends any[]>(
    func: (...args: T) => void,
    wait: number,
    immediate = false
) => {
    console.info(`debounce`);
    let timeout: number | undefined;
    const debouncedFunc = (...args: T): void => {
        const later = () => {
            timeout = undefined;
            if (!immediate) {
                func(...args);
            }
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = window.setTimeout(later, wait);
        if (callNow) {
            func(...args);
        }
    };
    debouncedFunc.cancel = () => {
        clearTimeout(timeout);
    };
    return debouncedFunc;
};
