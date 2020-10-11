const boardsRepo = require('./board.memory.repository');

const getAll = () => boardsRepo.getAll();
const getBoard = (id) => boardsRepo.getBoard(id);
const deleteBoard = (id) => boardsRepo.deleteBoard(id);
const updateBoard = (board) => boardsRepo.updateBoard(board);
const createBoard = (board) => boardsRepo.createBoard(board);

module.exports = {
  getAll,
  getBoard,
  deleteBoard,
  updateBoard,
  createBoard,
};
