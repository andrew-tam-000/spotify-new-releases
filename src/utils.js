import qs from "qs";
import { thru } from "lodash";
import lzString from "lz-string";

export function getAccessTokenFromUrl(win) {
    const hash = win.location.hash || "";
    return qs.parse(hash.substr(hash.indexOf("access_token"))).access_token;
}

export const encodedStringifiedToObj = (encodedStringified, defaultVal = {}) => {
    if (!encodedStringified) {
        return defaultVal;
    }

    try {
        return JSON.parse(decodeURI(encodedStringified)) || defaultVal;
    } catch (e) {
        console.error(e);
        return defaultVal;
    }
};

const decompressData = compressedData => {
    try {
        return JSON.parse(lzString.decompressFromUTF16(compressedData));
    } catch (e) {
        console.warn(e);
        return {};
    }
};

const compressData = data => lzString.compressToUTF16(JSON.stringify(data));

export const getKeyFromLocalStorage = key =>
    thru(
        localStorage.getItem(key),
        compressedData => compressedData && decompressData(compressedData)
    );

export const setKeyInLocalStorage = (key, data, expiration) =>
    localStorage.setItem(key, compressData({ value: data, expiration }));
