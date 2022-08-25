import { createContext }from "react";
import socketio from "socket.io-client";

let projUrl;

if(process.env.NODE_ENV === "production") {
    projUrl = "https://stammak-chat.herokuapp.com/"
} else {
    projUrl = "http://localhost:5000"
}


export const socket = socketio.connect(projUrl);
export const SocketContext = createContext();