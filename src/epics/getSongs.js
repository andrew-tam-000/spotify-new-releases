import { ofType } from "redux-observable";
import { thru, uniq, get, flatMap, map, chunk, range } from "lodash";
import { last, mapTo, filter, expand, mergeMap, catchError } from "rxjs/operators";
import { merge, EMPTY, from, of } from "rxjs";
import { getKeyFromLocalStorage } from "../utils";
import { getSongsStart, getSongsSuccess } from "../redux/actions";
import lzString from "lz-string";
import { setLocalStorage } from "../redux/actions";

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
        mergeMap(() =>
            thru(
                get(getKeyFromLocalStorage("library"), "value"),
                library =>
                    library
                        ? of(getSongsSuccess(get(library, "items"), get(library, "artists")))
                        : from(
                              // Get counts
                              spotifyApi
                                  .getMySavedTracks({
                                      limit: 50,
                                      offset: 0
                                  })
                                  .then(({ total }) => total)
                                  .then(count =>
                                      Promise.all(
                                          map(chunk(range(count), 50), (items, idx) =>
                                              spotifyApi.getMySavedTracks({
                                                  country: "US",
                                                  limit: items.length,
                                                  offset: idx * 50
                                              })
                                          )
                                      )
                                  )
                                  .then(results => flatMap(results, "items"))
                                  .then(items =>
                                      Promise.all([
                                          Promise.resolve(items),
                                          Promise.all(
                                              map(
                                                  chunk(
                                                      uniq(
                                                          flatMap(items, item =>
                                                              map(get(item, "track.artists"), "id")
                                                          )
                                                      ),
                                                      50
                                                  ),
                                                  idSet => spotifyApi.getArtists(idSet)
                                              )
                                          ).then(artists => flatMap(artists, "artists"))
                                      ])
                                  )
                          ).pipe(
                              mergeMap(([items, artists]) => [
                                  setLocalStorage("library", { items, artists }),
                                  getSongsSuccess(items, artists)
                              ])
                          )
            )
        ),
        catchError(e => ({ type: "errorp", payload: e.message }))
    );
}
