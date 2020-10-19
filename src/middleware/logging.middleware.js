const morgan = require('morgan');
const logger = require('../common/logger');

morgan.token('body', (req) => JSON.stringify(req.body));
morgan.token('params', (req) => JSON.stringify(req.params));

module.exports = morgan(
  function (tokens, req, res) {
    const url = tokens.url(req, res);

    return !url.startsWith('/doc')
      ? [
          `url: ${tokens.url(req, res)} |`,
          `params: ${tokens.params(req)} |`,
          `body: ${tokens.body(req)}`,
        ].join(' ')
      : null;
  },
  {
    stream: logger.stream,
  }
);
