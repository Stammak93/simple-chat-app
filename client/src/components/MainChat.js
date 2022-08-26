import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { SocketContext, socket } from "../context/socket";
import ChatRoom from "./chat-comps/ChatRoom";
import FriendList from "./chat-comps/FriendList";
import { GET_USER } from "../service/graphql-queries";


const MainChat = () => {

    const [friendList, setFriendList] = useState([]);
    const [pendingFriends, setPendingFriends] = useState([]);
    const [notification, setNotification] = useState([]);
    const [you, setYou] = useState("");
    const [pageStatus, setPageStatus] = useState(null);
    const [notificationSent, setNotificationSent] = useState(false);
    
    const { id } = useParams();
    const { loading, error, data } = useQuery(GET_USER);


    useEffect(() => {
        
        if(error) {
            setPageStatus(404)
        }

        if(data) {
            
            const theClient = data.getUser.userName
            setFriendList(data.getUser.friendList)
            setPendingFriends(data.getUser.pendingFriends)
            setYou(data.getUser.userName)
            setNotification(data.getUser.notifications)
            setPageStatus(200)
            socket.emit("IDENTIFY_SOCKET", ({ theClient, id }))
        }

    },[data, error, id])


    const handleMessageReceived = useCallback(({ newSender }) => {

        setNotification([...notification, newSender])
        setNotificationSent(true)
    
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
                        <ChatRoom 
                            you={you} 
                            notification={notification}
                            notificationSent={notificationSent}
                            setNotificationSent={setNotificationSent}
                        />
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