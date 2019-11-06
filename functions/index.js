const admin = require('firebase-admin'); 
const functions = require('firebase-functions');
admin.initializeApp(); 

exports.onUserStatusChanged = require('./triggers/onUserStatusChanged'); 
 
exports.helloWorld = functions.https.onRequest((request,response) => {
    response.send('Hello World'); 
});