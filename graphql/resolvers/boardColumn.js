const {ApolloError} = require('apollo-server');

const BoardColumn = require('../../models/BoardColumn');
const Board = require('../../models/Board');


module.exports = {
  createBoardColumn: async ({title, boardId}) => {
    try {
      const board = await Board.findById(boardId);
      const {columns} = board;
      let position = 0;
      if (columns) {
        if (columns.length >= 6) {
          throw new Error('Columns count in board can be 6 or less')
        }
        position = columns.length;
      }
      const boardColumn = new BoardColumn({
        title,
        position,
        board
      });
      const result = await boardColumn.save();
      const oldColumns = 'columns' in board ? board.columns : [];
      await board.updateOne(
        {
          columns: [...oldColumns, result]
        }
      );
      return result
    } catch (e) {
      throw new ApolloError(e)
    }
  }
};
