const {AuthenticationError, UserInputError} = require('apollo-server');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const User = require('../../models/User');
const {jwtKey} = require('../../config/cred');

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
      errors.push('Email is invalid.');
    }
    if (
      validator.isEmpty(password) || !validator.isLength(password, {min: 8})) {
      errors.push('Password too short.');
    }
    if (errors.length > 0) {
      throw new UserInputError(errors.join(' '));
    }

    const existed = await User.findOne({email});
    if (existed) {
      throw new UserInputError(`User with email '${email}' exists already.`);
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
      throw new UserInputError(`User with email '${email}' not found.`);
    }

    const isEqual = bcrypt.compareSync(password, user.password);
    if (!isEqual) {
      throw new UserInputError('Password is incorrect.');
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
