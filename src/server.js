const { PORT } = require('./common/config');
const app = require('./app');
const connectToDB = require('./db/connect');

Promise.resolve()
  .then(() => connectToDB())
  .then(() => {
    app.listen(PORT, () =>
      console.log(`App is running on http://localhost:${PORT}`)
    );
  });
