import React from "react";
import wave from "../images/backgrounds/bg-waves.svg";


const BackgroundStyle = () => {

    return (
        <div className="background-image">
          <img className="wave-img" src={wave} alt="white wave"></img>
        </div>
    )
}

export default BackgroundStyle;