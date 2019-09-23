const jwt = require('jsonwebtoken');

const {jwtKey} = require('../config/cred');


module.exports = ({req}) => {
  const token = req.get('Authorization') || '';
  let verified;

  try {
    verified = jwt.verify(token, jwtKey);
  } catch (e) {
    return {isAuth: false}
  }

  if (!verified) {
    return {isAuth: false}
  }

  return {userId: verified.userId, isAuth: true};
};
