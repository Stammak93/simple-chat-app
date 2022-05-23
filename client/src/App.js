import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WelcomeScreen from "./components/WelcomeScreen";
import MainChat from "./components/MainChat";
import "./components/WelcomeScreen.css";
import "./components/MainChat.css";


const App = () => {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<WelcomeScreen />}/>
        <Route exact path="/chat/:id" element={<MainChat />}/>
        <Route exact path="/chat" element={<MainChat />} />
        <Route exact path="/auth/google" />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
// use react router to make just the chatroom component render within the main chatroom based on url
