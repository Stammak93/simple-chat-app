import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext, socket } from "../context/socket";
import axios from "axios";
import ChatRoom from "./chat-comps/ChatRoom";
import FriendList from "./chat-comps/FriendList";


const MainChat = () => {

    const [friendList, setFriendList] = useState([]);
    const [pendingFriends, setPendingFriends] = useState([]);
    const [notification, setNotification] = useState([]);
    const [you, setYou] = useState("");
    const [pageStatus, setPageStatus] = useState(null);
    const navigate = useNavigate();


    useEffect(() => {
        
        
        const getFriendList = async () => {

            try {
                const response = await axios.get("/api/friendlist")

                if(response.status === 200) {

                    setFriendList(response.data.friends)
                    setPendingFriends(response.data.pending)
                    setYou(response.data.you)
                    setNotification(response.data.notifications)
                    setPageStatus(200)
                    socket.emit("IDENTIFY_SOCKET", (response.data.you))
                }
            
            } catch {
                setPageStatus(404)
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


    if(pageStatus === 200) {
        
        return (
            <div className="chat-page">
                <div className="main-chat rise">
                  <div className="div-for-content">
                    <SocketContext.Provider value={socket}>
                        <FriendList 
                        friendList={friendList} 
                        updateFriendList={setFriendList}
                        pendingFriends={pendingFriends}
                        updatePendingFriends={setPendingFriends}
                        notification={notification}
                        setNotification={setNotification}
                        you={you}
                        />
                        <ChatRoom you={you} setYou={setYou} setPageStatus={setPageStatus}/>
                    </SocketContext.Provider>
                  </div>
                </div>
            </div>
        )
    }

    if(pageStatus === 404) {
        return (
            <div>An error has occured.</div>
        )
    }

    return (
        <div>Please wait...</div>
    )
}

export default MainChat;