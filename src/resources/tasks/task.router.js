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
  try {
    const usersData = await tasksService.getAll(boardId);
    const users = usersData.map((data) => new Task(data));

    return res.json(users.map((user) => user.toResponse()));
  } catch (e) {
    next(e);
  }
});

router.route('/:id').get(async (req, res, next) => {
  try {
    const { boardId } = req.params;
    const { id } = req.params;

    const task = await performRequest(() => tasksService.getTask(boardId, id));

    return res.json(task);
  } catch (e) {
    next(e);
  }
});

router.route('/').post(async (req, res, next) => {
  try {
    const data = req.body;
    const { boardId } = req.params;

    const task = await performRequest(() =>
      tasksService.createTask(boardId, { ...data, boardId })
    );

    return res.json(task);
  } catch (e) {
    next(e);
  }
});

router.route('/:id').put(async (req, res, next) => {
  try {
    const { id, boardId } = req.params;
    const data = req.body;

    const task = await performRequest(() =>
      tasksService.updateTask(boardId, { ...data, id })
    );

    return res.json(task);
  } catch (e) {
    next(e);
  }
});

router.route('/:id').delete(async (req, res, next) => {
  try {
    const { id, boardId } = req.params;

    const task = await performRequest(() =>
      tasksService.deleteTask(boardId, id)
    );

    if (task) {
      return res.sendStatus(204);
    }
  } catch (e) {
    next(e);
  }
});

module.exports = router;
