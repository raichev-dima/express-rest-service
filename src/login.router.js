const router = require('express').Router();
const { StatusCodes } = require('http-status-codes');

const loginService = require('./login.service');

router.route('/').post(async (req, res, next) => {
  try {
    const { login, password } = req.body;

    const token = await loginService.signToken(login, password);

    if (!token) {
      res.status(StatusCodes.FORBIDDEN).send('Wrong login or password');
    } else {
      res.status(StatusCodes.OK).json({ token });
    }
  } catch (e) {
    next(e);
  }
});

module.exports = router;
