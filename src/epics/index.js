import { merge } from 'rxjs/observable/merge';
import fetchAccessToken from './fetchAccessToken';
import initializeConnections from './initializeConnections';
import redirectToPlaylist from './redirectToPlaylist';
import populateSearch from './populateSearch';
import fetchFirebaseUserData from './fetchFirebaseUserData';
import fetchSpotifyUserData from './fetchSpotifyUserData';
import createSharedPlayilst from './createSharedPlaylist';
import addTracksToPlaylist from './addTracksToPlaylist';
import refreshPlaylist from './refreshPlaylist';
import playSong from './playSong';
import updateUserData from './updateUserData';

// Root page
// 1) User needs to fetch access token
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
    initializeConnections(...args),
    fetchAccessToken(...args),
    fetchFirebaseUserData(...args),
    fetchSpotifyUserData(...args),
    createSharedPlayilst(...args),
    //redirectToPlaylist(...args),
    populateSearch(...args),
    addTracksToPlaylist(...args),
    refreshPlaylist(...args),
    playSong(...args),
    updateUserData(...args),
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
