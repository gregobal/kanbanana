import gql from 'graphql-tag'

export default gql`
    type Query {
        loading: Boolean!
        error: String  
        isAuth: Boolean!
    } 
`;
