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
    newReleasesTableOpenAlbumsSelector
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

const formatTrackRows = ({ rowData, songs, genreColorsMap, showColors }) =>
    map(get(rowData, "album.tracks.items"), track =>
        thru(
            {
                ...rowData,
                track: songs[track.id]
            },
            rowData =>
                formatRow({
                    rowData,
                    genreColorsMap,
                    showColors
                })
        )
    );

const createHydratedData = ({
    type,
    list,
    showColors,
    songs,
    albums,
    artistData,
    genreColorsMap
}) =>
    reduce(
        list,
        (acc, item) =>
            thru(
                type === "librarySongs"
                    ? thru([item, item.track], ([originalItem, item]) => ({
                          id: item.id,
                          album: albums[get(item, "album.id")],
                          artists: map(item.artists, artist => artistData[artist.id]),
                          genres: uniq(
                              flatMap(item.artists, artist => get(artistData[artist.id], "genres"))
                          ),
                          track: item,
                          meta: { release_date: originalItem.added_at }
                      }))
                    : type === "newRelease"
                        ? {
                              album: albums[item.id],
                              artists: map(item.artists, artist => artistData[artist.id]),
                              genres: uniq(
                                  flatMap(item.artists, artist =>
                                      get(artistData[artist.id], "genres")
                                  )
                              ),
                              id: item.id,
                              meta: {
                                  release_date: item.release_date
                              }
                          }
                        : type === "album"
                            ? {
                                  id: item.id,
                                  album: item,
                                  artists: map(item.artists, artist => artistData[artist.id]),
                                  genres: uniq(
                                      flatMap(item.artists, artist =>
                                          get(artistData[artist.id], "genres")
                                      )
                                  )
                              }
                            : type === "track"
                                ? {
                                      id: item.id,
                                      album: albums[get(item, "album.id")],
                                      artists: map(item.artists, artist => artistData[artist.id]),
                                      genres: uniq(
                                          flatMap(item.artists, artist =>
                                              get(artistData[artist.id], "genres")
                                          )
                                      ),
                                      track: item
                                  }
                                : {},
                rowData =>
                    set(acc, rowData.id, {
                        rowData,
                        tableRow: formatRow({
                            rowData,
                            genreColorsMap,
                            showColors
                        })
                    })
            ),
        {}
    );

export const myLibraryDataSelector = createSelector(
    librarySongsSelector,
    artistDataSelector,
    albumsSelector,
    genreColorsMapSelector,
    songsSelector,
    newReleasesTableOpenAlbumsSelector,
    newReleasesTableShowColorsSelector,
    newReleasesTableShowAllTracksSelector,
    queryParamsSortSelector,
    queryParamsTagsSelector,
    queryParamsSearchSelector,
    (
        librarySongs,
        artistData,
        albums,
        genreColorsMap,
        songs,
        newReleasesTableOpenAlbums,
        newReleasesTableShowColors,
        newReleasesTableShowAllTracks,
        { sortBy, sortDirection },
        tags,
        search
    ) => ({
        rows: tableDataFilter({
            tags,
            search,
            rows: orderBy(
                map(
                    values(
                        createHydratedData({
                            type: "librarySongs",
                            list: librarySongs,
                            showColors: newReleasesTableShowColors,
                            songs,
                            albums,
                            artistData,
                            genreColorsMap
                        })
                    ),
                    ({ tableRow }) => tableRow
                ),
                sortBy,
                map(sortBy, sort => toLower(sortDirection[sort]))
            )
        }),
        config: newReleasesByAlbumConfig
    })
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
    queryParamsSortSelector,
    (
        newReleases,
        artistData,
        albums,
        genreColorsMap,
        songs,
        newReleasesTableOpenAlbums,
        newReleasesTableShowColors,
        newReleasesTableShowAllTracks,
        { sortBy, sortDirection }
    ) =>
        thru(
            createHydratedData({
                type: "newRelease",
                list: newReleases,
                showColors: newReleasesTableShowColors,
                songs,
                albums,
                artistData,
                genreColorsMap
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
                            flatMap(orderedAlbumsListData, albumRow =>
                                thru(albumListData[albumRow.id].rowData, rowData => [
                                    ...(newReleasesTableShowAllTracks ? [] : [albumRow]),
                                    ...(newReleasesTableShowAllTracks ||
                                    newReleasesTableOpenAlbums[albumRow.id]
                                        ? formatTrackRows({
                                              rowData,
                                              songs,
                                              genreColorsMap,
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
