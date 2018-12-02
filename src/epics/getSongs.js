import { ofType } from "redux-observable";
import { thru, uniq, get, flatMap, map, chunk, range } from "lodash";
import { mergeMap, catchError } from "rxjs/operators";
import { from, of } from "rxjs";
import { getKeyFromLocalStorage } from "../utils";
import { getSongsStart, getSongsSuccess } from "../redux/actions";
import { setLocalStorage } from "../redux/actions";

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
        catchError(e => of({ type: "errorp", payload: e.message }))
    );
}
