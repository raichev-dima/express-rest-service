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
  order: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    default: '',
  },
  userId: String,
  boardId: String,
  columnId: String,
});

schema.method('toResponse', function () {
  const {
    _id: id,
    title,
    order,
    description,
    userId,
    boardId,
    columnId,
  } = this;
  return { id, title, order, description, userId, boardId, columnId };
});

const Task = mongoose.model('Task', schema);

module.exports = Task;
