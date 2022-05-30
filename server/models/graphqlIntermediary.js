const { gql } = require("apollo-server-express");


const Intermediary = gql`
    type Intermediary {
        chatRoom: chatRoom,
        friend: User
    }
`

module.exports = Intermediary;