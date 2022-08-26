const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    googleId: String,
    userName: String,
    friendList: Array,
    pendingFriends: Array,
    notifications: Array
})

mongoose.model("chatUsers", userSchema);