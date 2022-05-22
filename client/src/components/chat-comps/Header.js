import React from "react";
import axios from "axios";

const Header = ({  updateLoggedIn }) => {

    const logoutClick = async () => {
        
        try {
            const response = await axios.get("/api/logout")

            if(response.status === 200) {
                updateLoggedIn(false)
            }

        } catch {
            console.log("An error has occured.")
        }
    }
  
  
    return (
        <div className="header">
          <div>Something, maybe a logo or app title</div>
          <div className="header-logout">
            <button className="header-logout__btn" onClick={() => logoutClick()}>Logout</button>
          </div>
        </div>
    )
}

export default Header;