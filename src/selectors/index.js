import {
    thru,
    orderBy,
    map,
    mapValues,
    get,
    values,
    last,
    set,
    uniq,
    flatten,
    reduce,
    filter,
    includes,
    toLower,
    sortBy,
    flatMap,
    indexOf,
    flatMapDeep,
    countBy,
    compact,
    find,
    size,
    intersection,
    every
} from "lodash";
import { createSelector } from "reselect";
import tableConfig from "../tableConfig";
import newReleasesByAlbumConfig from "../tableConfigs/newReleasesByAlbum";
import newReleasesByTrackConfig from "../tableConfigs/newReleasesByTrack";
import queryString from "query-string";
import { encodedStringifiedToObj } from "../utils";

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

export const albumsSelector = createSelector(
    state => get(state, "app.spotify.albums") || {},
    albums => albums
);

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

export const nowPlayingSongDurationSelector = createSelector(
    state => get(state, "app.spotify.nowPlaying.item.duration_ms"),
    duration => duration
);

export const nowPlayingSongProgressSelector = createSelector(
    state => get(state, "app.spotify.nowPlaying.progress_ms"),
    progress => progress
);

export const nowPlayingSongUriSelector = createSelector(
    state =>
        get(state, "app.spotify.nowPlaying.is_playing") &&
        get(state, "app.spotify.nowPlaying.item.uri"),
    songId => songId
);
export const nowPlayingContextUriSelector = createSelector(
    state =>
        get(state, "app.spotify.nowPlaying.is_playing") &&
        get(state, "app.spotify.nowPlaying.context.uri"),
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

export const artistForTrackIdSelector = createSelector(
    artistDataSelector,
    songsSelector,
    (artistData, songs) => trackId => artistData[get(songs[trackId], "artists.0.id")] || {}
);

export const artistImageForArtistIdSelector = createSelector(
    artistDataSelector,
    artistData => artistId => get(last(get(artistData[artistId], "images")), "url")
);

export const artistImageForTrackIdSelector = createSelector(
    artistForTrackIdSelector,
    artistDataSelector,
    songsSelector,
    artistImageForArtistIdSelector,
    (artistForTrackId, artistData, songsSelector, artistImageForArtistId) => trackId =>
        artistImageForArtistId(get(artistForTrackId(trackId), "id"))
);

export const queryParamsSelector = createSelector(
    state => get(state, "router.location.search"),
    query => queryString.parse(query)
);

export const queryParamsTagsSelector = createSelector(queryParamsSelector, queryParams =>
    encodedStringifiedToObj(get(queryParams, "tags"), [])
);

export const queryParamsSortSelector = createSelector(queryParamsSelector, queryParams =>
    encodedStringifiedToObj(get(queryParams, "sort"))
);

export const queryParamsSearchSelector = createSelector(queryParamsSelector, queryParams =>
    get(queryParams, "search")
);

export const newReleasesSelector = createSelector(
    state => get(state, "app.spotify.newReleases"),
    newReleases => newReleases
);

export const newReleaseGenresSelector = createSelector(
    newReleasesSelector,
    artistDataSelector,
    (newReleases, artistData) =>
        orderBy(
            map(
                countBy(
                    flatMapDeep(newReleases, newRelease =>
                        map(newRelease.artists, artist => artistData[artist.id].genres)
                    )
                ),
                (count, genre) => ({ count, genre })
            ),
            "count",
            "desc"
        )
);

export const genreColorsSelector = createSelector(
    state => get(state, "app.genreColors"),
    genreColors => genreColors
);

export const availableGenresSelector = createSelector(
    newReleaseGenresSelector,
    queryParamsTagsSelector,
    (newReleaseGenres, tags) => filter(newReleaseGenres, ({ genre }) => !find(tags, genre))
);

const newReleasesTableSelector = createSelector(
    state => get(state, "app.newReleases"),
    newReleases => newReleases
);

const newReleasesTableOpenAlbumsSelector = createSelector(
    newReleasesTableSelector,
    newReleasesTable => get(newReleasesTable, "openAlbums")
);

export const newReleasesTableShowColorsSelector = createSelector(
    newReleasesTableSelector,
    newReleasesTable => get(newReleasesTable, "showColors")
);

export const newReleasesTableShowAllTracksSelector = createSelector(
    newReleasesTableSelector,
    newReleasesTable => get(newReleasesTable, "showAllTracks")
);

export const newReleasesTableModalSelector = createSelector(
    newReleasesTableSelector,
    newReleasesTable => get(newReleasesTable, "modal")
);

export const newReleasesTableModalGenreSelector = createSelector(
    newReleasesTableSelector,
    newReleasesTable => get(newReleasesTable, "modalGenre")
);

const rowHasTags = ({ row, tags }) =>
    size(tags)
        ? // Check that the size is right
          // Check that the order is right
          size(intersection(get(row, "meta.genres"), tags)) === size(tags) &&
          every(
              map(tags, tag => indexOf(get(row, "meta.genres"), tag)),
              (val, idx, arr) => idx === 0 || val > arr[idx - 1]
          )
        : true;

const rowHasSearch = ({ row, search }) =>
    search ? includes(toLower(JSON.stringify(row)), toLower(search)) : true;

// Preserve the order of the filters
const tableDataFilter = ({ search, tags, rows }) =>
    // tags
    filter(
        // Search bar
        filter(rows, row => rowHasSearch({ row, search })),
        row => rowHasTags({ row, tags })
    );

const formatRow = ({ rowData, genreColors, showColors }) =>
    reduce(
        newReleasesByAlbumConfig,
        (acc, { dataKey, getter, formatter }) => ({
            ...acc,
            [dataKey]: formatter ? formatter(rowData) : getter ? get(rowData, getter) : null
        }),
        {
            meta: {
                // Here for searchability
                genres: rowData.genres,
                ...(showColors
                    ? {
                          backgroundColors: compact(
                              map(rowData.genres, genre =>
                                  get(
                                      find(genreColors, genreData => genreData.genre === genre),
                                      "color"
                                  )
                              )
                          )
                      }
                    : {})
            }
        }
    );

const formatTrackRows = ({ rowData, songs, genreColors, showColors }) =>
    map(get(rowData, "album.tracks.items"), track =>
        thru(
            {
                ...rowData,
                track: songs[track.id]
            },
            rowData =>
                formatRow({
                    rowData,
                    genreColors,
                    showColors
                })
        )
    );

export const newReleasesByAlbumTableDataSelector = createSelector(
    newReleasesSelector,
    artistDataSelector,
    albumsSelector,
    genreColorsSelector,
    songsSelector,
    newReleasesTableOpenAlbumsSelector,
    newReleasesTableShowColorsSelector,
    newReleasesTableShowAllTracksSelector,
    queryParamsTagsSelector,
    queryParamsSortSelector,
    (
        newReleases,
        artistData,
        albums,
        genreColors,
        songs,
        newReleasesTableOpenAlbums,
        newReleasesTableShowColors,
        newReleasesTableShowAllTracks,
        tags,
        { sortBy, sortDirection }
    ) =>
        thru(
            reduce(
                newReleases,
                (acc, newRelease) =>
                    thru(
                        {
                            album: albums[newRelease.id],
                            artists: map(newRelease.artists, artist => artistData[artist.id]),
                            genres: uniq(
                                flatMap(newRelease.artists, artist => artistData[artist.id].genres)
                            ),
                            newReleaseMeta: newRelease
                        },
                        rowData =>
                            set(acc, get(rowData, "album.id"), {
                                rowData,
                                tableRow: formatRow({
                                    rowData,
                                    genreColors,
                                    showColors: newReleasesTableShowColors
                                })
                            })
                    ),
                {}
            ),
            albumListData =>
                thru(
                    orderBy(
                        map(values(albumListData), ({ tableRow }) => tableRow),
                        sortBy,
                        map(sortBy, sort => toLower(sortDirection[sort]))
                    ),
                    orderedAlbumsListData =>
                        thru(
                            flatMap(orderedAlbumsListData, tableRow =>
                                thru(albumListData[tableRow.id].rowData, rowData => [
                                    ...(newReleasesTableShowAllTracks ? [] : [tableRow]),
                                    ...(newReleasesTableShowAllTracks ||
                                    newReleasesTableOpenAlbums[tableRow.id]
                                        ? formatTrackRows({
                                              rowData,
                                              songs,
                                              genreColors,
                                              showColors: newReleasesTableShowColors
                                          })
                                        : [])
                                ])
                            ),
                            rows => ({
                                rows: newReleasesTableShowAllTracks
                                    ? orderBy(
                                          rows,
                                          sortBy,
                                          map(sortBy, sort => toLower(sortDirection[sort]))
                                      )
                                    : rows,
                                config: newReleasesByAlbumConfig
                            })
                        )
                )
        )
);

// Do the sorting first
// Then add in the songs
// And then do the search filter
export const newReleasesByAlbumTableDataWithFiltersSelector = createSelector(
    newReleasesByAlbumTableDataSelector,
    queryParamsTagsSelector,
    queryParamsSearchSelector,
    ({ rows, ...newReleasesByAlbumTableData }, tags, search) => ({
        ...newReleasesByAlbumTableData,
        rows: tableDataFilter({ tags, search, rows })
    })
);

export const newReleasesByTrackTableDataSelector = createSelector(
    newReleasesSelector,
    artistDataSelector,
    albumsSelector,
    songsSelector,
    (newReleases, artistData, albums, songs) => ({
        rows: flatMap(newReleases, newRelease =>
            map(map(get(albums, [newRelease.id, "tracks", "items"]), "id"), trackId =>
                thru(
                    {
                        album: albums[newRelease.id],
                        artists: map(newRelease.artists, artist => artistData[artist.id]),
                        newReleaseMeta: newRelease,
                        track: songs[trackId]
                    },
                    row =>
                        reduce(
                            newReleasesByTrackConfig,
                            (acc, { dataKey, getter, formatter }) => ({
                                ...acc,
                                [dataKey]: formatter
                                    ? formatter(row)
                                    : getter
                                        ? get(row, getter)
                                        : null
                            }),
                            {}
                        )
                )
            )
        ),
        config: newReleasesByTrackConfig
    })
);

export const tracksForAlbumForIdSelector = createSelector(
    albumsSelector,
    songsSelector,
    (albums, songs) => albumId => {
        const album = albums[albumId];
        return {
            album,
            hydratedTracks: map(album.tracks.items, track => songs[track.id])
        };
    }
);
