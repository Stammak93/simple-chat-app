const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const cookieSession = require("cookie-session");
const keys = require("./config/dev");
require("./models/ChatRoom");
require("./models/User");
require("./services/passport");


mongoose.connect(keys.mongoURI);
const app = express();
//const server = require("http").createServer(app);
//require("./services/socket")(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    cookieSession({
        maxAge: 24 * 60 * 60 * 1000,
        keys: [keys.cookieKey]
    })
)

app.use(passport.initialize());
app.use(passport.session());

// add routes here with require(something)(app)
require("./routes/authRoutes")(app);
require("./routes/userRoutes")(app);
require("./routes/roomRoutes")(app);


if(process.env.NODE_ENV === "production") {

    app.use(express.static("client/build"))

    const path = require("path");
    app.get("*", (req,res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
    })
}


const PORT = process.env.PORT || 5000;
app.listen(PORT);
//server.listen(PORT);