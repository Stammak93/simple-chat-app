import React from "react";
import backgroundOne from "../images/backgrounds/backgroundOne.jpg";
import wave from "../images/backgrounds/blob-haikei-two.svg";


const BackgroundStyle = () => {

    return (
        <div className="background-image">
          <img src={backgroundOne} alt="pink and blue gradient"></img>
          <img className="wave-img" src={wave} alt="white wave"></img>
        </div>
    )
}

export default BackgroundStyle;