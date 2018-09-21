import { ofType } from "redux-observable";
import _ from "lodash";
import { last, mapTo, filter, expand, mergeMap, catchError } from "rxjs/operators";
import { merge, EMPTY, from, of } from "rxjs";
import { getArtistDataStart, getArtistDataSuccess } from "../redux/actions";
import { artistIdsSelector } from "../selectors";
import lzString from "lz-string";

const hasStoredArtistData = of(!!localStorage.getItem("artistData"));

function accumulateArtistDataFromStorage() {
    return of(hasStoredArtistData).pipe(
        filter(artistData => artistData.value),
        mergeMap(() =>
            of(JSON.parse(lzString.decompressFromUTF16(localStorage.getItem("artistData"))))
        ),
        catchError(e => console.error(e))
    );
}

function accumulateArtistDataFromApi(spotifyApi, state$) {
    return of(hasStoredArtistData).pipe(
        filter(artistData => !artistData.value),
        mapTo({
            artistIds: artistIdsSelector(state$.value),
            artistData: []
        }),
        expand(({ artistIds, artistData }) => {
            const wantedArtistIds = _.slice(artistIds, 0, 50);
            const remainingArtistIds = _.slice(artistIds, 50);
            return artistIds.length
                ? from(spotifyApi.getArtists(wantedArtistIds)).pipe(
                      mergeMap(({ artists }) =>
                          of({
                              artistIds: remainingArtistIds,
                              artistData: [...artistData, ...artists]
                          })
                      ),
                      catchError(e => console.warn(e))
                  )
                : EMPTY;
        }),
        last(),
        mergeMap(({ artistData }) => {
            localStorage.setItem(
                "artistData",
                lzString.compressToUTF16(JSON.stringify(artistData))
            );
            return of(artistData);
        }),
        catchError(e => console.error(e))
    );
}

export default function getArtistData(action$, state$, { spotifyApi }) {
    return action$.pipe(
        ofType(getArtistDataStart().type),
        mergeMap(() =>
            merge(
                accumulateArtistDataFromApi(spotifyApi, state$),
                accumulateArtistDataFromStorage()
            )
        ),
        mergeMap(artistData => of(getArtistDataSuccess(artistData))),
        catchError(e => ({ type: "errorp", payload: e.message }))
    );
}
