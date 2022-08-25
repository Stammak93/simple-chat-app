const { gql } = require("apollo-server-express");


const Message = gql`
    type Message {
        sender: String,
        body: String,
        timestamp: Int
    }
`;

module.exports = Message;