import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AddFriendModal from "./AddFriendModal";
import PendingButton from "./PendingButton";


const FriendList = ({ friendList, updateFriendList, pendingFriends, updatePendingFriends }) => {

    const navigate = useNavigate();
    const [addFriend, setAddFriend] = useState(false);

    
    const clickToCreateChat = async (userName) => {

        const response = await axios.post("/api/createRoom", {
            params: { userName: userName }
        })

        if(response.status === 200 || response.status === 201 ) {
            navigate(`/chat/${response.data}`)
        }
    }


    const renderFriendList = friendList.map((user,index) => {

        return(
            <div onClick={() => clickToCreateChat(user)} className="user-item" key={index}>
              <p>{user}</p>
            </div>
        )
    })
    

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
            /> : null }
          <div className="user-list__content">
            {renderFriendList.length > 0 ? renderFriendList : <p>No friends yet</p>}
          </div>
          { addFriend ? <AddFriendModal friendList={friendList} 
            setAddFriend={setAddFriend} 
            updateFriendList={updateFriendList}/> : null}
        </div>
    )
}

export default FriendList;