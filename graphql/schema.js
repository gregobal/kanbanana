const {gql} = require('apollo-server');

const typeDefs = gql`
    type Query {
        users: [User]
        posts: [Post]
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

        createPost(
            message: String!
        ):Post!
    }

    type User {
        _id: ID!
        email: String!
        password: String!
        name: String!
    }

    type AuthData {
        token: String!
        userId: String!
    }

    type Post {
        message: String!
    }
`;

module.exports = typeDefs;
