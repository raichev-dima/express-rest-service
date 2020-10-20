const uuid = require('uuid');

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
  COLUMNS: 'COLUMNS',
  TASKS: 'TASKS',
};

const db = {
  [Tables.USERS]: [],
  [Tables.BOARDS]: [],
  [Tables.TASKS]: {},
  [Tables.COLUMNS]: [],
};

const findById = (id, db, table) => {
  const entity = db[table].find((entity) => entity.id === id);
  if (entity) {
    return entity;
  }

  throw new Error(createNotFoundError(id, table));
};

const createEntity = (entity, db, table) => {
  const newEntity = { ...entity, id: uuid() };
  db[table].push(newEntity);
  return newEntity;
};

const deleteEntity = (id, db, table) => {
  const entity = findById(id, db, table);

  if (entity) {
    db[table] = db[table].filter(({ id: entityId }) => entityId !== id);
    return entity;
  }

  throw new Error(createNotFoundError(id, table));
};

const updateEntity = (updatedEntity, db, table) => {
  const index = db[table].findIndex(({ id }) => updatedEntity.id === id);

  if (index > -1) {
    Object.assign(db[table][index], updatedEntity);
    return db[table][index];
  }

  throw new Error(createNotFoundError(updatedEntity.id, table));
};

const getAll = (db, table) => {
  if (!db[table]) {
    throw new Error(createErrorMessageByType(Errors.UNKNOWN_SERVER_ERR)());
  }

  return db[table];
};

db.findUserById = function (id) {
  return findById(id, this, Tables.USERS);
};

db.findBoardById = function (id) {
  return findById(id, this, Tables.BOARDS);
};

db.findColumnById = function (id) {
  return findById(id, this, Tables.COLUMNS);
};

db.findTaskById = function (boardId, id) {
  const table = this[Tables.TASKS];
  return findById(id, table, boardId);
};

db.createUser = function (user) {
  return createEntity(user, this, Tables.USERS);
};

db.createBoard = function (board) {
  const newBoard = createEntity(board, this, Tables.BOARDS);

  this[Tables.TASKS][newBoard.id] = [];

  return newBoard;
};

db.createColumn = function (column) {
  return createEntity(column, this, Tables.COLUMNS);
};

db.createTask = function (boardId, task) {
  try {
    findById(boardId, this, Tables.BOARDS);

    const table = this[Tables.TASKS];
    table[boardId] = table[boardId] || [];

    return createEntity(task, table, boardId);
  } catch (e) {
    throw new Error(createNotFoundBoardError(boardId, Tables.BOARDS));
  }
};

db.deleteUser = function (id) {
  return deleteEntity(id, this, Tables.USERS);
};

db.deleteBoard = function (id) {
  return deleteEntity(id, this, Tables.BOARDS);
};

db.deleteColumn = function (id) {
  return deleteEntity(id, this, Tables.COLUMNS);
};

db.deleteTask = function (boardId, id) {
  try {
    findById(boardId, this, Tables.BOARDS);

    const table = this[Tables.TASKS];

    return deleteEntity(id, table, boardId);
  } catch (e) {
    throw new Error(createNotFoundBoardError(boardId, Tables.BOARDS));
  }
};

db.updateUser = function (user) {
  return updateEntity(user, this, Tables.USERS);
};

db.updateBoard = function (board) {
  return updateEntity(board, this, Tables.BOARDS);
};

db.updateColumn = function (column) {
  return updateEntity(column, this, Tables.COLUMNS);
};

db.updateTask = function (boardId, task) {
  try {
    findById(boardId, this, Tables.BOARDS);

    const table = this[Tables.TASKS];

    return updateEntity(task, table, boardId);
  } catch (e) {
    throw new Error(createNotFoundBoardError(boardId, Tables.BOARDS));
  }
};

db.getAllUsers = function () {
  return getAll(this, Tables.USERS);
};

db.getAllBoards = function () {
  return getAll(this, Tables.BOARDS);
};

db.getAllColumns = function () {
  return getAll(this, Tables.COLUMNS);
};

db.getAllTasks = function (boardId) {
  try {
    findById(boardId, this, Tables.BOARDS);

    const table = this[Tables.TASKS];
    table[boardId] = table[boardId] || [];

    return getAll(table, boardId);
  } catch (e) {
    throw new Error(createNotFoundBoardError(boardId, Tables.BOARDS));
  }
};

module.exports = db;
