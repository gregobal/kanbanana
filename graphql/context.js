const jwt = require('jsonwebtoken');

const {jwtKey} = require('../config/cred');


module.exports = ({req}) => {
  const token = req.get('authorization') || '';
  let verified;

  try {
    verified = jwt.verify(token.split(' ')[1], jwtKey);
  } catch (e) {
    return {isAuth: false}
  }

  if (!verified) {
    return {isAuth: false}
  }

  return {userId: verified.userId, isAuth: true};
};
