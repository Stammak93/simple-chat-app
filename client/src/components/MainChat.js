import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext, socket } from "../context/socket";
import axios from "axios";
import ChatRoom from "./chat-comps/ChatRoom";
//import ChatRoomList from "./chat-comps/ChatRoomList";
import FriendList from "./chat-comps/FriendList";
//import Header from "./chat-comps/Header";
// import BackgroundStyle from "./BackgroundStyle";



const MainChat = ({ updateLoggedIn }) => {

    const [friendList, setFriendList] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
        
        console.log("calling to get rooms")
        
        const getFriendList = async () => {

            try {
                const response = await axios.get("/api/friendlist")

                if(response.status === 200) {
                    setFriendList(Object.values(response.data.friendList))
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
                <FriendList friendList={friendList} updateFriendList={setFriendList}/>
                <SocketContext.Provider value={socket}>
                  <ChatRoom />
                </SocketContext.Provider>
              </div>
            </div>
        </div>
    )
}

export default MainChat;

/*               <div className="top-div-for-header">
                <Header updateLoggedIn={updateLoggedIn}/>
              </div> 
              
              
              
              <BackgroundStyle />*/