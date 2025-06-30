'use strict';

const jsonwebtoken = require('jsonwebtoken');
const config = require('../../config');
const logger = require('../utils/logger');
const errors = require('../constants/errors');

const adminMiddleware = {};

/**
 * Generate an access token for the admin. Used for admin dashboard.
 */
adminMiddleware.getAccessToken = (admin) => {
  const payload = { seq: admin.seq, id: admin.id, role: admin.role };
  return jsonwebtoken.sign(payload, config.jwt.admin.access_secret_key, config.jwt.admin.access_token_option);
};

adminMiddleware.getRefreshToken = (admin) => {
  const payload = { seq: admin.seq, id: admin.id, role: admin.role };
  return jsonwebtoken.sign(payload, config.jwt.admin.refresh_secret_key, config.jwt.admin.refresh_token_option);
};

adminMiddleware.exchangeToken = (refreshToken) => {
  let decodedToken;

  try {
    decodedToken - jsonwebtoken.verify(refreshToken, config.jwt.admin.refresh_secret_key);
  } catch (err) {
    logger.error(`[refreshTokenError]:${refreshToken}`, err);
    throw errors.ERROR_CODE.REFRESH_EXPIRED;
  }
};

module.exports = adminMiddleware;
