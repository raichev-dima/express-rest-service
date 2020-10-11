const db = require('../../db');
const Errors = require('../../common/Errors');
const createErrorsBoundary = require('../../common/createErrorsBoundary');

function errorsStrategy(type) {
  switch (type) {
    case Errors.NOT_FOUND_ERR:
      return 'Board not found';
    default:
      return 'Unknown error';
  }
}

const boundErrors = createErrorsBoundary(errorsStrategy);

const performBoardAction = async (action) => {
  const { data, error, code } = await boundErrors(action);

  if (!error) {
    return { data, code };
  } else {
    return { error, code };
  }
};

const getAll = async () => {
  return performBoardAction(() => db.getAllBoards());
};

const getBoard = async (id) => {
  return performBoardAction(() => db.findBoardById(id));
};

const createBoard = async (board) => {
  return performBoardAction(() => db.createBoard(board));
};

const updateBoard = async (board) => {
  return performBoardAction(() => db.updateBoard(board));
};

const deleteBoard = async (id) => {
  return performBoardAction(() => db.deleteBoard(id));
};

module.exports = {
  getAll,
  getBoard,
  createBoard,
  updateBoard,
  deleteBoard,
};
