import qs from "query-string";

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
