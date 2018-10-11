import {
    orderBy,
    map,
    mapValues,
    get,
    values,
    keyBy,
    set,
    uniq,
    flatten,
    reduce,
    filter,
    includes,
    toLower,
    sortBy
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

export const searchAlbumsSelector = createSelector(
    state => get(state, "app.search.albums.items") || [],
    albums => albums
);

export const searchArtistsSelector = createSelector(
    state => get(state, "app.search.artists.items") || [],
    artists => artists
);

export const searchPanelSelector = createSelector(
    state => get(state, "app.search.isOpen"),
    isOpen => isOpen
);

export const searchTextSelector = createSelector(
    state => get(state, "app.search.text") || "",
    text => text
);

export const playlistIdSelector = createSelector(
    state => get(state, "app.firebase.playlistId") || "",
    playlistId => playlistId
);

export const playlistSelector = createSelector(
    state => get(state, "app.playlist") || [],
    tracks => tracks
);

export const playlistUriSelector = createSelector(
    state => get(state, "app.playlist.uri") || "",
    playlistId => playlistId
);

export const spotifyUserIdSelector = createSelector(
    state => get(state, "app.spotify.user.id") || "",
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
    state => get(state, "app.spotify.songs") || [],
    songs => songs
);

export const songIdsSelector = createSelector(songsSelector, songs =>
    map(songs, song => get(song, "track.id"))
);

export const songDataSelector = createSelector(
    state => get(state, "app.spotify.songData") || [],
    songData => songData
);

export const relatedArtistsSelector = createSelector(
    state => get(state, "app.spotify.relatedArtists") || [],
    relatedArtists => relatedArtists
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
    state => get(state, "app.spotify.artistData") || [],
    artistData => artistData
);

export const artistTopTracksSelector = createSelector(
    state => get(state, "app.spotify.artistTopTracks") || {},
    artistTopTracks => artistTopTracks
);

export const hydratedRelatedArtistsSelector = createSelector(
    relatedArtistsSelector,
    artistDataSelector,
    (relatedArtists, artistData) =>
        mapValues(relatedArtists, relatedArtistIds =>
            map(relatedArtistIds, relatedArtistId => artistData[relatedArtistId])
        )
);

export const artistDropdownSelector = createSelector(artistDataSelector, artistData =>
    sortBy(values(artistData), "name")
);

export const analyzerSortSelector = createSelector(
    state => get(state, "app.analyzer.sort") || [],
    sort => sort
);

export const analyzerOpenSearchPanelSelector = createSelector(
    state => get(state, "app.analyzer.openSearchPanel"),
    openSearchPanel => openSearchPanel
);

export const librarySongsSelector = createSelector(
    state => get(state, "app.analyzer.songs"),
    songs => songs
);

export const libraryArtistsSelector = createSelector(
    state => get(state, "app.analyzer.artistData"),
    songs => songs
);

export const songWithDataByIdSelector = createSelector(
    songDataSelector,
    songsSelector,
    artistDataSelector,
    (songData, songs, artistData) => id => {
        return {
            songDetails: songs[id],
            songAnalysis: songData[id]
            // Removing this because artists come inplicit with details
            //artistDetails: artistData[get(songs, `${id}.artists.0.id`)]
        };
    }
);

export const librarySongsWithDataSelector = createSelector(
    librarySongsSelector,
    libraryArtistsSelector,
    songWithDataByIdSelector,
    (librarySongs, libraryArtists, songWithDataById) =>
        reduce(librarySongs, (acc, { track }) => set(acc, track, songWithDataById(track)), {})
);

export const librarySongListSelector = createSelector(
    librarySongsWithDataSelector,
    analyzerSearchTermSelector,
    analyzerSortSelector,
    (librarySongsWithData, analyzerSearchTerm, { sortBy, sortDirection }) =>
        orderBy(
            filter(
                map(values(librarySongsWithData), song =>
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
                          includes(toLower(rowData.artist), toLower(analyzerSearchTerm)) ||
                          includes(toLower(rowData.genre), toLower(analyzerSearchTerm))
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

export const advancedSearchArtistsSelector = createSelector(
    advancedSearchSelector,
    advancedSearch => get(advancedSearch, "artists")
);

export const nowPlayingSongUriSelector = createSelector(
    state =>
        get(state, "app.spotify.nowPlaying.is_playing") &&
        get(state, "app.spotify.nowPlaying.item.uri"),
    songId => songId
);

export const showSideBarSelector = createSelector(
    state => get(state, "app.showSideBar"),
    showSideBar => showSideBar
);

export const discoverRootNodeSelector = createSelector(
    state => get(state, "app.discover.root"),
    discoverRootNode => discoverRootNode
);

export const discoverNodesSelector = createSelector(
    state => get(state, "app.discover.nodes"),
    discoverNodes => discoverNodes
);
