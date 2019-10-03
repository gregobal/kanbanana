const {ApolloError} = require('apollo-server');

const BoardColumn = require('../../models/BoardColumn');
const Board = require('../../models/Board');


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
      const result = await boardColumn.save();
      await board.updateOne(
        {
          columns: [...columns, result]
        }
      );
      return result
    } catch (e) {
      throw new ApolloError(e)
    }
  }
};
