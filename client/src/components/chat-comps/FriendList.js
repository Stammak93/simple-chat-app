import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const FriendList = ({ friendList }) => {

    const navigate = useNavigate();

    const clickToCreateChat = async (userName) => {

        const response = await axios.post("/api/createRoom", {
            params: { userName: userName }
        })

        if(response.status === 200 || response.status === 201 ) {
            navigate(`/chat/${response.data.toString()}`)
        }
    }

    const renderFriendList = friendList.map((user,index) => {

        return(
            <div onClick={() => clickToCreateChat(user.userName)} className="user-item" key={index}>
              <p>{user.userName}</p>
              {user.userIsOnline ? <p>Online</p> : <p>Offline</p>}
            </div>
        )
    })

    
    return (
        <div className="user-list">
          <div className="user-list__header">Friend List</div>
          <div className="user-list__content">
            {renderFriendList.length > 0 ? renderFriendList : <p>No friends yet</p>}
          </div>
        </div>
    )
}

export default FriendList;