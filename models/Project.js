const mongoose = require('mongoose');
const Schema = mongoose.Schema;


module.exports = mongoose.model(
  'projects',
  Schema(
    {
      title: {
        type: String,
        required: true
      },
      descr: {
        type: String
      },
      creator: {
        ref: 'users',
        type: Schema.Types.ObjectId,
        required: true
      }
    },
    {timestamps: true}
  )
);
