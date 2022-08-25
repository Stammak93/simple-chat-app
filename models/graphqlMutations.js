const { gql } = require("apollo-server-express");


const Mutation = gql`
    type Mutation {
        newMessage(roomId: String!, sender: String!, body: String!, timestamp: Int!): String,
        notifyUser(friendUsername: String): String,
        createRoom(friendUsername: String, updateNotifications: Boolean): String,
        acceptFriend(willAccept: Boolean, friendUsername: String): User,
        addUser(friendUsername: String): String
    }
`;

module.exports = Mutation;