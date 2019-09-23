const jwt = require('jsonwebtoken');

const {jwtKey} = require('../config/cred');


module.exports = ({req}) => {
  const token = req.get('Authorization') || '';
  let user;

  try {
    user = jwt.verify(token, jwtKey);
  } catch (e) {
    return {isAuth: false}
  }

  if (!user) {
    return {isAuth: false}
  }

  return {...user, isAuth: true};
};
