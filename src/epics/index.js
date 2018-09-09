import { merge } from 'rxjs/observable/merge';
import setAccessToken from './setAccessToken';
import storeFirebaseData from './storeFirebaseData';
import redirectToPlaylist from './redirectToPlaylist';
import populateSearch from './populateSearch';
import getSpotifyUserData from './getSpotifyUserData';
import createSharedPlayilst from './createSharedPlaylist';
import addTracksToPlaylist from './addTracksToPlaylist';
import refreshPlaylist from './refreshPlaylist';
import playSong from './playSong';
import createUserId from './createUserId';
import initializeApp from './initializeApp';
import initializeOnPlaylist from './initializeOnPlaylist';
import getFirebaseUser from './getFirebaseUser';
import updateFirebaseUser from './updateFirebaseUser';
import deletePlaylist from './deletePlaylist';
import setSpotifyApiToken from './setSpotifyApiToken';

// Root page // 1) User needs to fetch access token
// 2) When access token is fetched
// ** Crate a uuid and store it in the cookie
// ** Create a unique url for the user
// ** store the token into firebase
// ** create a playlist
//
// Page with ID
// * Fetch the access token from firebasec
// * Create actions for interacting with spotify
//
//
//
//
// Need to reate epics to listen to firebase events as well
// What happens when non-host user comes to specific url

export default (...args) => merge(
    storeFirebaseData(...args),
    setAccessToken(...args),
    getSpotifyUserData(...args),
    createSharedPlayilst(...args),
    redirectToPlaylist(...args),
    populateSearch(...args),
    addTracksToPlaylist(...args),
    refreshPlaylist(...args),
    playSong(...args),
    createUserId(...args),
    initializeApp(...args),
    initializeOnPlaylist(...args),
    getFirebaseUser(...args),
    deletePlaylist(...args),
    setSpotifyApiToken(...args),
    updateFirebaseUser(...args),
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
