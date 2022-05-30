const mongoose = require("mongoose");
const User = mongoose.model("chatUsers");
const chatRoom = mongoose.model("chatrooms");

//let roomId = "103639485481198244387i102438020855541962190"
//let me = "103639485481198244387"
// variables can only be used on client side and
// need to be passed as global variables or
// inline for testing purposes on the backend


const resolvers = {
    Query: {
        User: async () => await User.find({}).lean(),
        userName: async () => {
            const data = await User.findOne({userName: userName}).lean()
            return data.userName
        },
        getUser: async (parent,args,context,info) => {
            let userName = context.user.userName
            const data = await User.findOne({ userName: userName }).lean()
            return data
        },
        getChatRoom: async (parent,args,context,info) => {

            const data = await chatRoom.findOne({ roomId: args.roomId }).lean()

            if(context.user.googleId === args.roomId.split("i")[0]) {
                otherUser = args.roomId.split("i")[1]
            } else {
                otherUser = args.roomId.split("i")[0]
            }

            const friend = await User.findOne({ googleId: otherUser }).lean()

            const dataObj = {
                chatRoom: data,
                friend: friend
            }

            return dataObj
        }
    }

}

module.exports = resolvers;