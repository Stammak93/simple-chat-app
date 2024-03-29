const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const cookieSession = require("cookie-session");
const keys = require("./config/keys");
require("./models/ChatRoom");
require("./models/User");
require("./services/passport");
const graphServer = require("./services/graphql");

const PORT = process.env.PORT || 5000;
mongoose.connect(keys.mongoURI);
const app = express();
const server = require("http").createServer(app);
require("./services/socket")(server);

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

// add routes here with require(/pathsroute)(app)
require("./routes/authRoutes")(app);
require("./routes/userRoutes")(app);


if(process.env.NODE_ENV === "production") {


    app.use(express.static("client/build"))

    const path = require("path");
    app.get("*", (req,res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
    })
}


const setupGraphQl = async (graphServer, app, server) => {
    await graphServer.start()
    graphServer.applyMiddleware({ app })
    await new Promise(resolve => server.listen({ port: PORT }, resolve))
    console.log("server started", graphServer.graphqlPath)
}

setupGraphQl(graphServer,app,server);