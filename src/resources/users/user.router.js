const router = require('express').Router();
const User = require('./user.model');
const usersService = require('./user.service');

async function performRequest(sendRequest) {
  const userData = await sendRequest();

  const user = new User(userData);

  return user.toResponse();
}

router.route('/').get(async (req, res, next) => {
  const usersData = await usersService.getAll().catch(next);
  const users = usersData.map((data) => new User(data));

  return res.json(users.map((user) => user.toResponse()));
});

router.route('/:id').get(async (req, res, next) => {
  const { id } = req.params;

  const user = await performRequest(() => usersService.getUser(id)).catch(next);
  return res.json(user);
});

router.route('/').post(async (req, res, next) => {
  const data = req.body;

  const user = await performRequest(() => usersService.createUser(data)).catch(
    next
  );
  return res.status(200).json(user);
});

router.route('/:id').put(async (req, res, next) => {
  const { id } = req.params;
  const data = req.body;

  const user = await performRequest(() =>
    usersService.updateUser({ ...data, id })
  ).catch(next);
  return res.json(user);
});

router.route('/:id').delete(async (req, res, next) => {
  const { id } = req.params;

  await performRequest(() => usersService.deleteUser(id)).catch(next);
  return res.sendStatus(204);
});

module.exports = router;
