import { merge } from 'rxjs/observable/merge';
import setAccessToken from './setAccessToken';
import createFirebaseUser from './createFirebaseUser';
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
import firebaseListener from './firebaseListener';

export default (...args) => merge(
    createFirebaseUser(...args),
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
    firebaseListener(...args),
);
