import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AddFriendModal from "./AddFriendModal";

const Header = ({ friendList, updateFriendList }) => {

    const [addFriend, setAddFriend] = useState(false);
    const navigate = useNavigate();

    
    const logoutClick = async () => {
        
        try {
            const response = await axios.get("/api/logout")

            if(response.status === 200) {
                navigate("/")
            }

        } catch {
            console.log("An error has occured.")
        }
    }
  
  
    return (
        <div className="header">
          <div>Something, maybe a logo or app title</div>
          <div className="header-right">
            <div className="add-friend">
                <button onClick={() => setAddFriend(true)} className="add-friend__btn">Add Friend</button>
            </div>
            <div className="header-logout">
                <button className="header-logout__btn" onClick={() => logoutClick()}>Logout</button>
            </div>
          </div>
          {addFriend ? <AddFriendModal friendList={friendList} 
              setAddFriend={setAddFriend} 
              updateFriendList={updateFriendList}/> : null}
        </div>
    )
}

export default Header;