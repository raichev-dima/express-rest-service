const createError = require('http-errors');
const { StatusCodes } = require('http-status-codes');
const Errors = require('./Errors');

function createErrorsBoundary(strategy) {
  return async (sendRequest) => {
    try {
      return await sendRequest();
    } catch (e) {
      switch (true) {
        case e.message.startsWith(Errors.NOT_FOUND_ERR):
          throw createError(
            StatusCodes.NOT_FOUND,
            strategy(Errors.NOT_FOUND_ERR)
          );
        case e.message.startsWith(Errors.NOT_FOUND_BOARD_ERR):
          throw createError(
            StatusCodes.NOT_FOUND,
            strategy(Errors.NOT_FOUND_BOARD_ERR)
          );
        default:
          throw createError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            strategy(Errors.UNKNOWN_SERVER_ERR)
          );
      }
    }
  };
}

module.exports = createErrorsBoundary;
