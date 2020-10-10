const router = require('express').Router();
const User = require('./user.model');
const usersService = require('./user.service');

router.route('/').get(async (req, res) => {
  const usersData = await usersService.getAll();
  const users = usersData.map((data) => new User(data));

  // map user fields to exclude secret fields like "password"
  res.json(users.map((user) => user.toResponse()));
});

router.route('/:id').get(async (req, res) => {
  const { id } = req.params;
  const userData = await usersService.getUser(id);
  const user = new User(userData);
  // map user fields to exclude secret fields like "password"
  res.json(user.toResponse());
});

router.route('/').post(async (req, res) => {
  const data = req.body;
  const userData = await usersService.createUser(data);
  const user = new User(userData);
  // map user fields to exclude secret fields like "password"
  res.json(user.toResponse());
});

router.route('/:id').put(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const userData = await usersService.updateUser({ ...data, id });
  const user = new User(userData);
  // map user fields to exclude secret fields like "password"
  res.json(user.toResponse());
});

router.route('/:id').delete(async (req, res) => {
  const { id } = req.params;
  const userData = await usersService.deleteUser(id);
  const user = new User(userData);
  // map user fields to exclude secret fields like "password"
  res.json(user.toResponse());
});

module.exports = router;
