import React, { useContext, useState } from "react";
import ReactDOM from "react-dom";
import { useMutation } from "@apollo/client";
import { ADD_USER } from "../../service/graphql-queries";
import { SocketContext } from "../../context/socket";


const AddFriendModal = ({ friendList, setAddFriend, you }) => {

    const [friendToAdd, setFriendToAdd] = useState("");
    const socket = useContext(SocketContext);
    const [addUser] = useMutation(ADD_USER);


    const userAddClick = async () => {

        let friendExists = 0
        friendList.forEach((friend) => {
            if(friend === friendToAdd) {
                friendExists += 1
            }
        })
    
        
        if(friendExists > 0 || friendToAdd === you || !friendToAdd) {
            setFriendToAdd("")
            return;
        }

        const response = await addUser({ variables: {
            friendUsername: friendToAdd
        }})

        if(response) {
            
            let requestSender = you
            socket.emit("FRIEND_REQUEST_SENT", ({ friendToAdd, requestSender}))
            setAddFriend(false)
            setFriendToAdd("")
        }

    
        /*try {
    
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
        }*/
    
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