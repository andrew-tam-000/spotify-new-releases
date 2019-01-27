import {
    values,
    uniq,
    set,
    orderBy,
    thru,
    flatMap,
    map,
    every,
    size,
    intersection,
    get,
    indexOf,
    toLower,
    includes,
    filter,
    reduce,
    compact
} from "lodash";
import { createSelector } from "reselect";
import {
    librarySongsSelector,
    newReleasesSelector,
    artistDataSelector,
    albumsSelector,
    genreColorsMapSelector,
    songsSelector,
    newReleasesTableShowColorsSelector,
    newReleasesTableShowAllTracksSelector,
    queryParamsTagsSelector,
    queryParamsSortSelector,
    queryParamsSearchSelector,
    newReleasesTableOpenAlbumsSelector,
    newReleasesTableOpenSongsSelector,
    relatedTracksForIdSelector,
    searchPlaylistsSelector,
    searchTracksSelector,
    searchAlbumsSelector,
    searchArtistsSelector
} from "./";

import newReleasesByAlbumConfig from "../tableConfigs/newReleasesByAlbum";

const rowHasTags = ({ row, tags }) =>
    size(tags) && get(row, "meta.cellType") !== "date"
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
    // Filter again to remove dates that don't have songs in them
    filter(
        // tags
        filter(
            // Search bar
            filter(rows, row => rowHasSearch({ row, search })),
            row => rowHasTags({ row, tags })
        ),
        (row, idx, list) =>
            !(
                (get(row, "meta.cellType") === "date" &&
                    list[idx + 1] &&
                    get(list[idx + 1], "meta.cellType") === "date") ||
                (get(row, "meta.cellType") === "date" && !list[idx + 1])
            )
    );

const formatRow = ({ rowData, genreColorsMap, showColors }) =>
    reduce(
        newReleasesByAlbumConfig,
        (acc, { dataKey, getter, formatter }) => ({
            ...acc,
            [dataKey]: formatter ? formatter(rowData) : getter ? get(rowData, getter) : null
        }),
        {
            meta: {
                // Check what kind of cell to render
                cellType: rowData.track ? "track" : "album",
                // Here to keep track of parents
                parents: rowData.parents,
                // Here for searchability
                genres: rowData.genres,
                ...(showColors
                    ? {
                          backgroundColors: compact(
                              map(rowData.genres, genre => genreColorsMap[genre])
                          )
                      }
                    : {})
            }
        }
    );

const createHydratedRowFromParamsSelector = createSelector(
    artistDataSelector,
    genreColorsMapSelector,
    songsSelector,
    newReleasesTableShowColorsSelector,
    albumsSelector,
    (artistData, genreColorsMap, songs, newReleasesTableShowColors, albums) => ({
        item,
        type,
        parents = []
    }) =>
        thru(
            {
                parents,
                id: item.id,
                artists: compact(map(item.artists, artist => artistData[artist.id])),
                genres: uniq(
                    compact(flatMap(item.artists, artist => get(artistData[artist.id], "genres")))
                )
            },
            defaultFormatter =>
                thru(
                    type === "newRelease"
                        ? {
                              ...defaultFormatter,
                              album: albums[item.id],
                              meta: {
                                  release_date: item.release_date
                              }
                          }
                        : type === "artist"
                            ? {
                                  ...defaultFormatter,
                                  artists: [item]
                              }
                            : type === "playlist"
                                ? {
                                      ...defaultFormatter
                                  }
                                : type === "album"
                                    ? {
                                          ...defaultFormatter,
                                          album: item
                                      }
                                    : type === "track"
                                        ? {
                                              ...defaultFormatter,
                                              album: albums[get(item, "album.id")],
                                              track: item,
                                              meta: {
                                                  release_date: get(item, "album.release_date")
                                              }
                                          }
                                        : {},
                    rowData => ({
                        item,
                        rowData,
                        tableRow: formatRow({
                            rowData,
                            genreColorsMap,
                            showColors: newReleasesTableShowColors
                        })
                    })
                )
        )
);

const createHydratedList = ({ list, createHydratedRowFromParams, itemResolver, type }) =>
    reduce(
        list,
        (acc, item) =>
            thru(
                createHydratedRowFromParams({
                    type,
                    item: itemResolver ? itemResolver(item) : item
                }),
                hydratedRow => set(acc, hydratedRow.rowData.id, hydratedRow)
            ),
        {}
    );

const createFlatRecursiveSongRowsSelector = createSelector(
    newReleasesTableOpenSongsSelector,
    createHydratedRowFromParamsSelector,
    albumsSelector,
    relatedTracksForIdSelector,
    (newReleasesTableOpenSongs, createHydratedRowFromParams, albums, relatedTracksForId) => {
        const recursiveSongRows = ({ list, parents = [], tracksInTree = {} }) =>
            flatMap(list, track => [
                createHydratedRowFromParams({
                    parents,
                    type: "track",
                    item: track
                }).tableRow,
                ...(newReleasesTableOpenSongs[track.id]
                    ? thru(relatedTracksForId(track.id), relatedTracks =>
                          recursiveSongRows({
                              list: filter(relatedTracks, ({ id }) => !tracksInTree[id]),
                              parents: [...parents, track.id],
                              tracksInTree: reduce(
                                  relatedTracks,
                                  (acc, track) => set(acc, track.id, true),
                                  {
                                      ...tracksInTree
                                  }
                              )
                          })
                      )
                    : [])
            ]);

        return recursiveSongRows;
    }
);

const sortedRowsWithRowsSelector = createSelector(
    queryParamsSortSelector,
    ({ sortBy, sortDirection }) => tableRows =>
        orderBy(tableRows, sortBy, map(sortBy, sort => toLower(sortDirection[sort])))
);

export const myLibraryDataSelector = createSelector(
    librarySongsSelector,
    sortedRowsWithRowsSelector,
    queryParamsTagsSelector,
    queryParamsSearchSelector,
    createHydratedRowFromParamsSelector,
    createFlatRecursiveSongRowsSelector,
    (
        librarySongs,
        sortedRowsWithRows,
        tags,
        search,
        createHydratedRowFromParams,
        createFlatRecursiveSongRows
    ) =>
        thru(
            createHydratedList({
                list: librarySongs,
                createHydratedRowFromParams,
                itemResolver: item => set(item.track, "album.release_date", item.added_at),
                type: "track"
            }),
            librarySongs =>
                thru(
                    sortedRowsWithRows(map(values(librarySongs), ({ tableRow }) => tableRow)),
                    orderedLibrarySongs => ({
                        rows: tableDataFilter({
                            tags,
                            search,
                            rows: createFlatRecursiveSongRows({
                                list: map(orderedLibrarySongs, track => librarySongs[track.id].item)
                            })
                        }),
                        config: newReleasesByAlbumConfig
                    })
                )
        )
);

const newReleasesByAlbumTableDataSelector = createSelector(
    newReleasesSelector,
    artistDataSelector,
    albumsSelector,
    genreColorsMapSelector,
    songsSelector,
    newReleasesTableOpenAlbumsSelector,
    newReleasesTableShowColorsSelector,
    newReleasesTableShowAllTracksSelector,
    newReleasesTableOpenSongsSelector,
    relatedTracksForIdSelector,
    queryParamsSortSelector,
    createHydratedRowFromParamsSelector,
    createFlatRecursiveSongRowsSelector,
    (
        newReleases,
        artistData,
        albums,
        genreColorsMap,
        songs,
        newReleasesTableOpenAlbums,
        newReleasesTableShowColors,
        newReleasesTableShowAllTracks,
        newReleasesTableOpenSongs,
        relatedTracksForId,
        { sortBy, sortDirection },
        createHydratedRowFromParams,
        createFlatRecursiveSongRows
    ) =>
        thru(
            {
                sortBy: [
                    ...(newReleasesTableShowAllTracks ? [] : ["releaseDate"]),
                    ...(sortBy || [])
                ],
                sortDirection: {
                    ...(sortDirection || {}),
                    releaseDate: "desc"
                }
            },
            ({ sortBy, sortDirection }) =>
                thru(
                    createHydratedList({
                        list: newReleases,
                        createHydratedRowFromParams,
                        type: "newRelease"
                    }),
                    albumListData =>
                        thru(
                            orderBy(
                                map(values(albumListData), ({ tableRow }) => tableRow),
                                sortBy,
                                map(sortBy, sort => toLower(sortDirection[sort]))
                            ),
                            orderedAlbumsListData =>
                                thru(
                                    flatMap(orderedAlbumsListData, (albumRow, idx) =>
                                        thru(albumListData[albumRow.id].rowData, rowData => [
                                            // Ignore first date change
                                            // But look for subsequent date changes
                                            // and insert row
                                            ...(!newReleasesTableShowAllTracks &&
                                            (idx === 0 ||
                                                get(rowData, "meta.release_date") !==
                                                    albumListData[orderedAlbumsListData[idx - 1].id]
                                                        .rowData.meta.release_date)
                                                ? [
                                                      {
                                                          releaseDate: get(
                                                              rowData,
                                                              "meta.release_date"
                                                          ),
                                                          meta: {
                                                              cellType: "date",
                                                              parents: []
                                                          }
                                                      }
                                                  ]
                                                : []),

                                            // Don't show albums for track mode
                                            ...(newReleasesTableShowAllTracks ? [] : [albumRow]),
                                            ...(newReleasesTableShowAllTracks ||
                                            newReleasesTableOpenAlbums[albumRow.id]
                                                ? createFlatRecursiveSongRows({
                                                      list: compact(
                                                          map(
                                                              get(
                                                                  albums[albumRow.id],
                                                                  "tracks.items"
                                                              ),
                                                              ({ id }) => songs[id]
                                                          )
                                                      ),
                                                      parents: [albumRow.id]
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
        )
);

export const nowPlayingTableForIdSelector = createSelector(
    songsSelector,
    relatedTracksForIdSelector,
    createFlatRecursiveSongRowsSelector,
    (songs, relatedTracksForId, createFlatRecursiveSongRows) => id => ({
        rows: createFlatRecursiveSongRows({
            list: relatedTracksForId(id)
        }),
        config: newReleasesByAlbumConfig
    })
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

export const searchTableDataSelector = createSelector(
    createHydratedRowFromParamsSelector,
    searchPlaylistsSelector,
    searchTracksSelector,
    searchAlbumsSelector,
    searchArtistsSelector,
    songsSelector,
    albumsSelector,
    artistDataSelector,
    newReleasesTableOpenAlbumsSelector,
    createFlatRecursiveSongRowsSelector,
    sortedRowsWithRowsSelector,
    (
        createHydratedRowFromParams,
        searchPlaylists,
        searchTracks,
        searchAlbums,
        searchArtists,
        songs,
        albums,
        artistData,
        newReleasesTableOpenAlbums,
        createFlatRecursiveSongRows,
        sortedRowsWithRows
    ) =>
        thru(
            [
                {
                    type: "searchTracks",
                    data: createHydratedList({
                        list: map(searchTracks, id => songs[id]),
                        createHydratedRowFromParams,
                        type: "track"
                    })
                },
                {
                    type: "searchAlbums",
                    data: thru(
                        createHydratedList({
                            list: map(searchAlbums, id => albums[id]),
                            createHydratedRowFromParams,
                            type: "album"
                        }),
                        albumListData =>
                            flatMap(
                                albumListData,
                                albumRow =>
                                    newReleasesTableOpenAlbums[albumRow.rowData.id]
                                        ? [
                                              albumRow,
                                              ...map(
                                                  createFlatRecursiveSongRows({
                                                      list: compact(
                                                          map(
                                                              get(
                                                                  albums[albumRow.rowData.id],
                                                                  "tracks.items"
                                                              ),
                                                              ({ id }) => songs[id]
                                                          )
                                                      ),
                                                      parents: [albumRow.rowData.id]
                                                  }),
                                                  tableRow => ({ tableRow })
                                              )
                                          ]
                                        : albumRow
                            )
                    )
                },
                {
                    type: "searchArtists",
                    data: createHydratedList({
                        list: map(searchArtists, id => artistData[id]),
                        createHydratedRowFromParams,
                        type: "artist"
                    })
                },
                {
                    type: "searchPlaylists",
                    data: createHydratedList({
                        list: searchPlaylists,
                        createHydratedRowFromParams,
                        type: "playlist"
                    })
                }
            ],
            hydratedData =>
                reduce(
                    hydratedData,
                    (acc, { type, data }) =>
                        set(acc, type, {
                            rows: sortedRowsWithRows(map(values(data), "tableRow")),
                            config: newReleasesByAlbumConfig
                        }),
                    {}
                )
        )
);
