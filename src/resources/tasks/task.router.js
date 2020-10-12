const router = require('express').Router({ mergeParams: true });
const Task = require('./task.model');
const tasksService = require('./task.service');

async function performRequest({ sendRequest, onSuccess, onFailure }) {
  const { error, code, data: taskData } = await sendRequest();
  const user = new Task(taskData);

  if (!error) {
    const response = user.toResponse();

    onSuccess(response);
  } else {
    onFailure({ code, error });
  }
}

router.route('/').get(async (req, res) => {
  const { boardId } = req.params;
  const { error, code, data: usersData } = await tasksService.getAll(boardId);

  if (!error) {
    const users = usersData.map((data) => new Task(data));

    res.json(users.map((user) => user.toResponse()));
  } else {
    res.status(code).send(error);
  }
});

router.route('/:id').get(async (req, res) => {
  const { boardId } = req.params;
  const { id } = req.params;

  await performRequest({
    sendRequest: () => tasksService.getTask(boardId, id),
    onSuccess: res.json.bind(res),
    onFailure: ({ code, error }) => res.status(code).send(error),
  });
});

router.route('/').post(async (req, res) => {
  const data = req.body;
  const { boardId } = req.params;

  await performRequest({
    sendRequest: () => tasksService.createTask(boardId, { ...data, boardId }),
    onSuccess: res.json.bind(res),
    onFailure: ({ code, error }) => res.status(code).send(error),
  });
});

router.route('/:id').put(async (req, res) => {
  const { id, boardId } = req.params;
  const data = req.body;

  await performRequest({
    sendRequest: () => tasksService.updateTask(boardId, { ...data, id }),
    onSuccess: res.json.bind(res),
    onFailure: ({ code, error }) => res.status(code).send(error),
  });
});

router.route('/:id').delete(async (req, res) => {
  const { id, boardId } = req.params;

  await performRequest({
    sendRequest: () => tasksService.deleteTask(boardId, id),
    onSuccess: res.json.bind(res),
    onFailure: ({ code, error }) => res.status(code).send(error),
  });
});

module.exports = router;
