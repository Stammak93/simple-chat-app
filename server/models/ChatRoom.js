const mongoose = require("mongoose");

const ChatRoomSchema = new mongoose.Schema({
    roomId: String,
    users: Array,
    messages: Array
})

mongoose.model("chatrooms", ChatRoomSchema);