const {ApolloError} = require('apollo-server');

const User = require('../../models/User');
const Board = require('../../models/Board');


module.exports = {
  getBoards: async (userId) => {
    try {
      return await Board
        .find({creator: userId})
        .populate('creator');
    } catch (e) {
      throw new ApolloError(e)
    }
  },
  createBoard: async ({title}, userId) => {
    const user = await User.findById(userId);
    const board = new Board({
      title,
      creator: user
    });
    try {
      return await board.save()
    } catch (e) {
      throw new ApolloError(e)
    }
  }
};
