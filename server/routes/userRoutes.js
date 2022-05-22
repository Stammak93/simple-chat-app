
module.exports = (app) => {

    app.get("/api/user", (req,res) => {

        if(req.isAuthenticated()) {
            return res.status(200).send("User is logged in")
        }

        return res.status(403).send("User is not logged in")
    })

    app.get("/api/logout", (req,res) => {

        if(req.isAuthenticated()) {
            
            req.logOut()
            return res.redirect("/")
        }
        
        return res.status(400).send("User is not logged in")
    })
}