const mongoose = require("mongoose");

const User = mongoose.model("chatUsers");

module.exports = (app) => {

    app.get("/api/user", async (req,res) => {

        if(req.isAuthenticated()) {
            const userDetails = await User.findOne({ googleId: req.user.googleId }).lean()

            if(userDetails.currentChat) {
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
                return res.status(200).json({
                    friends: data.friendList,
                    pending: data.pendingFriends,
                    you: req.user.userName,
                    notifications: data.notifications
                })
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
            
            // check user exists
            const data = await User.findOne({ userName: req.body.params.userName }).lean()

            if(data) {

                // check if user in friend list
                const checkFriend = await User.findOne({ googleId: req.user.googleId, friendList: req.body.params.userName }).lean()
                
                // check if user in pending list of other user
                let checkPending = 0
                
                data.pendingFriends.forEach(pending => {
                    if(pending === req.user.userName) {
                        checkPending += 1
                    }
                })

                if(checkPending > 0) {
                    return res.status(304).send("Request already sent.")
                }

                if(checkFriend === undefined || checkFriend === null) {
                    await User.updateOne({ userName: req.body.params.userName}, { $push: { pendingFriends: req.user.userName }})
                    return res.status(201).send("Friend Request Sent.")
                }

                return res.status(304).send("User already a friend.")

            }
        }

        return res.status(403).send("Unauthorised Access")
    })

    
    app.post("/api/acceptFriend", async (req,res) => {

        if(req.isAuthenticated()) {
            
            if(req.body.params.willAccept) {

                const data = await User.findOneAndUpdate({ googleId: req.user.googleId }, { $pull: { pendingFriends: req.body.params.userName }, 
                    $push: { friendList: req.body.params.userName }}, { new: true })

                await User.updateOne({ userName: req.body.params.userName }, { $push: { friendList: req.user.userName }})

                return res.status(201).send(data)
            }

            const data = await User.findOneAndUpdate({ userName: req.user.userName }, 
                { $pull: { pendingFriends: req.body.params.userName }}, { new: true })

            return res.status(201).send(data)
        }

        return res.status(403).send("You shall not pass.")
    })

    
    app.post("/api/updateNotifications", async (req,res) => {

        if(req.isAuthenticated()) {

            const checkIfNotificationExists = await User.findOne({ userName: req.body.params.userName, notifications: req.user.userName }).lean()

            if(checkIfNotificationExists === true) {
                return res.status(200).send("User has already been notified.")
            }

            await User.updateOne({ userName: req.body.params.userName }, { $push: { notifications: req.user.userName }})
            return res.status(201).send("User notified.")
        }
        return res.status(403).send("Unauthorised Access.")
    })


    app.get("/api/logout", async (req,res) => {

        if(req.isAuthenticated()) {

            await User.updateOne({ googleId: req.user.googleId}, { userIsOnline: false })
            req.logout()
            return res.redirect("/")
        }
        
        return res.status(403).send("User is not logged in")
    })
}