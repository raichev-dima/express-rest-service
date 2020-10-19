const usersRepo = require('./user.memory.repository');
const tasksRepo = require('../tasks/task.memory.repository');
const boardsRepo = require('../boards/board.memory.repository');

const getAll = () => usersRepo.getAll();

const getUser = (id) => usersRepo.getUser(id);

const deleteUser = async (id) => {
  const user = await usersRepo.deleteUser(id);

  const boards = await boardsRepo.getAll();

  const tasks = await Promise.all(
    boards.map(async (board) => tasksRepo.getAll(board.id))
  ).then((results) => results.flatMap((data) => data));

  const boundTasks = tasks.filter(({ userId }) => userId === id);

  await Promise.all(
    boundTasks.map(async (task) =>
      tasksRepo.updateTask(task.boardId, { ...task, userId: null })
    )
  );

  return user;
};

const updateUser = (user) => usersRepo.updateUser(user);

const createUser = (user) => usersRepo.createUser(user);

module.exports = {
  getAll,
  getUser,
  deleteUser,
  updateUser,
  createUser,
};
