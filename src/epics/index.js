import { ofType, combineEpics } from 'redux-observable';
import _ from 'lodash';
import { merge } from 'rxjs/observable/merge';
import {
    take,
    takeUntil,
    mergeMap,
    switchMap,
    mapTo,
    delay,
    map,
    catchError,
    takeWhile,
} from 'rxjs/operators';
import {
    from,
    of,
    interval,
    timer,
} from 'rxjs';
import { ajax } from 'rxjs/ajax';
import uuid from 'uuid/v1';
import {
    push
} from 'react-router-redux';
import Promise from 'bluebird';
import spotifyApi from '../spotifyApi'
import { getAccessTokenFromUrl } from '../utils';

// Once we get an access token,
// we need to
// 1) Craet a new playlist
// 2) send the data to firebase

const fetchAccessToken = (action$, state$, { firebaseApp }) => action$.pipe(
    ofType('FETCH_ACCESS_TOKEN'),
    switchMap(
        action => {
            const scopes = [
                'user-modify-playback-state',
                'user-read-currently-playing',
                'user-read-playback-state',
                'user-library-read',
                'user-read-recently-played',
                'user-top-read',
                'playlist-read-private',
                'playlist-read-collaborative',
                'playlist-modify-public',
                'playlist-modify-private',
            ];

            const tokenUrl = `https://accounts.spotify.com/authorize?client_id=27135c7bda1c48f3ba0f6be1161b0561&redirect_uri=http://localhost:3000&response_type=token&show_dialog=true&scope=${_.join(scopes, ' ')}`;
            const external = window.open(tokenUrl);

            const getUrl$ = interval(1000).pipe(
                map( () => getAccessTokenFromUrl(external)),
                catchError(e => {
                    console.error(e)
                    return getUrl$;
                })
            );

            return getUrl$
                .pipe(
                    takeWhile( val => val),
                    take(1),
                    mergeMap(
                        (action) => {
                            console.log(action);
                            external.close();
                            return of({type: "HER"});
                        }
                    ),
                )
        }
    ),
    mergeMap(
        action => {
            console.log(action);
            return of({
                type: 'hello'
            });
            //const interval = setInterval(
            //    () => {
            //        try {
            //            // If the window was closed
            //            if (!external.window) {
            //                clearInterval(interval);
            //                /*
            //                this.setState({
            //                    isRequesting: false
            //                })
            //                */
            //            }

            //            const hash = getAccessTokenFromUrl(external);
            //            if (hash) {
            //                clearInterval(interval);
            //                this.props.fetchAccessToken(hash);
            //            }
            //        }
            //        catch (e) {
            //            console.error(e);
            //        }
            //    },
            //    1000
            //);
        }
    )
);

const initializeConnections = (action$, state$, { firebaseApp }) => action$.pipe(
    ofType('FETCH_ACCESjjS_TOKEN'),
    mergeMap(
        action => {
            const id = uuid();
            const doc = {
                id,
                token: action.payload
            };
            try {
                return from(
                    firebaseApp
                        .firestore()
                        .collection('connections')
                        .doc(id)
                        .set(doc)
                )
            }
            catch(e) {
                return from(Promise.reject(e));
            }

            return from(spotifyApi
                .getMe())
                //.then( user => dispatch(setUser(user)))
        },
    ),
    map(response => push('hi')),
    catchError(e => of({type: 'error'})),
);


export default (...args) => merge(
    initializeConnections(...args),
    fetchAccessToken(...args),
);

/*
{
    connections: {
        [key]: {
            id
            token:
            playlistUri
            refreshPlaylist
            isPlaying
            hostHash: Store cookie and pass it to server (potential to transfer ownership)
        }
    }
}
*/
