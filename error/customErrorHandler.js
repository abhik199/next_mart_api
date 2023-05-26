class customErrorHandler extends Error {
  constructor(status, msg) {
    super();
    this.status = status;
    this.message = msg;
  }

  static alreadyExist(message = "Email is already token") {
    return new customErrorHandler(409, message);
  }

  static wrongCredentials(message = "username or password is not match!") {
    return new customErrorHandler(401, message);
  }
  static notFound(message = "user is not found") {
    return new customErrorHandler(404, message);
  }
}

module.exports = customErrorHandler;
