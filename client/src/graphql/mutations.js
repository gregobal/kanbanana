import gql from 'graphql-tag'


export const LOGIN = gql`mutation ($email: String!, $password: String!) {
    login(
        email: $email
        password: $password
    ) {
        token
        user {
            name
            email
        }
    }
}`;

export const REGISTER = gql` mutation ($email: String!, $password: String!, $name: String) {
    createUser(
        email: $email
        password: $password
        name: $name
    ) {
        email
    }
}`;

export const CREATE_PROJECT = gql`mutation ($title: String!, $descr: String) {
    createProject(
        title: $title
        descr: $descr
    ) {
        _id
        title
        descr
        createdAt
    }
}`;

export const UPDATE_PROJECT = gql`mutation ($projectId: ID!, $title: String!, $descr: String) {
    updateProject(
        projectId: $projectId
        title: $title
        descr: $descr
    ) {
        _id
        title
        descr
        createdAt
    }
}`;

export const CREATE_BOARD = gql`mutation ($projectId: ID! $title: String!) {
    createBoard(
        projectId: $projectId
        title: $title
    ) {
        _id
        title
    }
}`;

export const UPDATE_BOARD = gql`mutation ($boardId: ID! $title: String! $descr: String) {
    updateBoard(
        boardId: $boardId
        title: $title
        descr: $descr
    ) {
        title
        descr
    }
}`;

export const CREATE_BOARD_COLUMN = gql`mutation ($boardId: ID! $title: String!) {
    createBoardColumn(
        boardId: $boardId
        title: $title
    ) {
        _id
        title
    }
}`;

export const UPDATE_BOARD_COLUMN = gql`mutation ($columnId: ID! $title: String!) {
    updateBoardColumn(
        columnId: $columnId
        title: $title
    ) {
        _id
        title
    }
}`;

export const DELETE_BOARD_COLUMN = gql`mutation ($columnId: ID! $boardId: ID!) {
    deleteBoardColumn(
        columnId: $columnId
        boardId: $boardId
    ) {
        _id
    }
}`;

export const DRAG_COLUMN_IN_BOARD = gql`mutation ($boardId: ID! $columnIds: [ID!]!) {
    dragColumnInBoard(
        boardId: $boardId
        columnIds: $columnIds
    ) {
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

export const CREATE_BOARD_TASK = gql`mutation ($columnId: ID! $title: String! $color: String) {
    createBoardTask(
        columnId: $columnId
        title: $title
        color: $color
    ) {
        _id
        title
        color
    }
}`;

export const UPDATE_BOARD_TASK = gql`mutation ($taskId: ID! $title: String! $color: String) {
    updateBoardTask(
        taskId: $taskId
        title: $title
        color: $color
    ) {
        _id
        title
        color
    }
}`;

export const DELETE_BOARD_TASK = gql`mutation ($columnId: ID! $taskId: ID!) {
    deleteBoardTask(
        columnId: $columnId
        taskId: $taskId
    ) {
        _id
    }
}`;

export const DRAG_TASK_IN_COLUMNS = gql`mutation ($columnId: ID! $taskIds: [ID]!) {
    dragTaskInColumns(
        columnId: $columnId
        taskIds: $taskIds
    ) {
        _id
        title
        tasks {
            _id
            title
            color
        }
    }
}`;
