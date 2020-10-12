const router = require('express').Router();
const User = require('./user.model');
const usersService = require('./user.service');

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
    sendRequest: () => usersService.getUser(id),
    onSuccess: res.json.bind(res),
    onFailure: ({ code, error }) => res.status(code).send(error),
  });
});

router.route('/').post(async (req, res) => {
  const data = req.body;

  await performRequest({
    sendRequest: () => usersService.createUser(data),
    onSuccess: res.json.bind(res),
    onFailure: ({ code, error }) => res.status(code).send(error),
  });
});

router.route('/:id').put(async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  await performRequest({
    sendRequest: () => usersService.updateUser({ ...data, id }),
    onSuccess: res.json.bind(res),
    onFailure: ({ code, error }) => res.status(code).send(error),
  });
});

router.route('/:id').delete(async (req, res) => {
  const { id } = req.params;

  await performRequest({
    sendRequest: () => usersService.deleteUser(id),
    onSuccess: res.json.bind(res),
    onFailure: ({ code, error }) => res.status(code).send(error),
  });
});

module.exports = router;
