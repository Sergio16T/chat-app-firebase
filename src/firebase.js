import firebase from 'firebase/app';
import 'firebase/firestore'; 
import 'firebase/database'; 
import 'firebase/auth'; 
import { firebaseConfig } from './firebaseConfig'; 

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore(); 
const rtdb = firebase.database(); //gives access to realtime database 

export function setupPresence(user) {
    const isOfflineforRTDB = {
        state: 'offline',
        lastChanged: firebase.database.ServerValue.TIMESTAMP
    }; 
    const isOnlineforRTDB = {
        state: 'online', 
        lastChanged: firebase.database.ServerValue.TIMESTAMP
    }; 
    const isOfflineforFirestore = {
        state: 'offline',
        lastChanged: firebase.firestore.FieldValue.serverTimestamp()
    }; 
    const isOnlineforFirestore = {
        state: 'online', 
        lastChanged: firebase.firestore.FieldValue.serverTimestamp()
    };
    const rtdbRef = rtdb.ref(`/status/${user.uid}`); 
    const userDoc = db.doc(`/users/${user.uid}`); 

    rtdb.ref('.info/connected').on('value', async (snapshot) => {
        if(snapshot.val() === false) { 
            userDoc.update({
                status: isOfflineforFirestore
            })
            return; 
        } 
        await rtdbRef.onDisconnect().set(isOfflineforRTDB);
        // when server gets this that it is awaiting it sets state still Online 
        rtdbRef.set(isOnlineforRTDB);
        userDoc.update({
            status: isOnlineforFirestore
        });
    }); 
}
export { db, firebase };