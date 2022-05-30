const { gql } = require("apollo-server-express");

const User = gql`
    type User {
        googleId: String,
        userName: String,
        friendList: [String],
        pendingFriends: [String],
        notifications: [String]
    }
`;

module.exports = User;