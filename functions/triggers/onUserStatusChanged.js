const functions = require('firebase-functions');
const admin = require('firebase-admin'); 

const db = admin.firestore(); 

module.exports = functions.database
    .ref("status/{userId}")
    .onUpdate((change, context) => { //context tells us which thing changed
        const eventStatus = change.after.val(); // new status data in real time database 
        const userDoc = db.doc(`users/${context.params.userId}`); 
                //gives us reference to change on rtdb
        return change.after.ref.once("value").then(snapshot => {
            const status = snapshot.val();
            if (status.lastChanged > eventStatus.lastChanged) { //protect against events coming in wrong order keep most recent one (more recent is greater then less recent )
                return;
            }
            eventStatus.lastChanged = new Date(eventStatus.lastChanged); //convert from ms to Date timestap 
            userDoc.update({ status: eventStatus });
        });
       

    });