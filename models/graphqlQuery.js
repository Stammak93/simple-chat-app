const { gql } = require("apollo-server-express");


const Query = gql`
    type Query {
        test: String,
        User: [User],
        userName(name: String): String,
        getUser: User,
        getChatRoom(roomId: String): Intermediary
    }
`;

module.exports = Query;