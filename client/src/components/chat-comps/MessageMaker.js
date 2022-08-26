import { useEffect, useState, useContext, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { SocketContext } from "../../context/socket";
import { NEW_MESSAGE } from "../../service/graphql-queries";


const MessageMaker = ({ you, friend, setChatRoomMessages }) => {

    const [message, setMessage] = useState("");

    const socket = useContext(SocketContext);
    const { id } = useParams();
    const ref = useRef();

    const [newMessage] = useMutation(NEW_MESSAGE); // graphql

    
    useEffect(() => {
        
        const sendWithEnter = (e) => {

            if(e.key === "Enter") {
                document.getElementById("send-message").click()
                ref.current.blur()
            }
        }

        let textAreaInput = ref.current;
        textAreaInput.addEventListener("keypress", sendWithEnter);

        return () => {
            textAreaInput.removeEventListener("keypress", sendWithEnter);
        }

    })


    // handle user sending message
    // prevent them from sending messages at the main page
    const handleSentMessage = useCallback(async(message) => {

        if(message.length < 1 || id === "1") {
            setMessage("")
            return;
        }

        const timestamp = Math.floor(Date.now()/1000)
        const response = await newMessage({ variables: {
            roomId: id,
            sender: you,
            body: message,
            timestamp: timestamp
        }})
        
        if(response) {
            
            const messageObj = {
                sender: you,
                body: message,
                timestamp: timestamp
            }
    
            // setChatRoomMessages([...chatRoomMessages, messageObj])
            setMessage("")
            socket.emit("SEND_MESSAGE",({ id, friend, you, messageObj }))
        }

    },[id, socket, you, friend, newMessage])



    return (
        <div className="message-enablers">
            <textarea ref={ref} className="message-input" value={message} onChange={(e) => setMessage(e.target.value)} />
            <button id="send-message" className="message-btn" onClick={() => handleSentMessage(message)}>Send</button>
        </div>
    )
};

export default MessageMaker;