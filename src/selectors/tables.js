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
    relatedTracksForIdSelector
} from "./";

import newReleasesByAlbumConfig from "../tableConfigs/newReleasesByAlbum";

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

const formatRow = ({ rowData, genreColorsMap, showColors }) =>
    reduce(
        newReleasesByAlbumConfig,
        (acc, { dataKey, getter, formatter }) => ({
            ...acc,
            [dataKey]: formatter ? formatter(rowData) : getter ? get(rowData, getter) : null
        }),
        {
            meta: {
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
                    type === "librarySong"
                        ? thru([item, item.track], ([originalItem, item]) => ({
                              ...defaultFormatter,
                              album: albums[get(item, "album.id")],
                              artists: compact(map(item.artists, artist => artistData[artist.id])),
                              genres: uniq(
                                  compact(
                                      flatMap(item.artists, artist =>
                                          get(artistData[artist.id], "genres")
                                      )
                                  )
                              ),
                              track: item,
                              meta: { release_date: originalItem.added_at }
                          }))
                        : type === "newRelease"
                            ? {
                                  ...defaultFormatter,
                                  album: albums[item.id],
                                  meta: {
                                      release_date: item.release_date
                                  }
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
                        rowData,
                        tableRow: formatRow({
                            rowData,
                            genreColorsMap,
                            newReleasesTableShowColors
                        })
                    })
                )
        )
);

export const myLibraryDataSelector = createSelector(
    librarySongsSelector,
    queryParamsSortSelector,
    queryParamsTagsSelector,
    queryParamsSearchSelector,
    createHydratedRowFromParamsSelector,
    (librarySongs, { sortBy, sortDirection }, tags, search, createHydratedRowFromParams) => ({
        rows: tableDataFilter({
            tags,
            search,
            rows: orderBy(
                map(
                    librarySongs,
                    track =>
                        createHydratedRowFromParams({
                            type: "librarySong",
                            item: track
                        }).tableRow
                ),
                sortBy,
                map(sortBy, sort => toLower(sortDirection[sort]))
            )
        }),
        config: newReleasesByAlbumConfig
    })
);

const createFlatRecursiveSongRowsSelector = createSelector(
    newReleasesTableOpenSongsSelector,
    songsSelector,
    createHydratedRowFromParamsSelector,
    albumsSelector,
    relatedTracksForIdSelector,
    (newReleasesTableOpenSongs, songs, createHydratedRowFromParams, albums, relatedTracksForId) => {
        const recursiveSongRows = (list, parents, tracksInTree = {}) =>
            flatMap(list, ({ id }) => [
                createHydratedRowFromParams({
                    parents,
                    type: "track",
                    item: songs[id]
                }).tableRow,
                ...(newReleasesTableOpenSongs[id]
                    ? thru(relatedTracksForId(id), relatedTracks =>
                          recursiveSongRows(
                              filter(relatedTracks, ({ id }) => !tracksInTree[id]),
                              [...parents, id],
                              reduce(relatedTracks, (acc, track) => set(acc, track.id, true), {
                                  ...tracksInTree
                              })
                          )
                      )
                    : [])
            ]);

        return recursiveSongRows;
    }
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
            reduce(
                newReleases,
                (acc, item) =>
                    thru(
                        createHydratedRowFromParams({
                            type: "newRelease",
                            item
                        }),
                        hydratedRow => set(acc, hydratedRow.rowData.id, hydratedRow)
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
                            flatMap(orderedAlbumsListData, albumRow =>
                                thru(albumListData[albumRow.id].rowData, rowData => [
                                    ...(newReleasesTableShowAllTracks ? [] : [albumRow]),
                                    ...(newReleasesTableShowAllTracks ||
                                    newReleasesTableOpenAlbums[albumRow.id]
                                        ? createFlatRecursiveSongRows(
                                              get(albums[albumRow.id], "tracks.items"),
                                              [albumRow.id]
                                          )
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
