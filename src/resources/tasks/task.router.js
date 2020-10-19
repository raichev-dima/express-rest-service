const router = require('express').Router({ mergeParams: true });
const Task = require('./task.model');
const tasksService = require('./task.service');

async function performRequest(sendRequest) {
  const taskData = await sendRequest();
  const user = new Task(taskData);

  return user.toResponse();
}

router.route('/').get(async (req, res, next) => {
  const { boardId } = req.params;
  const usersData = await tasksService.getAll(boardId).catch(next);
  const users = usersData.map((data) => new Task(data));

  return res.json(users.map((user) => user.toResponse()));
});

router.route('/:id').get(async (req, res, next) => {
  const { boardId } = req.params;
  const { id } = req.params;

  const task = await performRequest(() =>
    tasksService.getTask(boardId, id)
  ).catch(next);

  return res.json(task);
});

router.route('/').post(async (req, res, next) => {
  const data = req.body;
  const { boardId } = req.params;

  const task = await performRequest(() =>
    tasksService.createTask(boardId, { ...data, boardId })
  ).catch(next);

  return res.json(task);
});

router.route('/:id').put(async (req, res, next) => {
  const { id, boardId } = req.params;
  const data = req.body;

  const task = await performRequest(() =>
    tasksService.updateTask(boardId, { ...data, id })
  ).catch(next);

  return res.json(task);
});

router.route('/:id').delete(async (req, res, next) => {
  const { id, boardId } = req.params;

  await performRequest(() => tasksService.deleteTask(boardId, id)).catch(next);

  return res.sendStatus(204);
});

module.exports = router;
