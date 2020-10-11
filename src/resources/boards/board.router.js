const router = require('express').Router();
const Board = require('./board.model');
const boardsService = require('./board.service');

async function performRequest({ sendRequest, onSuccess, onFailure }) {
  const { error, code, data: boardData } = await sendRequest();
  const board = new Board(boardData);

  if (!error) {
    const response = board.toResponse();

    onSuccess(response);
  } else {
    onFailure({ code, error });
  }
}

router.route('/').get(async (req, res) => {
  const { error, code, data: boardsData } = await boardsService.getAll();

  if (!error) {
    const boards = boardsData.map((data) => new Board(data));

    res.json(boards.map((board) => board.toResponse()));
  } else {
    res.status(code).send(error);
  }
});

router.route('/:id').get(async (req, res) => {
  const { id } = req.params;

  await performRequest({
    sendRequest: async () => boardsService.getBoard(id),
    onSuccess: res.json.bind(res),
    onFailure: ({ code, error }) => res.status(code).send(error),
  });
});

router.route('/').post(async (req, res) => {
  const data = req.body;

  await performRequest({
    sendRequest: async () => boardsService.createBoard(data),
    onSuccess: res.json.bind(res),
    onFailure: ({ code, error }) => res.status(code).send(error),
  });
});

router.route('/:id').put(async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  await performRequest({
    sendRequest: async () => boardsService.updateBoard({ ...data, id }),
    onSuccess: res.json.bind(res),
    onFailure: ({ code, error }) => res.status(code).send(error),
  });
});

router.route('/:id').delete(async (req, res) => {
  const { id } = req.params;

  await performRequest({
    sendRequest: async () => boardsService.deleteBoard(id),
    onSuccess: res.json.bind(res),
    onFailure: ({ code, error }) => res.status(code).send(error),
  });
});

module.exports = router;
