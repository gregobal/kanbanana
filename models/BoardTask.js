const mongoose = require('mongoose');
const Schema = mongoose.Schema;


module.exports = mongoose.model(
  'board-tasks',
  Schema(
    {
      title: {
        type: String,
        required: true
      },
      color: {
        type: String
      }
    },
    {timestamps: true}
  )
);
