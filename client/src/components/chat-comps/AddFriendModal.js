import React, { useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";


const AddFriendModal = ({ friendList, setAddFriend, updateFriendList }) => {

    const [friendToAdd, setFriendToAdd] = useState("");



    const userAddClick = async () => {

        let friendExists = 0
        friendList.forEach((friend) => {
            if(friend.userName === friendToAdd) {
                console.log("Already in friend list.")
                friendExists += 1
            }
        })
    
        if(friendExists > 0) {
            setFriendToAdd("")
            return;
        }
        
        if(!friendToAdd) {
            setFriendToAdd("")
            return;
        }
    
        try {
    
            const response = await axios.post("/api/addFriend", {
                params: { userName: friendToAdd }
            })
    
            if(response.status === 201) {
                updateFriendList(Object.values(response.data))
                setAddFriend(false)
                friendToAdd("")
                return;
            }
    
        } catch {
              console.log("I need to work on this.")
        }
    
    }


    return ReactDOM.createPortal(
        <div className="add-friend__modal-container">
          <div className="add-friend__modal">
            <div className="add-friend__modal-title">
                <h1>Add a Friend</h1>
            </div>
            <div className="add-friend__modal-input">
                <input onChange={(e) => setFriendToAdd(e.target.value)} 
                type="text" 
                value={friendToAdd}
                >
                </input>
            </div>
            <div className="add-friend__modal-btns">
                <div className="add-friend__modal-btn">
                    <button onClick={() => userAddClick()}>Confirm</button>
                </div>
                <div className="add-friend__modal-btn">
                    <button onClick={() => setAddFriend(false)}>Cancel</button>
                </div>
            </div>
          </div>
        </div>,
        document.getElementById("modal")
    )
}

export default AddFriendModal;