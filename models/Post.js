const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = Schema({
  message: {
    type: String,
    require: true
  }
});

module.exports = mongoose.model('posts', postSchema);
