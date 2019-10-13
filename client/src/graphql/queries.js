import gql from 'graphql-tag'


export const GET_BOARD = gql`query ($boardId: ID!) {
    board (boardId: $boardId) {
        _id
        title
        descr
        columns {
            _id
            title
            tasks {
                _id
                title
                color
            }
        }
    }
}`;

export const GET_BOARDS = gql`query ($projectId: ID!) {
    boards (projectId: $projectId) {
        _id
        title
    }
}`;

export const GET_PROJECTS = gql`query {
    projects {
        _id
        title
        descr
        createdAt
    }
}`;
