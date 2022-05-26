import React, { useCallback, useContext } from "react";
import axios from "axios";
import { SocketContext } from "../../context/socket";


const AcceptRequest = ({ pendingFriends, updatePendingFriends, updateFriendList, you }) => {


    const socket = useContext(SocketContext);


    const handleAcceptClick = useCallback(async (userName) => {
        
        const response = await axios.post("/api/acceptFriend", {
            params: { willAccept: true, userName: userName }
        })

        if(response.status === 201) {

            if(response.data.pendingFriends === undefined || response.data.pendingFriends === null) {
                updatePendingFriends([])
                updateFriendList(response.data.friendList)
                socket.emit("FRIEND_REQUEST_ACCEPTED", ({ userName, you }))
            } else {
                updatePendingFriends(response.data.pendingFriends)
                updateFriendList(response.data.friendList)
                socket.emit("FRIEND_REQUEST_ACCEPTED", ({ userName, you }))
            }
        }

    },[updateFriendList, updatePendingFriends, socket, you])


    const handleDeclineClick = useCallback(async (userName) => {

        const response = await axios.post("/api/acceptFriend", {
            params: { willAccept: false, userName: userName }
        })

        if(response.status === 201) {
            updatePendingFriends(response.data.pendingFriends)
        }
    
    },[updatePendingFriends])
    
    
    const renderPendingList = pendingFriends.map((friend, index) => {


        return (
            <div key={index} className="pending-item">
              <div>
                <p>{friend}</p>
              </div>
              <div className="pending-btns">
                <button className="pending-btn" onClick={() => handleAcceptClick(friend)}>Accept</button>
                <button className="pending-btn" onClick={() => handleDeclineClick(friend)}>Decline</button>
              </div>
            </div>
        )
    })


    console.log("accept request rendering")
    return (
        <div className="pending-friend-list">
          {renderPendingList}
        </div>
    )
}

export default AcceptRequest;