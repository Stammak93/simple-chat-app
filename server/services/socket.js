

module.exports = (server) => {

    const io = require("socket.io")(server, {
        cors: {
            origin: "*"
        }
    })


    io.on("connection", (socket) => {
        console.log("welcome to Chaturbate", socket.id)

        
        socket.on("REQUEST_JOIN", (id) => {
            socket.join(id)
        })

        socket.on("SEND_MESSAGE", ({ id, messageObj }) => {
            io.to(id).emit("RECEIVED_MESSAGE", ({ messageObj }))
        })
    })

}