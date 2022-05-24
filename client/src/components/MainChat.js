import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext, socket } from "../context/socket";
import axios from "axios";
import ChatRoom from "./chat-comps/ChatRoom";
import FriendList from "./chat-comps/FriendList";
// import BackgroundStyle from "./BackgroundStyle";



const MainChat = () => {

    const [friendList, setFriendList] = useState([]);
    const [pendingFriends, setPendingFriends] = useState([]);
    const [notification, setNotification] = useState([]);
    const [you, setYou] = useState("");
    const navigate = useNavigate();


    useEffect(() => {
        
        
        const getFriendList = async () => {

            try {
                const response = await axios.get("/api/friendlist")

                if(response.status === 200) {
                    console.log(response.data)
                    setFriendList(response.data.friends)
                    setPendingFriends(response.data.pending)
                    setYou(response.data.you)
                    socket.emit("IDENTIFY_SOCKET", (response.data.you))
                }
            
            } catch {
                navigate("/")
            }
        }

        const getUserListTimeoutId = setTimeout(() => {
            
            getFriendList()
        
        },700)

        return () => {
            clearTimeout(getUserListTimeoutId)
        }

    },[navigate])


    const handleMessageReceived = useCallback(({ newSender }) => {

        setNotification([...notification, newSender])
    
    },[notification])

    
    const handleConnection = useCallback(() => {

        if(you) {
            socket.emit("IDENTIFY_SOCKET", (you))
        }
    },[you])

    
    useEffect(() => {
        
        socket.on("RECEIVED_MESSAGE_AWAY", handleMessageReceived)
        socket.on("IDENTIFY_YOURSELF", handleConnection)

        return () => {
            socket.off("RECEIVED_MESSAGE_AWAY", handleMessageReceived)
            socket.off("IDENTIFY_YOURSELF", handleConnection)
        }
    })



    return (
        <div className="chat-page">
            <div className="main-chat rise">
              <div className="div-for-content">
                <FriendList 
                  friendList={friendList} 
                  updateFriendList={setFriendList}
                  pendingFriends={pendingFriends}
                  updatePendingFriends={setPendingFriends}
                  notification={notification}
                  setNotification={setNotification}
                />
                <SocketContext.Provider value={socket}>
                  <ChatRoom you={you} setYou={setYou}/>
                </SocketContext.Provider>
              </div>
            </div>
        </div>
    )
}

export default MainChat;