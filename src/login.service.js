const jwt = require('jsonwebtoken');

const usersService = require('./resources/users/user.service');
const crypt = require('./common/crypt');

const { JWT_SECRET_KEY } = require('./common/config');

const signToken = async (login, password) => {
  const user = await usersService.getUserByProps({
    login,
  });

  if (!user) {
    return null;
  } else {
    const match = await crypt.compare(password, user.password);

    if (!match) {
      return null;
    }

    const { id, login } = user;

    return jwt.sign({ id, login }, JWT_SECRET_KEY);
  }
};

module.exports = {
  signToken,
};
