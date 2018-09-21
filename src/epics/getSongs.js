import { ofType } from "redux-observable";
import { last, mapTo, filter, expand, mergeMap, catchError } from "rxjs/operators";
import { merge, EMPTY, from, of } from "rxjs";
import { getSongsStart, getSongsSuccess } from "../redux/actions";
import lzString from "lz-string";

const hasStoredSongs = of(!!localStorage.getItem("songs"));

function accumulateSongsFromStorage() {
    return of(hasStoredSongs).pipe(
        filter(songs => songs.value),
        mergeMap(() => of(JSON.parse(lzString.decompressFromUTF16(localStorage.getItem("songs"))))),
        catchError(e => console.error(e))
    );
}

function accumulateSongsFromApi(spotifyApi) {
    return of(hasStoredSongs).pipe(
        filter(songs => !songs.value),
        mapTo({ limit: 50, offset: 0, tracks: [] }),
        expand(({ limit, offset, tracks }) =>
            from(spotifyApi.getMySavedTracks({ limit, offset })).pipe(
                mergeMap(
                    data =>
                        data.items.length
                            ? of({
                                  limit,
                                  offset: offset + limit,
                                  tracks: [...tracks, ...data.items]
                              })
                            : EMPTY
                ),
                catchError(e => console.warn(e))
            )
        ),
        last(),
        mergeMap(({ tracks }) => {
            localStorage.setItem("songs", lzString.compressToUTF16(JSON.stringify(tracks)));
            return of(tracks);
        }),
        catchError(e => console.error(e))
    );
}

export default function getSongs(action$, state$, { spotifyApi }) {
    return action$.pipe(
        ofType(getSongsStart().type),
        mergeMap(() => merge(accumulateSongsFromApi(spotifyApi), accumulateSongsFromStorage())),
        mergeMap(songs => of(getSongsSuccess(songs))),
        catchError(e => ({ type: "errorp", payload: e.message }))
    );
}
