const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const { JWT_SECRET_KEY } = require('../common/config');

const WHITE_LIST = ['/login', '/doc', '/'];

module.exports = async (req, res, next) => {
  if (WHITE_LIST.includes(req.path)) {
    return next();
  }

  const authHeader = req.header('Authorization');

  if (authHeader !== undefined) {
    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer') {
      res.status(StatusCodes.UNAUTHORIZED).send('Wrong auth schema');
    } else {
      try {
        jwt.verify(token, JWT_SECRET_KEY);
      } catch (e) {
        res
          .status(StatusCodes.UNAUTHORIZED)
          .send('Access token is missing or invalid');
      }

      return next();
    }
  } else {
    res.status(StatusCodes.UNAUTHORIZED).send('Unauthorized user');
  }
};
