const User = require('../resources/users/user.model');
const Task = require('../resources/tasks/task.model');
const Board = require('../resources/boards/board.model');

const Errors = require('../common/Errors');

const createErrorMessageByType = (errorType) => {
  switch (errorType) {
    case Errors.NOT_FOUND_ERR:
      return (id, table) =>
        `${Errors.NOT_FOUND_ERR}: Entity with ${id} doesn't exist in ${table}`;
    case Errors.NOT_FOUND_BOARD_ERR:
      return (id, table) =>
        `${Errors.NOT_FOUND_BOARD_ERR}: Board with ${id} doesn't exist in ${table}`;
    case Errors.UNKNOWN_SERVER_ERR:
      return () => 'Unknown server error';
    default:
      throw new Error(
        `createErrorMessageFormatter: please provide an error's type`
      );
  }
};

const createNotFoundError = createErrorMessageByType(Errors.NOT_FOUND_ERR);
const createNotFoundBoardError = createErrorMessageByType(
  Errors.NOT_FOUND_BOARD_ERR
);

const Tables = {
  USERS: 'USERS',
  BOARDS: 'BOARDS',
  TASKS: 'TASKS',
};

const Entity = {
  [Tables.USERS]: User,
  [Tables.BOARDS]: Board,
  [Tables.TASKS]: Task,
};

const findById = async (id, db, table) => {
  const entity = await db[table].findById(id).exec();
  if (entity) {
    return entity;
  }

  throw new Error(createNotFoundError(id, table));
};

const createEntity = async (entity, db, table) => {
  return db[table].create(entity);
};

const deleteEntity = async (id, db, table) => {
  const entity = await db[table].findByIdAndDelete(id).exec();

  if (entity) {
    return entity;
  }

  throw new Error(createNotFoundError(id, table));
};

const updateEntity = async (updatedEntity, db, table) => {
  const entity = await db[table]
    .findByIdAndUpdate(updatedEntity.id, updatedEntity, { new: true })
    .exec();

  if (entity) {
    return entity;
  }

  throw new Error(createNotFoundError(updatedEntity.id, table));
};

const getAll = async (db, table) => {
  if (!db[table]) {
    throw new Error(createErrorMessageByType(Errors.UNKNOWN_SERVER_ERR)());
  }

  return await db[table].find({}).exec();
};

const findUserById = function (id) {
  return findById(id, Entity, Tables.USERS);
};

const findBoardById = function (id) {
  return findById(id, Entity, Tables.BOARDS);
};

async function checkIfBoardExists(boardId) {
  const board = await findById(boardId, Entity, Tables.BOARDS);

  if (!board) {
    throw new Error(createNotFoundBoardError(boardId, Tables.BOARDS));
  }

  return board;
}

const findTaskById = async function (boardId, id) {
  const entity = await Task.findOne({ _id: id, boardId });

  if (entity) {
    return entity;
  }

  throw new Error(createNotFoundError(id, Tables.TASKS));
};

const createUser = function (user) {
  return createEntity(user, Entity, Tables.USERS);
};

const createBoard = function (board) {
  return createEntity(board, Entity, Tables.BOARDS);
};

const createTask = async function (boardId, task) {
  await checkIfBoardExists(boardId);

  const table = Tables.TASKS;

  return createEntity({ ...task, boardId }, Entity, table);
};

const deleteUser = function (id) {
  return deleteEntity(id, Entity, Tables.USERS);
};

const deleteBoard = function (id) {
  return deleteEntity(id, Entity, Tables.BOARDS);
};

const deleteTask = async function (boardId, id) {
  const entity = await Task.findOneAndDelete({ _id: id, boardId }).exec();

  if (entity) {
    return entity;
  }

  throw new Error(createNotFoundError(id, Tables.TASKS));
};

const updateUser = function (user) {
  return updateEntity(user, Entity, Tables.USERS);
};

const updateBoard = function (board) {
  return updateEntity(board, Entity, Tables.BOARDS);
};

const updateTask = async function (boardId, task) {
  const entity = await Task.findOneAndUpdate({ _id: task.id, boardId }, task, {
    new: true,
  }).exec();

  if (entity) {
    return entity;
  }

  throw new Error(createNotFoundError(task.id, Tables.TASKS));
};

const getAllUsers = function () {
  return getAll(Entity, Tables.USERS);
};

const getAllBoards = function () {
  return getAll(Entity, Tables.BOARDS);
};

const getAllTasks = async function (boardId) {
  return await Task.find({ boardId }).exec();
};

module.exports = {
  findUserById,
  findBoardById,
  findTaskById,
  createUser,
  createBoard,
  createTask,
  deleteUser,
  deleteBoard,
  deleteTask,
  updateUser,
  updateBoard,
  updateTask,
  getAllUsers,
  getAllBoards,
  getAllTasks,
};
