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
  const boardsData = await boardsService.getAll().catch(next);
  const boards = boardsData.map((data) => new Board(data));

  return res.json(boards.map((board) => board.toResponse()));
});

router.route('/:id').get(async (req, res, next) => {
  const { id } = req.params;
  const board = await performRequest(() => boardsService.getBoard(id)).catch(
    next
  );

  return res.json(board);
});

router.route('/').post(async (req, res, next) => {
  const data = req.body;
  const board = await performRequest(() =>
    boardsService.createBoard(data)
  ).catch(next);

  return res.json(board);
});

router.route('/:id').put(async (req, res, next) => {
  const { id } = req.params;
  const data = req.body;

  const board = await performRequest(() =>
    boardsService.updateBoard({ ...data, id })
  ).catch(next);

  return res.json(board);
});

router.route('/:id').delete(async (req, res, next) => {
  const { id } = req.params;

  await performRequest(() => boardsService.deleteBoard(id)).catch(next);

  return res.sendStatus(204);
});

module.exports = router;
