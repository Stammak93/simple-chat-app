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

    app.get("/api/logout", async (req,res) => {

        if(req.isAuthenticated()) {

            await User.updateOne({ googleId: req.user.googleId}, { userIsOnline: false })
            req.logout()
            return res.redirect("/")
        }
        
        return res.status(403).send("User is not logged in")
    })
}