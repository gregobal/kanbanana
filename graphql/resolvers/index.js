const {AuthenticationError} = require('apollo-server');

const user = require('./user');
const board = require('./board');


module.exports = {
  Query: {
    hello: () => {
      return {message: 'Hello from Kanbanana GraphQL API!'}
    },
    user: (_, __, {isAuth, userId}) => {
      authGuard(isAuth);
      return user.getUser(userId)
    },
    boards: (_, __, {isAuth, userId}) => {
      authGuard(isAuth);
      return board.getBoards(userId)
    }
  },
  Mutation: {
    createUser: (_, args) => {
      return user.createUser(args)
    },
    login: (_, args) => {
      return user.login(args)
    },
    createBoard: (_, args, {isAuth, userId}) => {
      authGuard(isAuth);
      return board.createBoard(args, userId)
    },
  }
};

function authGuard(isAuth) {
  if (!isAuth) {
    throw new AuthenticationError('You must be logged in.');
  }
}
