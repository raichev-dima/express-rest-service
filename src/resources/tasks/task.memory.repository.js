const db = require('../../db');
const Errors = require('../../common/Errors');
const createErrorsBoundary = require('../../common/createErrorsBoundary');

function errorsStrategy(type) {
  switch (type) {
    case Errors.NOT_FOUND_ERR:
      return 'Task not found';
    case Errors.NOT_FOUND_BOARD_ERR:
      return 'Board not found';
    default:
      return 'Unknown error';
  }
}

const boundErrors = createErrorsBoundary(errorsStrategy);

const performTaskAction = async (action) => {
  return await boundErrors(action);
};

const getAll = async (boardId) => {
  return performTaskAction(() => db.getAllTasks(boardId));
};

const getTask = async (boardId, id) => {
  return performTaskAction(() => db.findTaskById(boardId, id));
};

const createTask = async (boardId, task) => {
  return performTaskAction(() => db.createTask(boardId, task));
};

const updateTask = async (boardId, task) => {
  return performTaskAction(() => db.updateTask(boardId, task));
};

const deleteTask = async (boardId, id) => {
  return performTaskAction(() => db.deleteTask(boardId, id));
};

module.exports = {
  getAll,
  getTask,
  createTask,
  updateTask,
  deleteTask,
};
