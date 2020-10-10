class User {
  constructor({
    id,
    name = 'USER',
    login = 'user',
    password = 'P@55w0rd',
  } = {}) {
    this.id = id;
    this.name = name;
    this.login = login;
    this.password = password;
  }

  toResponse() {
    const { id, name, login } = this;
    return { id, name, login };
  }
}

module.exports = User;
