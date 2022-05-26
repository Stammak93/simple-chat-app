import React, { useContext, useState } from "react";
import ReactDOM from "react-dom";
import { SocketContext } from "../../context/socket";
import axios from "axios";


const AddFriendModal = ({ friendList, setAddFriend, you }) => {

    const [friendToAdd, setFriendToAdd] = useState("");
    const socket = useContext(SocketContext);


    const userAddClick = async () => {

        let friendExists = 0
        friendList.forEach((friend) => {
            if(friend === friendToAdd) {
                friendExists += 1
            }
        })
    
        if(friendExists > 0) {
            setFriendToAdd("")
            return;
        }
        
        if(!friendToAdd) {
            return;
        }
    
        try {
    
            const response = await axios.post("/api/addFriend", {
                params: { userName: friendToAdd }
            })
    
            if(response.status === 201) {

                let requestSender = you
                socket.emit("FRIEND_REQUEST_SENT", ({ friendToAdd, requestSender}))
                setAddFriend(false)
                friendToAdd("")
            }
    
        } catch {
              return;
        }
    
    }

    console.log("modal rendering")
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