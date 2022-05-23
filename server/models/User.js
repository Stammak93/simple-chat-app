const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    googleId: String,
    userName: String,
    userIsOnline: Boolean,
    friendList: Array,
    currentChat: String
})

mongoose.model("chatUsers", userSchema);