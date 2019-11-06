import React from 'react'; 
import useCollection from './useCollection'; 


function Members({ channelId }) {
    const members = useCollection("users", undefined, [`channels.${channelId}`, "==", true]); //third argument is an array of arguments for built in "where" query method inside firebase.

    return (
        <div className="Members">
            {members.length >= 2 && (
            <div>
                {members.sort(sortByName).map(member => {
                    return ( 
                <div key ={member.id} className="Member">
                    <div className={`MemberStatus ${member.status.state}`}/>
                    {member.displayName}
                </div>
                )})}
            </div>
            )}
        </div>
    );
}
function sortByName(a,b) {
    return a.displayName > b.displayName 
    ? 1 
    : a.displayName < b.displayName 
    ? -1 
    : 0;  
}
export default Members; 