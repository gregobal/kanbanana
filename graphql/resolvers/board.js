const {ApolloError} = require('apollo-server');

const User = require('../../models/User');
const Project = require('../../models/Project');
const Board = require('../../models/Board');


module.exports = {
  getBoard: async ({boardId}) => {
    try {
      return await Board.findById(boardId)
        .populate('project')
        .populate('columns');
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
    try {
      const user = await User.findById(userId);
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
  },
  updateBoard: async ({boardId, title, descr}) => {
    try {
      return Board.findOneAndUpdate(
        {_id: boardId},
        {
          title,
          descr
        },
        {new: true}
      );
    } catch (e) {
      throw new ApolloError(e)
    }
  }
};
