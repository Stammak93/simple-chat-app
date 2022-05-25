const mongoose = require("mongoose");

const ChatRoomSchema = new mongoose.Schema({
    roomId: String,
    messages: Array
})

mongoose.model("chatrooms", ChatRoomSchema);