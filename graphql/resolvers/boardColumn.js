const {ApolloError} = require('apollo-server');

const BoardColumn = require('../../models/BoardColumn');
const Board = require('../../models/Board');
const BoardTask = require('../../models/BoardTask');


module.exports = {
  createBoardColumn: async ({title, boardId}) => {
    try {
      const board = await Board.findById(boardId);
      const {columns} = board;
      if (columns && columns.length >= 6) {
        throw new Error('Columns count in board can be 6 or less')
      }
      const boardColumn = new BoardColumn({
        title,
        board
      });
      await boardColumn.save();
      await board.updateOne(
        {
          columns: [...columns, boardColumn]
        }
      );
      return boardColumn
    } catch (e) {
      throw new ApolloError(e)
    }
  },
  updateBoardColumn: async ({columnId, title}) => {
    try {
      return BoardColumn.findOneAndUpdate(
        {_id: columnId},
        {
          title,
        },
        {new: true}
      );
    } catch (e) {
      throw new ApolloError(e)
    }
  },
  deleteBoardColumn: async ({columnId, boardId}) => {
    try {
      const board = await Board.findById(boardId);
      board.columns.pull(columnId);
      await board.save();
      const column = await BoardColumn.findByIdAndRemove(columnId);
      if ('tasks' in column) {
        await BoardTask.deleteMany({_id: { $in: column.tasks }});
      }
      return column;
    } catch (e) {
      throw new ApolloError(e)
    }
  },
  dragTaskInColumns: async ({columnId, taskIds}) => {
    try {
      return BoardColumn.findOneAndUpdate(
        {_id: columnId},
        {
          tasks: taskIds
        },
        {new: true}
      ).populate('tasks');
    } catch (e) {
      throw new ApolloError(e)
    }
  }
};
