import React, { useCallback } from "react";
import axios from "axios";


const AcceptRequest = ({ pendingFriends, updatePendingFriends, updateFriendList }) => {


    const handleAcceptClick = useCallback(async (userName) => {
        
        const response = await axios.post("/api/acceptFriend", {
            params: { willAccept: true, userName: userName }
        })

        if(response.status === 201) {

            if(response.data.pendingFriends === undefined || response.data.pendingFriends === null) {
                updatePendingFriends([])
                updateFriendList(response.data.friendList)
            } else {
                updatePendingFriends(response.data.pendingFriends)
                updateFriendList(response.data.friendList)
            }
        }

    },[updateFriendList, updatePendingFriends])


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



    return (
        <div className="pending-friend-list">
          {renderPendingList}
        </div>
    )
}

export default AcceptRequest;