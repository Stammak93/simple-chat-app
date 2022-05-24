
module.exports = (server) => {

    const io = require("socket.io")(server, {
        cors: {
            origin: "*"
        }
    })


    io.on("connection", (socket) => {
        console.log("welcome to Chaturbate", socket.id)
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
                    socket.broadcast.to(friend).emit("RECEIVED_MESSAGE_IN_ROOM", ({ messageObj }))
                } else {
                    let newSender = you
                    io.to(friend).emit("RECEIVED_MESSAGE_AWAY", ({ newSender }))
                }
            } catch {
                console.log("An error has occured")
            }
        })
    })

}