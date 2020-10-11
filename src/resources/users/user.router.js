const router = require('express').Router();
const User = require('./user.model');
const usersService = require('./user.service');
const boardsService = require('../boards/board.service');
const tasksService = require('../tasks/task.service');

async function performRequest({ sendRequest, onSuccess, onFailure }) {
  const { error, code, data: userData } = await sendRequest();
  const user = new User(userData);

  if (!error) {
    const response = user.toResponse();

    onSuccess(response);
  } else {
    onFailure({ code, error });
  }
}

router.route('/').get(async (req, res) => {
  const { error, code, data: usersData } = await usersService.getAll();

  if (!error) {
    const users = usersData.map((data) => new User(data));

    res.json(users.map((user) => user.toResponse()));
  } else {
    res.status(code).send(error);
  }
});

router.route('/:id').get(async (req, res) => {
  const { id } = req.params;

  await performRequest({
    sendRequest: async () => usersService.getUser(id),
    onSuccess: res.json.bind(res),
    onFailure: ({ code, error }) => res.status(code).send(error),
  });
});

router.route('/').post(async (req, res) => {
  const data = req.body;

  await performRequest({
    sendRequest: async () => usersService.createUser(data),
    onSuccess: res.json.bind(res),
    onFailure: ({ code, error }) => res.status(code).send(error),
  });
});

router.route('/:id').put(async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  await performRequest({
    sendRequest: async () => usersService.updateUser({ ...data, id }),
    onSuccess: res.json.bind(res),
    onFailure: ({ code, error }) => res.status(code).send(error),
  });
});

router.route('/:id').delete(async (req, res) => {
  const { id } = req.params;

  const sendRequest = async () => {
    const user = await usersService.deleteUser(id);

    const { data: boards, error: boardsError } = await boardsService.getAll();

    if (!boardsError) {
      const tasks = await Promise.all(
        boards.map(async (board) => tasksService.getAll(board.id))
      ).then((results) =>
        results.flatMap(({ data, error }) => {
          if (!error) {
            return data;
          }

          throw new Error('There is an error during the tasks fetch');
        })
      );

      const boundTasks = tasks.filter(({ userId }) => userId === id);

      await Promise.all(
        boundTasks.map(async (task) =>
          tasksService.updateTask(task.boardId, { ...task, userId: null })
        )
      );
    }

    return user;
  };

  await performRequest({
    sendRequest,
    onSuccess: res.json.bind(res),
    onFailure: ({ code, error }) => res.status(code).send(error),
  });
});

module.exports = router;
