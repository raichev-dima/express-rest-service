const Errors = require('./Errors');

function createErrorsBoundary(strategy) {
  return async (sendRequest) => {
    try {
      const data = await sendRequest();
      return { code: 200, data };
    } catch (e) {
      switch (true) {
        case e.message.startsWith(Errors.NOT_FOUND_ERR):
          return { code: 404, error: strategy(Errors.NOT_FOUND_ERR) };
        default:
          return { code: 500, error: strategy(Errors.UNKNOWN_SERVER_ERR) };
      }
    }
  };
}

module.exports = createErrorsBoundary;
