const {gql} = require('apollo-server');


const typeDefs = gql`
    type Query {
        user: User! 
        board: Board
        boards: [Board]
    }

    type Mutation {
        createUser(
            email: String!
            password: String!
            name: String!
        ):User!

        login(
            email: String!
            password: String!
        ):AuthData!

        createBoard(
            title: String!            
        ):Board!
    }

    type User {
        _id: ID!
        email: String!
        password: String!
        name: String!
        boards: [Board!]
    }

    type AuthData {
        token: String!
        userId: String!
    }

    type Board {
        _id: ID!
        title: String!
        creator: User!
    }
`;

module.exports = typeDefs;
