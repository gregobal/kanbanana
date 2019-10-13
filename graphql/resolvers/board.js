const {ApolloError} = require('apollo-server');

const User = require('../../models/User');
const Project = require('../../models/Project');
const Board = require('../../models/Board');
const BoardColumn = require('../../models/BoardColumn');


module.exports = {
  getBoard: async ({boardId}) => {
    try {
      return await Board.findById(boardId)
        .sort({createdAt: -1})
        .populate('project')
        .populate({
            path: 'columns',
              populate: { path: 'tasks' }
        });
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
        .sort({createdAt: -1})
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
      const column1 = new BoardColumn({
        title: 'To do',
        board
      });
      const column2 = new BoardColumn({
        title: 'Done',
        board
      });
      await column1.save();
      await column2.save();
      board.columns = [column1, column2];
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
  },
  dragColumnInBoard: async ({boardId, columnIds}) => {
    try {
      return Board.findOneAndUpdate(
        {_id: boardId},
        {
          columns: columnIds
        },
        {new: true}
      ).populate({
        path: 'columns',
        populate: { path: 'tasks' }
      });
    } catch (e) {
      throw new ApolloError(e)
    }
  }
};
