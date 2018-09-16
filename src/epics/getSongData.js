import { ofType } from "redux-observable";
import _ from "lodash";
import { last, mapTo, filter, expand, mergeMap, catchError } from "rxjs/operators";
import { merge, EMPTY, from, of } from "rxjs";
import { getSongDataStart, getSongDataSuccess } from "../redux/actions";
import { songIdsSelector } from "../selectors";
import lzString from "lz-string";

const hasStoredSongData = of(!!localStorage.getItem("songData"));

function accumulateSongDataFromStorage() {
    return of(hasStoredSongData).pipe(
        filter(songData => songData.value),
        mergeMap(() =>
            of(JSON.parse(lzString.decompressFromUTF16(localStorage.getItem("songData"))))
        ),
        catchError(e => console.error(e))
    );
}

function accumulateSongDataFromApi(spotifyApi, state$) {
    return of(hasStoredSongData).pipe(
        filter(songData => !songData.value),
        mapTo({
            songIds: songIdsSelector(state$.value),
            songData: []
        }),
        expand(({ songIds, songData }) => {
            const wantedSongIds = _.slice(songIds, 0, 50);
            const remainingSongIds = _.slice(songIds, 50);
            return songIds.length
                ? from(spotifyApi.getAudioFeaturesForTracks(wantedSongIds)).pipe(
                      mergeMap(({ audio_features: audioFeatures }) =>
                          of({
                              songIds: remainingSongIds,
                              songData: [...songData, ...audioFeatures]
                          })
                      ),
                      catchError(e => console.warn(e))
                  )
                : EMPTY;
        }),
        last(),
        mergeMap(({ songData }) => {
            localStorage.setItem("songData", lzString.compressToUTF16(JSON.stringify(songData)));
            return of(songData);
        }),
        catchError(e => console.error(e))
    );
}

export default function getSongs(action$, state$, { spotifyApi }) {
    return action$.pipe(
        ofType(getSongDataStart().type),
        mergeMap(() =>
            merge(accumulateSongDataFromApi(spotifyApi, state$), accumulateSongDataFromStorage())
        ),
        mergeMap(songs => of(getSongDataSuccess(songs))),
        catchError(e => ({ type: "errorp", payload: e.message }))
    );
}
