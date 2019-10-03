const mongoose = require('mongoose');
const Schema = mongoose.Schema;


module.exports = mongoose.model(
  'board-columns',
  Schema(
    {
      title: {
        type: String,
        required: true
      },
      board: {
        ref: 'boards',
        type: Schema.Types.ObjectId,
        required: true
      }
    },
    {timestamps: true}
  )
);
