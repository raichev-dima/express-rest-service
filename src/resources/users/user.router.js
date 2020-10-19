const router = require('express').Router();
const User = require('./user.model');
const usersService = require('./user.service');

async function performRequest(sendRequest) {
  const userData = await sendRequest();

  const user = new User(userData);

  return user.toResponse();
}

router.route('/').get(async (req, res, next) => {
  try {
    const usersData = await usersService.getAll();
    const users = usersData.map((data) => new User(data));

    return res.json(users.map((user) => user.toResponse()));
  } catch (e) {
    next(e);
  }
});

router.route('/:id').get(async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await performRequest(() => usersService.getUser(id));
    return res.json(user);
  } catch (e) {
    next(e);
  }
});

router.route('/').post(async (req, res, next) => {
  try {
    const data = req.body;

    const user = await performRequest(() => usersService.createUser(data));
    return res.status(200).json(user);
  } catch (e) {
    next(e);
  }
});

router.route('/:id').put(async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const user = await performRequest(() =>
      usersService.updateUser({ ...data, id })
    );
    return res.json(user);
  } catch (e) {
    next(e);
  }
});

router.route('/:id').delete(async (req, res, next) => {
  try {
    const { id } = req.params;

    await performRequest(() => usersService.deleteUser(id));

    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
