const morgan = require('morgan');
const logger = require('../common/logger');

morgan.token('body', (req) => JSON.stringify(req.body));
morgan.token('query', (req) => JSON.stringify(req.query));

module.exports = morgan(
  function (tokens, req, res) {
    const url = tokens.url(req, res);

    return !url.startsWith('/doc')
      ? [
          `url: ${tokens.url(req, res)} |`,
          `query: ${tokens.query(req)} |`,
          `body: ${tokens.body(req)}`,
        ].join(' ')
      : null;
  },
  {
    stream: logger.stream,
  }
);
