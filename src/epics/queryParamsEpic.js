import { ofType } from "redux-observable";
import { mergeMap, catchError } from "rxjs/operators";
import { merge, of, EMPTY } from "rxjs";
import {
    addGenreColors,
    toggleTagFromQuery,
    addTagToQuery,
    removeTagFromQuery,
    reorderQueryTags,
    toggleSort
} from "../redux/actions";
import { push } from "react-router-redux";
import qs from "qs";
import {
    queryParamsTagsSelector,
    queryParamsSearchSelector,
    queryParamsSortSelector,
    queryParamsSelector
} from "../selectors";
import lzString from "lz-string";
import { get, difference, map, includes, thru, filter, concat } from "lodash";
import { arrayMove } from "react-sortable-hoc";

const onAddGenreEpic = (action$, state$, { spotifyApi }) =>
    action$.pipe(
        ofType(addGenreColors().type),
        mergeMap(
            ({ payload: { genreColors, setActive } }) =>
                setActive
                    ? of(
                          push({
                              search:
                                  "?" +
                                  qs.stringify({
                                      ...queryParamsSelector(state$.value),
                                      tags: thru(queryParamsTagsSelector(state$.value), tags =>
                                          concat(tags, difference(map(genreColors, "genre"), tags))
                                      )
                                  })
                          })
                      )
                    : EMPTY
        )
    );

const toggleTagEpic = (action$, state$, { spotifyApi }) =>
    action$.pipe(
        ofType(toggleTagFromQuery().type),
        mergeMap(({ payload }) => {
            const queryParams = queryParamsSelector(state$.value);
            const queryParamsTags = queryParamsTagsSelector(state$.value);
            const active = includes(queryParamsTags, payload);
            return of(
                push({
                    search:
                        "?" +
                        qs.stringify({
                            ...queryParams,
                            tags: active
                                ? filter(queryParamsTags, tag => tag !== payload)
                                : concat(queryParamsTags, payload)
                        })
                })
            );
        })
    );

const reorderQueryTagsEpic = (action$, state$, { spotifyApi }) =>
    action$.pipe(
        ofType(reorderQueryTags().type),
        mergeMap(({ payload: { oldIndex, newIndex } }) => {
            if (oldIndex === newIndex) {
                return EMPTY;
            }
            const queryParams = queryParamsSelector(state$.value);
            const queryParamsTags = queryParamsTagsSelector(state$.value);
            return of(
                push({
                    search:
                        "?" +
                        qs.stringify({
                            ...queryParams,
                            tags: arrayMove(queryParamsTags, oldIndex, newIndex)
                        })
                })
            );
        })
    );

/*
            sort: {
                sortBy: ["artist", "popularity"],
                sortDirection: {
                    popularity: "DESC",
                    artist: "ASC"
                }
            },
            */
const toggleSortQuery = (action$, state$, { spotifyApi }) =>
    action$.pipe(
        ofType(toggleSort().type),
        mergeMap(({ payload }) => {
            const queryParamsSort = queryParamsSortSelector(state$.value);
            const queryParams = queryParamsSelector(state$.value);
            const sortDirection = get(queryParamsSort, `sortDirection.${payload}`);
            return of(
                push({
                    search:
                        "?" +
                        qs.stringify({
                            ...queryParams,
                            sort: {
                                sortBy: [payload],
                                sortDirection: {
                                    [payload]: sortDirection === "DESC" ? "ASC" : "DESC"
                                }
                            }
                        })
                })
            );
        })
    );

export default (...args) =>
    merge(
        toggleSortQuery(...args),
        onAddGenreEpic(...args),
        toggleTagEpic(...args),
        reorderQueryTagsEpic(...args)
    ).pipe(catchError(e => console.error(e)));
