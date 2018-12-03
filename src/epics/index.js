import { merge } from "rxjs/observable/merge";
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
import firebaseListener from "./firebaseListener";
import initializeOnAnalyzer from "./initializeOnAnalyzer";
import initializeOnDiscover from "./initializeOnDiscover";
import getSongs from "./getSongs";
import getSongData from "./getSongData";
import getArtistData from "./getArtistData";
import spotifyApiTriggers from "./spotifyApiTriggers";
import discoverTriggers from "./discoverTriggers";
import setLocalStorageEpic from "./setLocalStorageEpic";
import syncGenreToColorEpic from "./syncGenreToColorEpic";
import queryParamsEpic from "./queryParamsEpic";
import addGenreToLocalStoreEpic from "./addGenreToLocalStoreEpic";
import getRelatedSongsOnRowClickEpic from "./getRelatedSongsOnRowClickEpic";
import onLoginEpic from "./onLoginEpic";
import onNowPlayingChangeEpic from "./onNowPlayingChangeEpic";

export default (...args) =>
    merge(
        createFirebaseUser(...args),
        getSpotifyUserData(...args),
        createSharedPlayilst(...args),
        addTracksToPlaylist(...args),
        refreshPlaylist(...args),
        initializeApp(...args),
        initializeOnPlaylist(...args),
        getFirebaseUser(...args),
        deletePlaylist(...args),
        updateFirebaseUser(...args),
        firebaseListener(...args),
        initializeOnAnalyzer(...args),
        initializeOnDiscover(...args),
        getSongs(...args),
        //getSongData(...args),
        getArtistData(...args),
        spotifyApiTriggers(...args),
        discoverTriggers(...args),
        queryParamsEpic(...args),
        syncGenreToColorEpic(...args),
        setLocalStorageEpic(...args),
        addGenreToLocalStoreEpic(...args),
        onLoginEpic(...args),
        getRelatedSongsOnRowClickEpic(...args),
        onNowPlayingChangeEpic(...args)
    );
