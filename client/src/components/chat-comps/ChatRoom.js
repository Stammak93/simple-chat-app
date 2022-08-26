import React, { useEffect, useState, useContext, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { SocketContext } from "../../context/socket";
import { GET_ROOM, NOTIFY_USER } from "../../service/graphql-queries";
import MessageMaker from "./MessageMaker";
import LogoutButton from "./LogoutButton";


const ChatRoom = ({ you, notificationSent, setNotificationSent }) => {

    const [chatRoomMessages, setChatRoomMessages] = useState([]);
    const [friend, setFriend] = useState("");
    const [autoScroll, setAutoScroll] = useState(true);
    
    const navigate = useNavigate()
    const socket = useContext(SocketContext);
    const { id } = useParams();
    const ref = useRef();
    
    // graphql query
    const { loading, error, data } = useQuery(GET_ROOM, {
        variables: {
            roomId: id
        }
    })
    
    // graphql mutations
    const [notifyUser] = useMutation(NOTIFY_USER)

    // set content of chatroom on render
    useEffect(() => {
        
        if(id === undefined || error) {
            return navigate("/chat/1")
        }

        if(id === "1") {
            return;
        }

        if(data) {
            setChatRoomMessages(data.getChatRoom.chatRoom.messages)
            setFriend(data.getChatRoom.friend.userName)
            socket.emit("REQUEST_JOIN", (id))
        }
         
    },[id, navigate, data, error, socket])

    
    // scroll to the bottom on page load and view latest messages
    useEffect(() => {

        if(chatRoomMessages.length > 10 && autoScroll === true) {
            ref.current.lastChild.scrollIntoView();
        }

    
    },[chatRoomMessages.length, autoScroll])

    
    // create a toggle for the autoscroll event
    useEffect(() => {

        const disableAutoScroll = (e) => {

            if(e.deltaY < 0 && autoScroll === true) {
                setAutoScroll(false)
            }

            if(e.deltaY > 0 && autoScroll === false) {
                let scrollTriggerPoint = ref.current.scrollHeight - ref.current.scrollTop
                if(scrollTriggerPoint === ref.current.clientHeight) {
                    setAutoScroll(true)
                }
            }
        }

        let scrollBarEvent = ref.current
        scrollBarEvent.addEventListener("wheel", disableAutoScroll)

        return () => {
            scrollBarEvent.removeEventListener("wheel", disableAutoScroll)
        }

    },[autoScroll])

    
    // handle user receiving a message event
    const handleReceivedMessage = useCallback(({ messageObj }) => {

        setChatRoomMessages([...chatRoomMessages, messageObj])
        
    },[chatRoomMessages])

    
    // send friend a notification if they are offline
    const handleOfflineMessage = useCallback( async ({ messageObj }) => {

        if(notificationSent) {
            return;
        }
        
        const result = await notifyUser({ variables: {
            friendUsername: friend
        }})

        if(result) {
            setNotificationSent(true)
        }
        
        setChatRoomMessages([...chatRoomMessages, messageObj])
        
    },[friend, notificationSent, setNotificationSent, notifyUser, chatRoomMessages])


    useEffect(() => {

        socket.on("RECEIVED_MESSAGE_IN_ROOM", handleReceivedMessage)
        socket.on("RECEIVED_MESSAGE_OFFLINE", handleOfflineMessage)


        return () => {
            socket.off("RECEIVED_MESSAGE_IN_ROOM", handleReceivedMessage)
            socket.off("RECEIVED_MESSAGE_OFFLINE", handleOfflineMessage)
        }

    },[handleReceivedMessage, handleOfflineMessage, socket])


    // map messages to component elements
    const renderChatRoom = chatRoomMessages.map((details,index) => {

        if(details) {

            const formatTimestamp = new Intl.DateTimeFormat([], {
                timeStyle: "short",
                dateStyle: "short"
            })

            const formattedTimestamp = formatTimestamp.format(new Date(details.timestamp * 1e3))


            return (
                <div key={index}>
                    <div className={details.sender === you ? "message-right" : "message-left"}>
                      <div className="message-item">
                        <p className="message-body">{details.body}</p>
                        <p className="message-time">{`Sent ${formattedTimestamp}`}</p>
                      </div>
                    </div>
                </div>
            )
        }

        return null
    })

    // render component
    return (
        <div className="chat-room">
          <div className="chat-room__header">
            <div className="friend-details">
              <p>Talking to</p>
              <p className="friend-username">{friend ? friend : "No one"}</p>
            </div>
            <div className="user-name">
              <p>Welcome</p>
              <p>{you}</p>
            </div>
            <LogoutButton navigate={navigate}/>
          </div>
          {autoScroll === false ? <p style={{ color: "white", display: "flex", justifyContent: "center"}}>Auto Scroll Disabled</p> : null}
          <div ref={ref} className="chat-room__content">
            {renderChatRoom.length > 0 ? renderChatRoom : null}
          </div>
          <MessageMaker you={you} friend={friend} setChatRoomMessages={setChatRoomMessages}/>
        </div>
    )
}

export default ChatRoom;