import React, { useCallback, useContext } from "react";
import { useMutation } from "@apollo/client";
import { ACCEPT_FRIEND } from "../../service/graphql-queries";
import { SocketContext } from "../../context/socket";


const AcceptRequest = ({ pendingFriends, updatePendingFriends, updateFriendList, you }) => {


    const socket = useContext(SocketContext);
    const [acceptFriend] = useMutation(ACCEPT_FRIEND)



    const handleAcceptClick = useCallback(async (userName) => {
        
        
        const response = await acceptFriend({ variables: {
            willAccept: true,
            friendUsername: userName
        }})
        
        if(response) {
            updatePendingFriends(response.data.acceptFriend.pendingFriends)
            updateFriendList(response.data.acceptFriend.friendList)
            socket.emit("FRIEND_REQUEST_ACCEPTED", ({ userName, you }))
        }

    },[acceptFriend, updateFriendList, updatePendingFriends, socket, you])


    const handleDeclineClick = useCallback(async (userName) => {

        const response = await acceptFriend({ variables: {
            willAccept: false,
            friendUsername: userName
        }})
        
        if(response) {
            updatePendingFriends(response.data.acceptFriend.pendingFriends)
        }
    
    },[acceptFriend, updatePendingFriends])
    
    
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