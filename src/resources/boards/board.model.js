const uuid = require('uuid');
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuid,
  },
  title: {
    type: String,
    default: 'Title',
  },
  columns: {
    type: Array,
    default: [],
  },
});

schema.method('toResponse', function () {
  const { _id: id, title, columns } = this;

  return { id, title, columns };
});

const Board = mongoose.model('Board', schema);

module.exports = Board;
