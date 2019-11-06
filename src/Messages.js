import React, { useEffect, useRef } from 'react'; 
import useDocWithCache from './useDocWithCache'; 
import useCollection from './useCollection'; 
import formatDate from 'date-fns/format';
import { isSameDay } from 'date-fns';



function ChatScroller(props) {
    
    const ref = useRef(); //since it is used inside ref attribute in jsx div element useRef intializes .current property to this div element that contains ref attribute
    const shouldScrollRef = useRef(true); 

    useEffect(() => { //get's called when new stuff comes in (messages)
        if(shouldScrollRef.current) {
        const node = ref.current; 
        node.scrollTop = node.scrollHeight; //sets how far scroll is from top of element to the scrollHeight(which is the height of the node) 
        }
    });//no empty array/ passed here so useEffect everytime doc renders  
    const handleScroll = () => {
        const node = ref.current; 
        const { scrollTop, clientHeight, scrollHeight } = node;  
        const atBottom = scrollTop + clientHeight === scrollHeight; 
        shouldScrollRef.current = atBottom; 
    }
    return <div {...props} ref={ref} onScroll={handleScroll}/> //instead of className ={props.className} and adding each prop manually use spread operator to spread them in. 
}

function Messages({ channelId }) {
    const messages = useCollection(`channels/${channelId}/messages`, 'createdAt'); 
   
    return (
    <ChatScroller className="Messages">
        <div className="EndOfMessages">That's every message!</div>
        {messages.map((message, index) => { 
            const previous = messages[index -1]; 
            const showDay = shouldShowDay(previous, message); 
            const showAvatar =  shouldShowAvatar(previous, message); 
            return showAvatar ? (
                <FirstMessageFromUser message = {message} showDay = {showDay} key ={message.id}/>
        ) : (
                <div key ={message.id}>
                    <div className="Message no-avatar">
                        <div className="MessageContent">{message.text}</div>
                    </div>
                </div>
        )}
        )}

    </ChatScroller>
    );
}

function FirstMessageFromUser({ message, showDay }) {
    const author = useDocWithCache(message.user.path); 
 
    return (
    <div > 
    {showDay && (  
        <div className="Day">
            <div className="DayLine" />
            <div className="DayText">{new Date(message.createdAt.seconds * 1000).toLocaleDateString()}</div>
            <div className="DayLine" />
        </div>
    )}
    <div className="Message with-avatar">
        <div className="Avatar"
        style = {{
            backgroundImage: author 
            ? `url(${author.photoUrl})`
            : ''
        }}
         />
        <div className="Author">
        <div>
            <span className="UserName">{author && author.displayName}</span> {" "/* add a space between span tags. Also this syntax- author && is like if(author) then display author.displayName */}
            <span className="TimeStamp">{formatDate(message.createdAt.seconds * 1000, "h:mm aaa")}</span>
        </div>
        <div className="MessageContent">{message.text}</div>
        </div>
    </div>
    </div>
    ); 
}
function shouldShowDay(previous, message) {
    const isFirst = !previous; 
    if (isFirst) {
        return true; 
    }
    const isNewDay = !isSameDay(
        previous.createdAt.seconds * 1000,
        message.createdAt.seconds * 1000
    ); 

    return isNewDay; 
}
function shouldShowAvatar(previous, message) {
    const isFirst = !previous; 
    if (isFirst) {
        return true; 
    }
    const differentUser = message.user.id !== previous.user.id;
    if (differentUser) {    
        return true; 
    }
    const hasBeenAWhile = 
    message.createdAt.seconds -
    previous.createdAt.seconds > 180; 

    return hasBeenAWhile; 
}
export default Messages; 