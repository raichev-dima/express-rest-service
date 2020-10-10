const uuid = require('uuid');

const Tables = {
  USERS: 'USERS',
  BOARDS: 'BOARDS',
  COLUMNS: 'COLUMNS',
  TASKS: 'TASKS',
};

const db = {
  [Tables.USERS]: [],
  [Tables.BOARDS]: [],
  [Tables.TASKS]: [],
  [Tables.COLUMNS]: [],
};

const findById = (id, db, table) => {
  return db[table].find((entity) => entity.id === id);
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
  } else {
    throw new Error(`Entity with ${id} doesn't exist in ${table}`);
  }
};

const updateEntity = (updatedEntity, db, table) => {
  const index = db[table].findIndex(({ id }) => updatedEntity.id === id);

  if (index > -1) {
    Object.assign(db[table][index], updatedEntity);
    return db[table][index];
  } else {
    throw new Error(
      `Entity with ${updatedEntity.id} doesn't exist in ${table}`
    );
  }
};

const getAll = (db, table) => {
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

db.findTaskById = function (id) {
  return findById(id, this, Tables.TASKS);
};

db.createUser = function (user) {
  return createEntity(user, this, Tables.USERS);
};

db.createBoard = function (board) {
  return createEntity(board, this, Tables.BOARDS);
};

db.createColumn = function (column) {
  return createEntity(column, this, Tables.COLUMNS);
};

db.createTask = function (task) {
  return createEntity(task, this, Tables.TASKS);
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

db.deleteTask = function (id) {
  return deleteEntity(id, this, Tables.TASKS);
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

db.updateTask = function (task) {
  return updateEntity(task, this, Tables.TASKS);
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

db.getAllTasks = function () {
  return getAll(this, Tables.TASKS);
};

module.exports = db;
