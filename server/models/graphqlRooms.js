const { gql } = require("apollo-server-express");

const chatRooms = gql`
    type chatRoom {
        roomId: String,
        messages: [Message]
    }
`

module.exports = chatRooms;