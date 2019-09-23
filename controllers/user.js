const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const {jwtKey} = require('../config/cred');

module.exports = {
  getUsers: async () => {
    try {
      return await User.find();
    } catch (e) {
      console.error(e)
    }
  },

  createUser: async ({email, password, name}) => {
    const errors = [];
    if (!validator.isEmail(email)) {
      errors.push({message: 'Email is invalid.'});
    }
    if (
      validator.isEmpty(password) ||
      !validator.isLength(password, {min: 8})
    ) {
      errors.push({message: 'Password too short.'});
    }
    if (errors.length > 0) {
      const error = new Error('Invalid input.');
      error.data = errors;
      error.code = 422;
      throw error;
    }

    const existed = await User.findOne({email});
    if (existed) {
      throw new Error(`User with email '${email}' exists already.`);
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPw = await bcrypt.hashSync(password, salt);

    const user = new User({
      email,
      password: hashedPw,
      name
    });

    const createdUser = await user.save();
    return {...createdUser._doc, _id: createdUser._id.toString()};
  },

  login: async ({email, password}) => {
    const user = await User.findOne({email});
    if (!user) {
      const error = new Error('User not found.');
      error.code = 401;
      throw error;
    }

    const isEqual = bcrypt.compareSync(password, user.password);
    if (!isEqual) {
      const error = new Error('Password is incorrect.');
      error.code = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email
      },
      jwtKey,
      {expiresIn: '1h'}
    );
    return {token: token, userId: user._id.toString()}
  }
};
