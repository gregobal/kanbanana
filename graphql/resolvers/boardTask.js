const {ApolloError} = require('apollo-server');

const BoardTask = require('../../models/BoardTask');
const BoardColumn = require('../../models/BoardColumn');


module.exports = {
  createBoardTask: async ({title, color, columnId}) => {
    try {
      const column = await BoardColumn.findById(columnId);
      const boardTask = new BoardTask({
        title,
        color
      });
      await boardTask.save();
      column.tasks.push(boardTask);
      await column.save();
      return boardTask
    } catch (e) {
      throw new ApolloError(e)
    }
  },
  updateBoardTask: async ({taskId, title, color}) => {
    try {
      return BoardTask.findOneAndUpdate(
        {_id: taskId},
        {
          title,
          color
        },
        {new: true}
      );
    } catch (e) {
      throw new ApolloError(e)
    }
  },
  deleteBoardTask: async ({taskId, columnId}) => {
    try {
      const column = await BoardColumn.findById(columnId);
      column.tasks.pull(taskId);
      await column.save();
      return await BoardTask.findByIdAndRemove(taskId);
    } catch (e) {
      throw new ApolloError(e)
    }
  }
};
