import React, { useEffect, useState } from "react";
import axios from "axios";


const ChatRoom = ({ chatEndpoint }) => {

    const [chatRoomDetails, setChatRoomDetails] = useState([]);


    useEffect(() => {

        const getChatRoom = async () => {

            if(chatEndpoint.length < 10) {
                return console.log("not a room")
            } 

            const response = await axios.get("/api/chatroom", {
                params: { roomId: chatEndpoint }
            })

            if(response.status === 200) {
                setChatRoomDetails(response.data.messages)
            }
        }

        const getChatRoomTimeoutId = setTimeout(() => {
            getChatRoom()
        },700)

        return () => {
            clearTimeout(getChatRoomTimeoutId)
        }
    
    },[chatEndpoint])

    
    const renderChatRoom = chatRoomDetails.map(details => {

        return(
            <div>
                <p>{details}</p>
            </div>
        )
    })


    return (
        <div className="chat-room">
          <div className="chat-room__header">Talking to...</div>
          <div className="chat-room__content">
            {renderChatRoom.length > 0 ? renderChatRoom : <p>No info yet</p>}
          </div>
        </div>
    )
}

export default ChatRoom;