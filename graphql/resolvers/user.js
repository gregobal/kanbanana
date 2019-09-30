const {ApolloError, UserInputError} = require('apollo-server');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const User = require('../../models/User');
const {jwtKey} = require('../../config/cred');


module.exports = {
  getUser: async (userId) => {
    try {
      const user = await User.findById(userId);
      user.password = null;
      return user;
    } catch (e) {
      throw new ApolloError(e)
    }
  },
  createUser: async ({email, password, name}) => {
    if (!validator.isEmail(email)) {
      throw new UserInputError('Email is invalid.');
    }
    if (
      validator.isEmpty(password) || !validator.isLength(password, {min: 8})) {
      throw new UserInputError('Password too short.');
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

    return await user.save();
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
      {expiresIn: 3600}
    );
    return {token: token}
  }
};
