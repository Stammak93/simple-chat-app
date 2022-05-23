import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Login from "./welcome-comps/Login";
import BackgroundStyle from "./BackgroundStyle";


const WelcomeScreen = () => {

    const [loggedIn, setLoggedIn] = useState(null);
    const navigate = useNavigate();


    useEffect(() => {

        const checkUser = async () => {
          
            try {
                const response = await axios.get("/api/user")
          
                if(response.status === 200) {
                    setLoggedIn(true)
                    navigate(`/chat/${response.data}`)
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

    },[navigate])
    
    
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