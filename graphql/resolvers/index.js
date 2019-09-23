const {AuthenticationError} = require('apollo-server');

const user = require('./user');
const post = require('./post');


module.exports = {
  Query: {
    users: (_, __, context) => {
      authGuard(context);
      return user.getUsers()
    },

    posts: (_, __, context) => {
      authGuard(context);
      return post.getPosts()
    }
  },
  Mutation: {
    createUser: (_, args, context) => {
      return user.createUser(args)
    },

    login: (_, args, context) => {
      return user.login(args)
    },

    createPost: (_, args, context) => {
      authGuard(context);
      return post.createPost(args)
    },
  }
};

function authGuard(context) {
  if (!context.isAuth) {
    throw new AuthenticationError('You must be logged in.');
  }
}
