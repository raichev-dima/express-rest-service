const db = require('../../db');
const Errors = require('../../common/Errors');
const createErrorsBoundary = require('../../common/createErrorsBoundary');

function errorsStrategy(type) {
  switch (type) {
    case Errors.NOT_FOUND_ERR:
      return 'User not found';
    default:
      return 'Unknown error';
  }
}

const boundErrors = createErrorsBoundary(errorsStrategy);

const performUserAction = async (action) => {
  return await boundErrors(action);
};

const getAll = async () => {
  return performUserAction(() => db.getAllUsers());
};

const getUser = async (id) => {
  return performUserAction(() => db.findUserById(id));
};

const createUser = async (user) => {
  return performUserAction(() => db.createUser(user));
};

const updateUser = async (user) => {
  return performUserAction(() => db.updateUser(user));
};

const deleteUser = async (id) => {
  return performUserAction(() => db.deleteUser(id));
};

module.exports = {
  getAll,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
