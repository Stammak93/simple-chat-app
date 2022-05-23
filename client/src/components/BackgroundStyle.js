import React from "react";
import backgroundOne from "../images/backgrounds/background-img.jpg";
import wave from "../images/backgrounds/bg-waves.svg";


const BackgroundStyle = () => {

    return (
        <div className="background-image">
          <img src={backgroundOne} alt="pink and blue gradient"></img>
          <img className="wave-img" src={wave} alt="white wave"></img>
        </div>
    )
}

export default BackgroundStyle;