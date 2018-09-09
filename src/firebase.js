import firebase from 'firebase/app';
import 'firebase/firestore';
import Promise from 'bluebird';
import { Observable } from 'rxjs';


const config = {
    apiKey: "AIzaSyBkA8ihKcKxuHKAuRKUpyjmMTAsjSXv7wU",
    authDomain: "spotify-playlist-1e3fc.firebaseapp.com",
    databaseURL: "https://spotify-playlist-1e3fc.firebaseio.com",
    projectId: "spotify-playlist-1e3fc",
    storageBucket: "spotify-playlist-1e3fc.appspot.com",
    messagingSenderId: "43491951179"
};

const settings = { timestampsInSnapshots: true };

export const firebaseApp = firebase.initializeApp(config);
firebaseApp.firestore().settings(settings);

function retrieveUserData(id) {
    return new Promise((resolve, reject) => {
        try {
            resolve(
                firebaseApp
                    .firestore()
                    .collection('connections')
                    .doc(id)
                    .get()
            )
        }
        catch(e) {
            reject(e);
        }
    })
}

function updateUserData(id, data) {
    return new Promise((resolve, reject) => {
        try {
            resolve(
                firebaseApp
                    .firestore()
                    .collection('connections')
                    .doc(id)
                    .update(data)
                    .then(() => data)
            )
        }
        catch(e) {
            reject(e);
        }
    })
}

function setUserData(doc) {
    return firebaseApp
        .firestore()
        .collection('connections')
        .doc(doc.id)
        .set(doc)
}

function subscribeToDoc(docId) {
    try {
        console.log("CREATEING SUBSCRIPTIONG");
        return new Observable.create(function(observer) {
            firebaseApp
                .firestore()
                .collection("connections")
                .doc(docId)
                .onSnapshot(doc => {
                    console.log("CHANGED", doc);
                    observer.next(doc.data());
                })
        });
    }
    catch(e) {
        throw e;
    }
}

export default {
    retrieveUserData,
    setUserData,
    updateUserData,
    subscribeToDoc,
};
