const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const boardSchema = Schema(
  {
    title: {
      type: String,
      required: true
    },
    creator: {
      ref: 'users',
      type: Schema.Types.ObjectId,
      required: true
    }
  },
  {timestamps: true}
);

module.exports = mongoose.model('boards', boardSchema);
