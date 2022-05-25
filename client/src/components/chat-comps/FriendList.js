import React, { useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { SocketContext } from "../../context/socket";
import AddFriendModal from "./AddFriendModal";
import PendingButton from "./PendingButton";


const FriendList = ({ friendList, updateFriendList, pendingFriends, updatePendingFriends, notification, setNotification, you }) => {

    const navigate = useNavigate();
    const [addFriend, setAddFriend] = useState(false);
    const socket = useContext(SocketContext);

    
    const clickToCreateChat = async (userName) => {

        const response = await axios.post("/api/createRoom", {
            params: { userName: userName }
        })

        if(response.status === 200 || response.status === 201 ) {

            let updatedNotifications = notification.filter(notif => notif !== userName)
            setNotification(updatedNotifications)
            navigate(`/chat/${response.data}`)
        }
    }


    const renderFriendList = friendList.map((user,index) => {

        return(
            <div onClick={() => clickToCreateChat(user)} className="user-item" key={index}>
              <p>{user}</p>
              {notification.includes(user) ? <p>New message</p> : null}
            </div>
        )
    })

    
    const handleReceivedFriendRequest = useCallback((requestSender) => {
        console.log("friend request received")

        updatePendingFriends([...pendingFriends, requestSender])
    
    },[pendingFriends, updatePendingFriends])

    
    const handleAcceptedFriendRequest = useCallback((you) => {

        updateFriendList([...friendList, you])
    
    },[updateFriendList, friendList])


    useEffect(() => {

        socket.on("FRIEND_REQUEST_RECEIVED", handleReceivedFriendRequest)
        socket.on("NEW_FRIEND", handleAcceptedFriendRequest)

        return () => {
            socket.off("FRIEND_REQUEST_RECEIVED", handleReceivedFriendRequest)
            socket.off("NEW_FRIEND", handleAcceptedFriendRequest)
        }

    },[handleReceivedFriendRequest, handleAcceptedFriendRequest, socket])

    

    return (
        <div className="user-list">
          <div className="user-list__header">
            <p>Friend List</p>
          </div>
          <div className="add-friend">
            <button onClick={() => setAddFriend(true)} className="add-friend__btn">Add Friend</button>
          </div>
          { pendingFriends.length > 0 ? 
            <PendingButton 
              pendingFriends={pendingFriends}
              updatePendingFriends={updatePendingFriends}
              updateFriendList={updateFriendList}
              you={you}
            /> : null }
          <div className="user-list__content">
            {renderFriendList.length > 0 ? renderFriendList : <p>No friends yet</p>}
          </div>
          { addFriend ? <AddFriendModal friendList={friendList} 
            setAddFriend={setAddFriend} 
            updateFriendList={updateFriendList}
            you={you}/> : null}
        </div>
    )
}

export default FriendList;