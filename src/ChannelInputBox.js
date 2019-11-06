import React from 'react'; 
import { db } from './firebase'; 

function ChannelInputBox({ user, channelId }) {
    return (
    <form onSubmit ={event => {
        event.preventDefault();
       const value = event.target.chatInput.value; 
       db.collection('channels') //shorthand could be db.collection('channels/general/message')
       .doc(channelId)
       .collection('messages')
       .add({
           user: db.collection('users').doc(user.uid),
           text: value,
           createdAt: new Date()
       });
       event.target.reset(); //reset form
    }} 
    className="ChatInputBox">
        <input className="ChatInput" name="chatInput" placeholder={`Message #${channelId}`}/>
    </form>
    );
}

export default ChannelInputBox; 