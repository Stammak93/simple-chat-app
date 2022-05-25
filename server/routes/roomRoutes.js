const mongoose = require("mongoose");

const User = mongoose.model("chatUsers");
const ChatRoom = mongoose.model("chatrooms");


module.exports = (app) => {

    
    app.post("/api/createRoom", async (req,res) => {

        if(req.isAuthenticated()) {

            if(req.body.params.updateNotifications === true) {
                await User.updateOne({ googleId: req.user.googleId }, 
                    { $pull: { notifications: req.body.params.userName}})
            }

            document = await User.findOne({ userName: req.body.params.userName }).lean()
            let roomId = `${req.user.googleId}i${document.googleId}`
            let roomIdTwo = `${document.googleId}i${req.user.googleId}`

            const data = await ChatRoom.findOne({ roomId: roomId }).lean()
            const dataTwo = await ChatRoom.findOne({ roomId: roomIdTwo }).lean()

            if(data) {
                return res.status(200).send(roomId)
            }

            if(dataTwo) {
                return res.status(200).send(roomIdTwo)
            }

            await new ChatRoom({ roomId: roomId, messages: [] }).save()

            return res.status(201).send(roomId)
        }

        return res.status(403).send("You shall not pass!")
    })

    app.get("/api/chatroom", async (req,res) => {

        if(req.isAuthenticated()) {

            if(req.user.googleId === req.query.roomId.split("i")[0] || req.user.googleId === req.query.roomId.split("i")[1]) {

                let otherUser;
                const chatRoom = await ChatRoom.findOne({ roomId: req.query.roomId }).lean()

                if(req.user.googleId === req.query.roomId.split("i")[0]) {
                    otherUser = req.query.roomId.split("i")[1]
                } else {
                    otherUser = req.query.roomId.split("i")[0]
                }

                const friend = await User.findOne({ googleId: otherUser }).lean()
                
                if(chatRoom) {

                    return res.status(200).json({
                        you: req.user.userName,
                        room: chatRoom.messages,
                        friend: friend.userName
                    })
                }

                return res.status(204).send("No data yet")
            }
            
            return res.status(403).send("Unauthorized Access")
        }

        return res.status(403).send("Unauthorised Access")
    })

    app.post("/api/updateRoom", async (req,res) => {

        if(req.isAuthenticated()) {

            await ChatRoom.updateOne({ roomId: req.body.params.roomId }, { $push: { messages: req.body.params.messageObj}})

            return res.status(201).send("New message added")
        }

        return res.status(403).send("Unauthorised Access")
    })
}