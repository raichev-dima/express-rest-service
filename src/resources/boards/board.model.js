class Board {
  constructor({ id, title = 'Title', columns = [] } = {}) {
    this.id = id;
    this.title = title;
    this.columns = columns;
  }

  toResponse() {
    const { id, title, columns } = this;
    return { id, title, columns };
  }
}

module.exports = Board;
