
module.exports = (server) => {

    const io = require("socket.io")(server, {
        cors: {
            origin: "*"
        }
    })


    io.on("connection", (socket) => {
        
        io.to(socket.id).emit("IDENTIFY_YOURSELF")
        
        // attempt to join room on connect
        socket.on("IDENTIFY_SOCKET", ({ theClient, id}) => {

            if(theClient) {

                socket.join(theClient)
                if (id !== undefined && id !== "1") {
                    socket.join(id)
                }
            }
        })

        // attempt to join room on render of new chat room 
        socket.on("REQUEST_JOIN", (id) => {
            socket.join(id)
        })

        socket.on("SEND_MESSAGE", ({ id, friend, you, messageObj }) => {

            try {
                if(io.sockets.adapter.rooms.get(id).size === 2) {

                    io.to(id).emit("RECEIVED_MESSAGE_IN_ROOM", ({ messageObj })) // was friend not id

                } else if(io.sockets.adapter.rooms.get(friend)) {
                    
                    let newSender = you
                    io.to(friend).emit("RECEIVED_MESSAGE_AWAY", ({ newSender }))
                
                } else {
                    
                    io.to(you).emit("RECEIVED_MESSAGE_OFFLINE", ({ messageObj }))
                }

            } catch {
                console.log("An error has occured while sending a message")
            }
        })

        socket.on("FRIEND_REQUEST_SENT", ({ friendToAdd, requestSender }) => {

            io.to(friendToAdd).emit("FRIEND_REQUEST_RECEIVED", (requestSender))
        })

        socket.on("FRIEND_REQUEST_ACCEPTED", ({ userName, you }) => {
            io.to(userName).emit("NEW_FRIEND", (you))
        })
    })

}