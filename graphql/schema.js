const {gql} = require('apollo-server');


module.exports = gql`
    type Query {
        hello: Hello!        
        user: User
        project: Project
        projects: [Project]
        board(boardId: ID!): Board
        boards(projectId: ID!): [Board]
    }

    type Mutation {
        createUser(
            email: String!
            password: String!
            name: String
        ):User!

        login(
            email: String!
            password: String!
        ):AuthData!

        createProject(
            title: String!
            descr: String
        ):Project!

        updateProject(
            projectId: ID!
            title: String!
            descr: String
        ):Project!

        createBoard(
            projectId: ID!
            title: String!
            descr: String            
        ):Board!
    }
    
    type Hello {
        message: String!
    }

    type AuthData {
        token: String!
    }

    type User {
        _id: ID!
        email: String!
        password: String!
        name: String        
    }

    type Project {
        _id: ID!
        title: String!
        descr: String
        creator: User!        
        updatedAt: String!
    }
    
    type Board {
        _id: ID!
        title: String!
        descr: String
        creator: User!
        project: Project!
    }
`;
