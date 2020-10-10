const usersRepo = require('./user.memory.repository');

const getAll = () => usersRepo.getAll();
const getUser = (id) => usersRepo.getUser(id);
const deleteUser = (id) => usersRepo.deleteUser(id);
const updateUser = (user) => usersRepo.updateUser(user);
const createUser = (user) => usersRepo.createUser(user);

module.exports = {
  getAll,
  getUser,
  deleteUser,
  updateUser,
  createUser,
};
