
module.exports = (server) => {

    const io = require("socket.io")(server, {
        cors: {
            origin: "*"
        }
    })


    io.on("connection", (socket) => {
        
        io.to(socket.id).emit("IDENTIFY_YOURSELF")

        
        socket.on("IDENTIFY_SOCKET", (you) => {

            if(you) {
                console.log("user identified", you)
                socket.join(you)
            }
        })

        socket.on("REQUEST_JOIN", (id) => {
            socket.join(id)
        })

        socket.on("SEND_MESSAGE", ({ id, friend, you, messageObj }) => {

            try {
                if(io.sockets.adapter.rooms.get(id).size === 2) {
                    
                    socket.to(friend).emit("RECEIVED_MESSAGE_IN_ROOM", ({ messageObj }))
                
                } else if(io.sockets.adapter.rooms.get(friend)) {
                    
                    let newSender = you
                    io.to(friend).emit("RECEIVED_MESSAGE_AWAY", ({ newSender }))
                
                } else {
                    
                    io.to(you).emit("RECEIVED_MESSAGE_OFFLINE")
                }

            } catch {
                console.log("An error has occured")
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