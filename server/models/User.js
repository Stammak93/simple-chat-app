const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    googleId: String,
    userName: String,
    userIsOnline: Boolean
})

mongoose.model("chatUsers", userSchema);