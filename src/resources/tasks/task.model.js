class User {
  constructor({
    id,
    title = 'Title',
    order = 0,
    description = '',
    userId,
    boardId,
    columnId,
  } = {}) {
    this.id = id;
    this.title = title;
    this.order = order;
    this.description = description;
    this.userId = userId;
    this.boardId = boardId;
    this.columnId = columnId;
  }

  toResponse() {
    return this;
  }
}

module.exports = User;
