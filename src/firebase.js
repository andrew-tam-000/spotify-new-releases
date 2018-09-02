import firebase from 'firebase/app';
import 'firebase/firestore';

const config = {
    apiKey: "AIzaSyBkA8ihKcKxuHKAuRKUpyjmMTAsjSXv7wU",
    authDomain: "spotify-playlist-1e3fc.firebaseapp.com",
    databaseURL: "https://spotify-playlist-1e3fc.firebaseio.com",
    projectId: "spotify-playlist-1e3fc",
    storageBucket: "spotify-playlist-1e3fc.appspot.com",
    messagingSenderId: "43491951179"
};
const settings = { timestampsInSnapshots: true };
const firebaseApp = firebase.initializeApp(config);

firebaseApp.firestore().settings(settings);

export default firebaseApp;
