import {
    orderBy,
    map,
    get,
    values,
    keyBy,
    merge,
    uniq,
    flatten,
    reduce,
    filter,
    includes,
    toLower
} from "lodash";
import { createSelector } from "reselect";
import tableConfig from "../tableConfig";

export const accessTokenSelector = createSelector(
    state => get(state, "app.firebase.token"),
    accessToken => accessToken
);

export const spotifyPlaylistIdSelector = createSelector(
    state => get(state, "app.playlist.id"),
    playlistId => playlistId
);

export const firebaseUserIdSelector = createSelector(
    state => get(state, "app.firebase.id"),
    userId => userId
);

export const searchTracksSelector = createSelector(
    state => get(state, "app.search.tracks.items") || [],
    tracks => tracks
);

export const searchTextSelector = createSelector(
    state => get(state, "app.search.text") || "",
    text => text
);

export const playlistIdSelector = createSelector(
    state => get(state, "app.firebase.playlistId") || "",
    playlistId => playlistId
);

export const playlistTracksSelector = createSelector(
    state => get(state, "app.playlist.tracks.items") || [],
    tracks => tracks
);

export const playlistUriSelector = createSelector(
    state => get(state, "app.playlist.uri") || "",
    playlistId => playlistId
);

export const spotifyUserIdSelector = createSelector(
    state => get(state, "app.spotifyUser.id") || "",
    spotifyUserId => spotifyUserId
);

export const playStatusSelector = createSelector(
    state => get(state, "app.firebase.playStatus") || "",
    playStatus => playStatus
);

export const songAddedSelector = createSelector(
    state => get(state, "app.firebase.songAdded") || "",
    songAdded => songAdded
);

export const songsSelector = createSelector(
    state => get(state, "app.analyzer.songs") || [],
    songs => songs
);

export const songIdsSelector = createSelector(songsSelector, songs =>
    map(songs, song => get(song, "track.id"))
);

export const songDataSelector = createSelector(
    state => get(state, "app.analyzer.songData") || [],
    songData => songData
);

export const analyzerSearchTermSelector = createSelector(
    state => get(state, "app.analyzer.searchTerm"),
    searchTerm => searchTerm
);

export const artistIdsSelector = createSelector(songsSelector, songs => {
    return uniq(
        map(flatten(map(songs, song => get(song, "track.artists"))), artist => get(artist, "id"))
    );
});

export const artistDataSelector = createSelector(
    state => get(state, "app.analyzer.artistData") || [],
    artistData => artistData
);

export const analyzerSortSelector = createSelector(
    state => get(state, "app.analyzer.sort") || [],
    sort => sort
);

export const artistDataByIdSelector = createSelector(artistDataSelector, artistData =>
    keyBy(artistData, "id")
);
export const songsWithDataByIdSelector = createSelector(
    songDataSelector,
    songsSelector,
    artistDataByIdSelector,
    (songData, songs, artistData) => {
        const songDetailsById = keyBy(
            map(songs, songDetails => ({ songDetails })),
            "songDetails.track.id"
        );
        const songsById = keyBy(
            map(songData, songAnalysis => ({ songAnalysis })),
            "songAnalysis.id"
        );

        const artistsBySongId = keyBy(
            map(songs, song => ({
                artistDetails: {
                    ...get(artistData, get(song, "track.artists.0.id")),
                    songId: get(song, "track.id")
                }
            })),
            "artistDetails.songId"
        );

        return merge({}, songDetailsById, songsById, artistsBySongId);
    }
);

export const songListSelector = createSelector(
    songsWithDataByIdSelector,
    analyzerSearchTermSelector,
    analyzerSortSelector,
    (songsWithDataById, analyzerSearchTerm, { sortBy, sortDirection }) =>
        orderBy(
            filter(
                map(values(songsWithDataById), song =>
                    reduce(
                        tableConfig,
                        (agg, { getter, dataKey, ...props }) => ({
                            ...agg,
                            ...props,
                            [dataKey]: get(song, getter())
                        }),
                        {}
                    )
                ),
                rowData =>
                    analyzerSearchTerm
                        ? includes(toLower(rowData.title), toLower(analyzerSearchTerm)) ||
                          includes(toLower(rowData.artist), toLower(analyzerSearchTerm))
                        : true
            ),
            sortBy,
            map(sortBy, sort => toLower(sortDirection[sort]))
        )
);

export const advancedSearchSelector = createSelector(
    state => get(state, "app.analyzer.advancedSearch") || {},
    advancedSearch => advancedSearch
);

export const advancedSearchTracksSelector = createSelector(advancedSearchSelector, advancedSearch =>
    get(advancedSearch, "tracks")
);

export const advancedSearchAttributesSelector = createSelector(
    advancedSearchSelector,
    advancedSearch => get(advancedSearch, "attributes")
);

export const advancedSearchResultsSelector = createSelector(
    advancedSearchSelector,
    advancedSearch => get(advancedSearch, "results")
);

export const advancedSearchActiveTabSelector = createSelector(
    advancedSearchSelector,
    advancedSearch => get(advancedSearch, "activeTab")
);

export const advancedSearchGenresSelector = createSelector(advancedSearchSelector, advancedSearch =>
    get(advancedSearch, "genres")
);
