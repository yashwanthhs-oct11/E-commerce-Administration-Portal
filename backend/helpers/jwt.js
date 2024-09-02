const { expressjwt: expressJwt } = require("express-jwt");

/**
 * Middleware to authenticate JSON Web Tokens (JWT) using express-jwt.
 * 
 * This middleware configures JWT authentication with a secret and algorithm, and specifies 
 * paths that do not require authentication. It also uses a function to determine if a token 
 * should be revoked based on user roles.
 * 
 * @returns {Function} The configured express-jwt middleware function.
 */
function authJwt() {
  const secret = process.env.secret; // The secret used to sign the JWT
  const api = process.env.API_URL;   // Base URL for the API

  return expressJwt({
    secret,
    algorithms: ["HS256"], // Algorithm used for signing the JWT
    isRevoked: isRevoked,  // Function to determine if a token is revoked
  }).unless({
    path: [
      // Publicly accessible routes
      { url: /\/public\/uploads(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/products(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/categories(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/orders(.*)/, methods: ["GET", "OPTIONS", "POST"] },
      `${api}/users/login`,      // Login route
      `${api}/users/register`,  // Registration route
    ],
  });
}

/**
 * Function to determine if a JWT should be revoked based on user roles.
 * 
 * This function checks if the user in the token payload has the `isAdmin` property. 
 * Tokens are revoked for non-admin users.
 * 
 * @param {Object} req - The request object.
 * @param {Object} payload - The decoded JWT payload.
 * @param {Function} done - The callback function to indicate if the token is revoked.
 * 
 * @returns {void} Calls the `done` callback with the revocation status.
 */
async function isRevoked(req, payload, done) {
  if (!payload.isAdmin) {
    return done(null, true); // Token is revoked for non-admin users
  }
  done(); // Token is not revoked
}

module.exports = authJwt;
