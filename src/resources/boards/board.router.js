const router = require('express').Router();
const Board = require('./board.model');
const boardsService = require('./board.service');
const taskRouter = require('../tasks/task.router');

async function performRequest(sendRequest) {
  const boardData = await sendRequest();
  const board = new Board(boardData);

  return board.toResponse();
}

router.use('/:boardId/tasks', taskRouter);

router.route('/').get(async (req, res, next) => {
  try {
    const boardsData = await boardsService.getAll();
    const boards = boardsData.map((data) => new Board(data));

    return res.json(boards.map((board) => board.toResponse()));
  } catch (e) {
    next(e);
  }
});

router.route('/:id').get(async (req, res, next) => {
  try {
    const { id } = req.params;
    const board = await performRequest(() => boardsService.getBoard(id));

    return res.json(board);
  } catch (e) {
    next(e);
  }
});

router.route('/').post(async (req, res, next) => {
  try {
    const data = req.body;
    const board = await performRequest(() => boardsService.createBoard(data));

    return res.json(board);
  } catch (e) {
    next(e);
  }
});

router.route('/:id').put(async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const board = await performRequest(() =>
      boardsService.updateBoard({ ...data, id })
    );

    return res.json(board);
  } catch (e) {
    next(e);
  }
});

router.route('/:id').delete(async (req, res, next) => {
  try {
    const { id } = req.params;

    await performRequest(() => boardsService.deleteBoard(id));

    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
