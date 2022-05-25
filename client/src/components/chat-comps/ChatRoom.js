import React, { useEffect, useState, useContext, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SocketContext } from "../../context/socket";
import axios from "axios";


const ChatRoom = ({ you, setYou, setPageStatus }) => {

    const [chatRoomDetails, setChatRoomDetails] = useState([]);
    const [message, setMessage] = useState("");
    const [friend, setFriend] = useState("");
    const navigate = useNavigate()
    const socket = useContext(SocketContext);
    const { id } = useParams();
    const ref = useRef();


    useEffect(() => {

        const getChatRoom = async () => {

            if(id === undefined) {
                return navigate("/chat/1")
            }

            if(id.length < 8) {
                navigate("/chat/1")
                setPageStatus(200)
                return;
            } 

            const response = await axios.get("/api/chatroom", {
                params: { roomId: id }
            })

            if(response.status === 200) {
                setChatRoomDetails(response.data.room)
                setFriend(response.data.friend)
                socket.emit("REQUEST_JOIN", (id))
            }
        }


        const getChatRoomTimeoutId = setTimeout(() => {
            
            getChatRoom()
        
        },700)

        return () => {
            clearTimeout(getChatRoomTimeoutId)
        }
    
    },[id, navigate, socket, setYou, setPageStatus])


    useEffect(() => {

        if(chatRoomDetails.length > 10) {
            ref.current.lastChild.scrollIntoView();
        }
    })


    // handle user sending message
    const handleSentMessage = useCallback(async(message) => {

        if(message.length < 1) {
            return;
        }

        const timestamp = Math.floor(Date.now()/1000)
        const messageObj = {
            sender: you,
            body: message,
            timestamp: timestamp
        }

        const response = await axios.post("/api/updateRoom", {
            params: { roomId: id, messageObj: messageObj }
        })

        if(response.status === 201) {
            socket.emit("SEND_MESSAGE",({ id, friend, you, messageObj }))
            setChatRoomDetails([...chatRoomDetails, messageObj])
            setMessage("")
        }

    },[id, socket, you, friend, chatRoomDetails])


    const handleReceivedMessage = useCallback(({ messageObj }) => {

        console.log("received message")
        setChatRoomDetails([...chatRoomDetails, messageObj])
        setMessage("")
        ref.current.lastChild.scrollIntoView();
        
    },[chatRoomDetails])


    useEffect(() => {

        socket.on("RECEIVED_MESSAGE_IN_ROOM", handleReceivedMessage)


        return () => {
            socket.off("RECEIVED_MESSAGE_IN_ROOM", handleReceivedMessage)
        }

    },[handleReceivedMessage, socket])


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


    const renderChatRoom = chatRoomDetails.map((details,index) => {

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
            <div>
              <p className="friend-details">{friend}</p>
            </div>
            <div className="header-logout">
              <button className="header-logout__btn" onClick={() => logoutClick()}>Logout</button>
            </div>
          </div>
          <div ref={ref} className="chat-room__content">
            {renderChatRoom.length > 0 ? renderChatRoom : <p>No info yet</p>}
          </div>
          <div className="message-enablers">
            <textarea className="message-input" value={message} onChange={(e) => setMessage(e.target.value)} />
            <button className="message-btn" onClick={() => handleSentMessage(message)}>Send</button>
          </div>
        </div>
    )
}

export default ChatRoom;