import React, { useEffect } from 'react'; 
import ChannelInfo from './ChannelInfo'; 
import Messages from './Messages'; 
import ChannelInputBox from './ChannelInputBox'; 
import Members from './Members'; 
import { db } from './firebase'; 

function Channel({ user, channelId }) {
    //scope 
    // user.uid and channelId is used and in scope 
    useEffect(() => {
        db.doc(`users/${user.uid}`).update({
                [`channels.${channelId}`] : true 
        }); 
    }, [user.uid, channelId]) // what ever values used put in array 
    return (
        <div className="Channel">
        <div className="ChannelMain">
        <ChannelInfo channelId ={channelId}/>
        <Messages channelId = {channelId} />
        <ChannelInputBox channelId = {channelId} user = {user}/>
        </div>
        <Members channelId ={channelId} />
      </div>
    ); 
}

export default Channel; 