import React from "react";
import ChatRoom from "./chat-comps/ChatRoom";
import ChatRoomList from "./chat-comps/ChatRoomList";
import OnlineUserList from "./chat-comps/OnlineUserList";
import Header from "./chat-comps/Header";


const MainChat = ({ updateLoggedIn }) => {

    return (
        <div className="main-chat rise">
            <div className="top-div-for-header">
              <Header updateLoggedIn={updateLoggedIn}/>
            </div>
            <div className="div-for-content">
                <ChatRoomList />
                <ChatRoom />
                <OnlineUserList />
            </div>
        </div>
    )
}

export default MainChat;