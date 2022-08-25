const mongoose = require("mongoose");
const User = mongoose.model("chatUsers");
const ChatRoom = mongoose.model("chatrooms");


const resolvers = {
    Query: {
        getUser: async (parent,args,context,info) => {

            if(context) {
                
                let userName = context.user.userName
                const data = await User.findOne({ userName: userName }).lean()
                return data
            }
        },
        getChatRoom: async (parent,args,context,info) => {

            if(context) {
                const data = await ChatRoom.findOne({ roomId: args.roomId }).lean()

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
    },
    Mutation: {
        newMessage: async (parent,args,context,info) => {

            if(context) {

                const messageObj = {
                    sender: args.sender,
                    body: args.body,
                    timestamp: args.timestamp
                }

                await ChatRoom.updateOne({ roomId: args.roomId }, { $push: { messages: messageObj }})
                let data = "Message added"
                return data
            }
        },
        notifyUser: async (parent, args, context, info) => {

            if(context) {

                await User.updateOne({ userName: args.userName }, { $push: { notifications: context.user.userName }})
                let data = "User notified"
                return data
            }
        },
        createRoom: async (parent, args, context, info) => {

            if(context) {
                console.log(args.friendUsername)
                if(args.updateNotifications === true) {
                    await User.updateOne({ googleId: context.user.googleId },{ $pull: { notifications: args.friendUsername }})
                }

                let userData = await User.findOne({ userName: args.friendUsername }).lean()
                let roomIdOne = `${context.user.googleId}i${userData.googleId}`
                let roomIdTwo = `${userData.googleId}i${context.user.googleId}`

                const roomOne = await ChatRoom.findOne({ roomId: roomIdOne }).lean()

                if(roomOne) {
                    return roomIdOne
                }

                const roomTwo = await ChatRoom.findOne({ roomId: roomIdTwo }).lean()

                if(roomTwo) {
                    return roomIdTwo
                }

                await new ChatRoom({ roomId: roomIdOne, messages: [] }).save()
                return roomIdOne

            }
        },
        acceptFriend: async (parent, args, context, info) => {

            if(context) {
                
                if(args.willAccept === true) {
                    const data = await User.findOneAndUpdate({ googleId: context.user.googleId }, 
                        { $pull: { pendingFriends: args.friendUsername }, 
                        $push: { friendList: args.friendUsername}}, { new: true })
                    
                    await User.updateOne({ userName: args.friendUsername}, { $push: { friendList: context.user.userName }})

                    return data
                }

                const data = await User.findOneAndUpdate({ googleId: context.user.googleId },
                    { $pull: { pendingFriends: args.friendUsername }}, { new: true })

                return data
            }
        },
        addUser: async (parent, args, context, info) => {

            if(context) {

                const data = await User.findOne({ userName: args.friendUsername}).lean()

                if(data) {
                    
                    let checkIfFriend = 0
                    let checkIfPending = 0
                    
                    // check if user in friend's pending list
                    data.pendingFriends.forEach(pending => {
                        if(pending === context.user.userName) {
                            checkIfPending += 1
                        }
                    })

                    // check if user in friend list
                    context.user.friendList.forEach(friend => {
                        if(friend === args.friendUsername) {
                            checkIfFriend += 1
                        }
                    })

                    if(checkIfPending === 0 && checkIfFriend === 0) {
                        
                        await User.updateOne({ userName: args.friendUsername }, 
                            { $push: { pendingFriends: context.user.userName }})
                        
                        let data = "Friend Request Sent"
                        return data
                    }
                }
                
            }
        }
    }

}

module.exports = resolvers;