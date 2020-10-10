const db = require('../../db');

const getAll = async () => {
  return db.getAllUsers();
};

const getUser = async (id) => {
  return db.findUserById(id);
};

const createUser = async (user) => {
  return db.createUser(user);
};

const updateUser = async (user) => {
  return db.updateUser(user);
};

const deleteUser = async (id) => {
  return db.deleteUser(id);
};

module.exports = {
  getAll,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
