const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = Schema({
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
});

module.exports = mongoose.model('users', userSchema);
