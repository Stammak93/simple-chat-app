import React, { useEffect, useState } from "react";
import axios from "axios";
import Login from "./welcome-comps/Login";
import MainChat from "./MainChat";
import BackgroundStyle from "./BackgroundStyle";


const WelcomeScreen = () => {

    const [loggedIn, setLoggedIn] = useState(null);


    useEffect(() => {

        const checkUser = async () => {
          
            try {
                const response = await axios.get("/api/user")
          
                if(response.status === 200) {
                    setLoggedIn(true)
                }
            } catch {
                setLoggedIn(false)
            }
        }

        const checkUserTimeoutId = setTimeout(() => {
            checkUser()
        },700)

        return () => {
            clearTimeout(checkUserTimeoutId)
        }

    },[])
    
    
    if(loggedIn) {
        
        return (
            <div className="welcome-page">
              <BackgroundStyle />
              <MainChat updateLoggedIn={setLoggedIn}/>
            </div>
        )
    }
    
    if(loggedIn === false) {
        return (
            <div className="welcome-page">
              <BackgroundStyle />
              <Login />
            </div>
        )
    }

    return (
        <div>
          Please wait...
        </div>
    )

}

export default WelcomeScreen;