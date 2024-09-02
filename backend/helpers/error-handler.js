/**
 * Error handler middleware for Express applications.
 *
 * This middleware function handles various types of errors that occur during request processing.
 *
 * @param {Object} err - The error object that contains information about the error.
 * @param {Object} req - The request object that represents the HTTP request.
 * @param {Object} res - The response object used to send a response to the client.
 * @param {Function} next - The next middleware function in the stack.
 *
 * @returns {void} Sends a JSON response to the client with an appropriate status code and message.
 */
function errorHandler(err, req, res, next) {
  // Handle unauthorized errors
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ message: "The user is not authorized" });
  }
  // Handle validation errors
  else if (err.name === "ValidationError") {
    res.status(400).json({ message: err.message });
  }
  // Handle all other errors
  else {
    res.status(500).json({ message: "Error in the server", err });
  }
}

module.exports = errorHandler;
