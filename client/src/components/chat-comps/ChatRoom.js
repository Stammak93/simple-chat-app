import React, { useEffect, useState, useContext, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { SocketContext } from "../../context/socket";
import axios from "axios";
import { GET_ROOM, NEW_MESSAGE, NOTIFY_USER } from "../../service/graphql-queries";


const ChatRoom = ({ you, notificationSent, setNotificationSent }) => {

    const [chatRoomMessages, setChatRoomMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [friend, setFriend] = useState("");
    
    const navigate = useNavigate()
    const socket = useContext(SocketContext);
    const { id } = useParams();
    const ref = useRef();
    const refTwo = useRef();
    
    const { loading, error, data } = useQuery(GET_ROOM, {
        variables: {
            roomId: id
        }
    })

    const [newMessage] = useMutation(NEW_MESSAGE)
    const [notifyUser] = useMutation(NOTIFY_USER)


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
        console.log("running this script")
        if(chatRoomMessages.length > 10) {
            ref.current.lastChild.scrollIntoView();
        }
    
    },[chatRoomMessages.length])


    useEffect(() => {

        const sendWithEnter = (e) => {

            if(e.key === "Enter") {
                document.getElementById("send-message").click()
                refTwo.current.blur()
            }
        }

        let textAreaInput = refTwo.current
        textAreaInput.addEventListener("keypress", sendWithEnter)

        return () => {
            textAreaInput.removeEventListener("keypress", sendWithEnter)
        }

    },[])


    // handle user sending message
    // prevent them from sending messages at the main page
    const handleSentMessage = useCallback(async(message) => {

        if(message.length < 1 || id === "1") {
            setMessage("")
            return;
        }

        const timestamp = Math.floor(Date.now()/1000)
        const response = await newMessage({ variables: {
            roomId: id,
            sender: you,
            body: message,
            timestamp: timestamp
        }})
        
        if(response) {
            
            const messageObj = {
                sender: you,
                body: message,
                timestamp: timestamp
            }
    
            socket.emit("SEND_MESSAGE",({ id, friend, you, messageObj }))
            setChatRoomMessages([...chatRoomMessages, messageObj])
            setMessage("")
        }

    },[id, socket, you, friend, chatRoomMessages, newMessage])

    
    // handle user receiving a message event
    const handleReceivedMessage = useCallback(({ messageObj }) => {

        setChatRoomMessages([...chatRoomMessages, messageObj])
        setMessage("")

        if(chatRoomMessages.length > 10) {
            ref.current.lastChild.scrollIntoView();
        }
        
    },[chatRoomMessages])

    
    // send friend a notification if they are offline
    const handleOfflineMessage = useCallback( async () => {

        if(notificationSent) {
            return;
        }
        
        const result = await notifyUser({ variables: {
            friendUsername: friend
        }})

        if(result) {
            setNotificationSent(true)
        }
        
    },[friend, notificationSent, setNotificationSent, notifyUser])


    useEffect(() => {

        socket.on("RECEIVED_MESSAGE_IN_ROOM", handleReceivedMessage)
        socket.on("RECEIVED_MESSAGE_OFFLINE", handleOfflineMessage)


        return () => {
            socket.off("RECEIVED_MESSAGE_IN_ROOM", handleReceivedMessage)
            socket.off("RECEIVED_MESSAGE_OFFLINE", handleOfflineMessage)
        }

    },[handleReceivedMessage, handleOfflineMessage, socket])


    const logoutClick = async () => {
        
        try {
            const response = await axios.get("/api/logout")

            if(response.status === 200) {
                navigate("/")
            }

        } catch {
            console.log("An error has occured.")
        }
    }


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
            <div className="header-logout">
              <button className="header-logout__btn" onClick={() => logoutClick()}>Logout</button>
            </div>
          </div>
          <div ref={ref} className="chat-room__content">
            {renderChatRoom.length > 0 ? renderChatRoom : null}
          </div>
          <div className="message-enablers">
            <textarea ref={refTwo} className="message-input" value={message} onChange={(e) => setMessage(e.target.value)} />
            <button id="send-message" className="message-btn" onClick={() => handleSentMessage(message)}>Send</button>
          </div>
        </div>
    )
}

export default ChatRoom;