const morgan = require('morgan');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/exceptions.log' }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: 'logs/rejections.log' }),
  ],
  exitOnError: false,
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
      handleExceptions: true,
      handleRejections: true,
    })
  );
}

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write: function (message) {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    logger.info(message);
  },
};

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
