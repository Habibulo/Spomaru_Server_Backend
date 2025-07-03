//토큰 관련

const jwt = require('jsonwebtoken');

/**
 * Verify a JWT token using the provided server secret.
 */

exports.verifyToken = (server, user) => {
  const decoded = jwt.verify(user, server);
  return decoded;
};

/**
 * Generate a JWT token using the provided data, token secret, and expiration time.
 */
exports.generateToken = (data, tkn, expiration) => {
  const token = jwt.sign(data, tkn, { expiresIn: expiration });
  return token;
};
