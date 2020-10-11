const tasksRepo = require('./task.memory.repository');

const getAll = (boardId) => tasksRepo.getAll(boardId);
const getTask = (boardId, id) => tasksRepo.getTask(boardId, id);
const deleteTask = (boardId, id) => tasksRepo.deleteTask(boardId, id);
const updateTask = (boardId, task) => tasksRepo.updateTask(boardId, task);
const createTask = (boardId, task) => tasksRepo.createTask(boardId, task);

module.exports = {
  getAll,
  getTask,
  deleteTask,
  updateTask,
  createTask,
};
