const uuid = require('uuid');
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuid,
  },
  name: {
    type: String,
    default: 'USER',
  },
  login: {
    type: String,
    default: 'user',
  },
  password: {
    type: String,
    default: 'P@55w0rd',
  },
});

schema.method('toResponse', function () {
  const { _id: id, name, login } = this;
  return { id, name, login };
});

const User = mongoose.model('User', schema);

module.exports = User;
