const mongoose = require('mongoose');
const { MONGO_CONNECTION_STRING } = require('../common/config');

const userService = require('../resources/users/user.service');

function connect() {
  return new Promise((resolve, reject) => {
    mongoose.connect(MONGO_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    const db = mongoose.connection;

    db.on('error', (err) => {
      err.message = `connection error: ${err.message}`;
      reject(err);
    });

    db.once('open', async function () {
      console.log('Database connection is established');
      await db.dropDatabase();

      await userService.createUser({
        login: 'admin',
        name: 'admin',
        password: 'admin',
      });
      resolve();
    });
  });
}

module.exports = connect;
