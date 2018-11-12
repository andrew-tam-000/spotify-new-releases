import { merge } from "rxjs/observable/merge";
import createAccessToken from "./createAccessToken";
import createFirebaseUser from "./createFirebaseUser";
import getSpotifyUserData from "./getSpotifyUserData";
import createSharedPlayilst from "./createSharedPlaylist";
import addTracksToPlaylist from "./addTracksToPlaylist";
import refreshPlaylist from "./refreshPlaylist";
import initializeApp from "./initializeApp";
import initializeOnPlaylist from "./initializeOnPlaylist";
import getFirebaseUser from "./getFirebaseUser";
import updateFirebaseUser from "./updateFirebaseUser";
import deletePlaylist from "./deletePlaylist";
import setSpotifyApiToken from "./setSpotifyApiToken";
import firebaseListener from "./firebaseListener";
import initializeOnAnalyzer from "./initializeOnAnalyzer";
import initializeOnDiscover from "./initializeOnDiscover";
import initializeOnNewRelease from "./initializeOnNewRelease";
import getSongs from "./getSongs";
import getSongData from "./getSongData";
import getArtistData from "./getArtistData";
import spotifyApiTriggers from "./spotifyApiTriggers";
import discoverTriggers from "./discoverTriggers";
import setLocalStorageEpic from "./setLocalStorageEpic";
import syncGenreToColorEpic from "./syncGenreToColorEpic";

export default (...args) =>
    merge(
        createFirebaseUser(...args),
        createAccessToken(...args),
        getSpotifyUserData(...args),
        createSharedPlayilst(...args),
        addTracksToPlaylist(...args),
        refreshPlaylist(...args),
        initializeApp(...args),
        initializeOnPlaylist(...args),
        getFirebaseUser(...args),
        deletePlaylist(...args),
        setSpotifyApiToken(...args),
        updateFirebaseUser(...args),
        firebaseListener(...args),
        initializeOnAnalyzer(...args),
        initializeOnDiscover(...args),
        initializeOnNewRelease(...args),
        //getSongs(...args),
        //getSongData(...args),
        getArtistData(...args),
        spotifyApiTriggers(...args),
        discoverTriggers(...args),
        syncGenreToColorEpic(...args)
        //setLocalStorageEpic(...args)
    );
