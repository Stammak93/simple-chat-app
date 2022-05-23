const mongoose = require("mongoose");

const User = mongoose.model("chatUsers");

module.exports = (app) => {

    app.get("/api/user", async (req,res) => {

        if(req.isAuthenticated()) {
            const userDetails = await User.findOne({ googleId: req.user.googleId }).lean()

            if(userDetails.currentChat !== "") {
                return res.status(200).send(userDetails.currentChat)
            }

            return res.status(200).send("1")
        }

        return res.status(403).send("User is not logged in")
    })

    // move this into the check if user online call
    app.get("/api/friendlist", async (req,res) => {

        if(req.isAuthenticated()) {
            const data = await User.findOne({ googleId: req.user.googleId }).lean()

            if(data) {
                return res.status(200).send(data)
            }

            return res.status(204).send("No conversations created yet")
        }
        
        return res.status(403).send("Unauthorized Access")
    })

    app.post("/api/addFriend", async (req,res) => {

        if(req.isAuthenticated()) {

            if(req.user.userName === req.body.params.userName) {
                return res.status(400).send("You cannot add yourself as a friend.")
            }

            const data = await User.findOne({ userName: req.body.params.userName }).lean()

            if(data) {

                // I will try first by checking the state of the friendList on the client side 
                /*const userExists = await User.findOne({ googleId: req.user.googleId, 
                    friendList: { googleId: data.googleId }}).lean()

                if(userExists) {
                    return res.status(304).send("User already in friend list.")
                }*/

                const newFriendList = await User.findOneAndUpdate({ googleId: req.user.googleId}, { $push: { friendList: data }}, {
                    new: true
                })

                return res.status(201).send(newFriendList.friendList)
            }
        }
    })


    app.get("/api/logout", async (req,res) => {

        if(req.isAuthenticated()) {
            
            await User.updateOne({ googleId: req.user.googleId}, { userIsOnline: false })
            req.logout()
            return res.redirect("/")
        }
        
        return res.status(400).send("User is not logged in")
    })
}