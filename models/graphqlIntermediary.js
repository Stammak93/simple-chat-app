const { gql } = require("apollo-server-express");

// this is here to merge two different schemas
// and allow me to return two schemas at once with getChatRoom
const Intermediary = gql`
    type Intermediary {
        chatRoom: chatRoom,
        friend: User
    }
`

module.exports = Intermediary;