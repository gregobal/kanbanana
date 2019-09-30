const mongoose = require('mongoose');
const Schema = mongoose.Schema;


module.exports = mongoose.model(
  'users',
  Schema({
    name: {
      type: String
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true
    }
  })
);
