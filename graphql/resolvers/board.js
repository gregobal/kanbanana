const {ApolloError} = require('apollo-server');

const User = require('../../models/User');
const Project = require('../../models/Project');
const Board = require('../../models/Board');


module.exports = {
  getBoard: async ({boardId}) => {
    try {
      return await Board.findById(boardId);
    } catch (e) {
      throw new ApolloError(e)
    }
  },
  getBoards: async ({projectId}, userId) => {
    const filter = {
      creator: userId,
      project: projectId
    };
    try {
      return await Board
        .find(filter)
        .populate('creator')
        .populate('project');
    } catch (e) {
      throw new ApolloError(e)
    }
  },
  createBoard: async ({title, descr, projectId}, userId) => {
    const user = await User.findById(userId);
    try {
      const project = await Project.findById(projectId);
      const board = new Board({
        title,
        descr,
        creator: user,
        project
      });
      return await board.save()
    } catch (e) {
      throw new ApolloError(e)
    }
  }
};
