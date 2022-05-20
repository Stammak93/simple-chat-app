const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    googleId: String,
    userName: String
})

mongoose.model("users", UserSchema);