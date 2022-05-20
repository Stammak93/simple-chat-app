import React from "react";
import Login from "./Login";
import MainChat from "./MainChat";
import BackgroundStyle from "./BackgroundStyle";


const WelcomeScreen = () => {

    
    
    
    /*return (
        <div className="welcome-page">
          <BackgroundStyle />
          <MainChat />
        </div>
    )*/
    
    
    return (
        <div className="welcome-page">
          <Login />
          <BackgroundStyle />
        </div>
    )

}

export default WelcomeScreen;