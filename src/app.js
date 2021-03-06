const express = require('express');
const swaggerUI = require('swagger-ui-express');
const path = require('path');
const YAML = require('yamljs');
const userRouter = require('./resources/users/user.router');
const boardRouter = require('./resources/boards/board.router');
const loginRouter = require('./login.router');
const loggingMiddleware = require('./middleware/logging.middleware');
const handleErrorsMiddleware = require('./middleware/handleErrors.middleware');
const checkTokenMiddleware = require('./middleware/checkToken.middleware');

const app = express();
const swaggerDocument = YAML.load(path.join(__dirname, '../doc/api.yaml'));

app.use(express.json());
app.use(loggingMiddleware);

app.use('/doc', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use('/', (req, res, next) => {
  if (req.originalUrl === '/') {
    res.send('Service is running!');
    return;
  }
  next();
});

app.use(checkTokenMiddleware);

app.use('/users', userRouter);

app.use('/boards', boardRouter);

app.use('/login', loginRouter);

app.use(handleErrorsMiddleware);

module.exports = app;
