const { ApolloServer } = require("apollo-server-express");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const Query = require("../models/graphqlQuery");
const User = require("../models/graphqlUsers");
const chatRoom = require("../models/graphqlRooms");
const Message = require("../models/graphqlMessages");
const Intermediary = require("../models/graphqlIntermediary");
const Mutation = require("../models/graphqlMutations");
const resolvers = require("../models/graphqlResolvers");



const schema = makeExecutableSchema({
    typeDefs: [Query, User, chatRoom, Message, Intermediary, Mutation],
    resolvers: resolvers
})

const graphServer = new ApolloServer({
    schema,
    csrfPrevention: true,
    context: ({ req }) => {
        return { user: req.user }
    }
})



module.exports = graphServer;