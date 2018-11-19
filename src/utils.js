import qs from "qs";
import { thru } from "lodash";
import lzString from "lz-string";
import { memoize } from "lodash";

export function getAccessTokenFromUrl(win) {
    const hash = win.location.hash || "";
    return qs.parse(hash.substr(hash.indexOf("access_token"))).access_token;
}

const decompressData = compressedData => {
    try {
        return JSON.parse(lzString.decompressFromUTF16(compressedData));
    } catch (e) {
        console.warn(e);
        return {};
    }
};

const compressData = data => lzString.compressToUTF16(JSON.stringify(data));

export const getKeyFromLocalStorage = memoize(key =>
    thru(
        localStorage.getItem(key),
        compressedData => compressedData && decompressData(compressedData)
    )
);

export const setKeyInLocalStorage = (key, data, expiration) => {
    const uncompressedData = { value: data, expiration };

    localStorage.setItem(key, compressData(uncompressedData));
    getKeyFromLocalStorage.cache.set(key, uncompressedData);
};

window.getKeyFromLocalStorage = getKeyFromLocalStorage;
window.setKeyInLocalStorage = setKeyInLocalStorage;
