import qs from 'query-string';

export function getAccessTokenFromUrl(win) {
    return qs.parse((win.location.hash||'').substr(2)).access_token;
}
