import { ofType } from "redux-observable";
import { mergeMap, catchError } from "rxjs/operators";
import { merge, of, EMPTY } from "rxjs";
import {
    addGenreColors,
    toggleTagFromQuery,
    addTagToQuery,
    removeTagFromQuery
} from "../redux/actions";
import { push } from "react-router-redux";
import queryString from "query-string";
import {
    queryParamsTagsSelector,
    queryParamsSearchSelector,
    queryParamsSortSelector,
    queryParamsSelector
} from "../selectors";
import lzString from "lz-string";
import { difference, map, includes, thru, filter, concat } from "lodash";

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
                                  queryString.stringify({
                                      ...queryParamsSelector(state$.value),
                                      tags: encodeURI(
                                          JSON.stringify(
                                              thru(queryParamsTagsSelector(state$.value), tags =>
                                                  concat(
                                                      tags,
                                                      difference(map(genreColors, "genre"), tags)
                                                  )
                                              )
                                          )
                                      )
                                  })
                          })
                      )
                    : EMPTY
        )
    );

const toggleTag = (action$, state$, { spotifyApi }) =>
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
                        queryString.stringify({
                            ...queryParams,
                            tags: encodeURI(
                                JSON.stringify(
                                    active
                                        ? filter(queryParamsTags, tag => tag !== payload)
                                        : concat(queryParamsTags, payload)
                                )
                            )
                        })
                })
            );
        })
    );

export default (...args) =>
    merge(onAddGenreEpic(...args), toggleTag(...args)).pipe(catchError(e => console.error(e)));
