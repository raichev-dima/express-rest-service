const boardsRepo = require('./board.memory.repository');
const tasksRepo = require('../tasks/task.memory.repository');

const getAll = () => boardsRepo.getAll();

const getBoard = (id) => boardsRepo.getBoard(id);

const deleteBoard = async (id) => {
  const boundTasks = await tasksRepo.getAll(id);

  await Promise.all(
    boundTasks.map(async (task) => tasksRepo.deleteTask(id, task.id))
  );

  await boardsRepo.deleteBoard(id);
};

const updateBoard = (board) => boardsRepo.updateBoard(board);

const createBoard = (board) => boardsRepo.createBoard(board);

module.exports = {
  getAll,
  getBoard,
  deleteBoard,
  updateBoard,
  createBoard,
};
