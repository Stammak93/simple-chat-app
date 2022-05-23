import React from "react";
import backgroundTwo from "../images/backgrounds/background-img-two.jpg";
import wave from "../images/backgrounds/bg-waves.svg";


const BackgroundStyle = () => {

    return (
        <div className="background-image">
          <img src={backgroundTwo} alt="pink and blue gradient"></img>
          <img className="wave-img" src={wave} alt="white wave"></img>
        </div>
    )
}

export default BackgroundStyle;