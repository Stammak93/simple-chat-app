import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ChatRoom from "./chat-comps/ChatRoom";
//import ChatRoomList from "./chat-comps/ChatRoomList";
import FriendList from "./chat-comps/FriendList";
import Header from "./chat-comps/Header";
import BackgroundStyle from "./BackgroundStyle";



const MainChat = ({ updateLoggedIn }) => {

    const [friendList, setFriendList] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();


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
              <div className="top-div-for-header">
                <Header updateLoggedIn={updateLoggedIn} friendList={friendList} updateFriendList={setFriendList}/>
              </div>
              <div className="div-for-content">
                <FriendList friendList={friendList}/>
                <ChatRoom chatEndpoint={id}/>
              </div>
            </div>
            <BackgroundStyle />
        </div>
    )
}

export default MainChat;