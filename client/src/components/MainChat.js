import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext, socket } from "../context/socket";
import axios from "axios";
import ChatRoom from "./chat-comps/ChatRoom";
import FriendList from "./chat-comps/FriendList";
// import BackgroundStyle from "./BackgroundStyle";



const MainChat = () => {

    const [friendList, setFriendList] = useState([]);
    const [pendingFriends, setPendingFriends] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
        
        
        const getFriendList = async () => {

            try {
                const response = await axios.get("/api/friendlist")

                if(response.status === 200) {
                    setFriendList(response.data.friendList)
                    setPendingFriends(response.data.pendingFriends)
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


    return (
        <div className="chat-page">
            <div className="main-chat rise">
              <div className="div-for-content">
                <FriendList 
                  friendList={friendList} 
                  updateFriendList={setFriendList}
                  pendingFriends={pendingFriends}
                  updatePendingFriends={setPendingFriends}
                />
                <SocketContext.Provider value={socket}>
                  <ChatRoom />
                </SocketContext.Provider>
              </div>
            </div>
        </div>
    )
}

export default MainChat;