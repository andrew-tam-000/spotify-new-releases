import qs from "query-string";

export function getAccessTokenFromUrl(win) {
    const hash = win.location.hash || "";
    return qs.parse(hash.substr(hash.indexOf("access_token"))).access_token;
}
