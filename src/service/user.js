'use strict';

const UserAccount = require('../entity/user/user-account-schema');
const { dataSource } = require('../utils/database');
const logger = require('../utils/logger');

/**
 *
 * @param {*} email
 * @returns
 */
exports.getUserInfo = async (email) => {
  const connection = dataSource('user');
  const userRepository = connection.getRepository(UserAccount);

  const user = await userRepository.find({ where: { email } });

  return user;
};

/**
 *
 * @returns
 */
exports.getUsersInfo = async () => {
  try {
    const connection = dataSource('user');
    const userRepository = connection.getRepository(UserAccount);
    const users = await userRepository.find();
    return users;
  } catch (err) {
    console.error('Error retrieving user information:', err);
    return [];
  }
};

/**
 *
 * @param {Object} user
 * @returns
 */

exports.createUser = async (user) => {
  try {
    const connection = dataSource('user');
    const repo = connection.getRepository(UserAccount);
    const oldUser = await repo.findOneBy({ email: user.email });

    if (oldUser) {
      return 'EXISTING USER';
    }

    const newUser = await repo.save(user);
    return newUser;
  } catch (err) {
    logger.warn(err);
    return false;
  }
};

/**
 *
 * @param {*} email
 * @param {*} status
 * @returns
 */

exports.changeState = async (email, status) => {
  try {
    const connection = dataSource('user');
    const userRepository = connection.getRepository(UserAccount);
    const user = await userRepository.findOneBy({ email: email });
    if (!user) {
      return 'NO_EXIST';
    }

    const uppercaseStatus = status.toUpperCase();
    user.user_state = uppercaseStatus;
    const userInfo = await userRepository.save(user);
    return userInfo;
  } catch (err) {
    return;
  }
};

/**
 *
 * @param {*} email
 * @param {*} type
 * @param {*} amount
 * @returns
 */

exports.updateUserCash = async (email, type, amount) => {
  try {
    const connection = dataSource('user');
    const userRepository = connection.getRepository(UserAccount);
    const user = await userRepository.findOneBy({ email: email });
    if (!user) {
      return 'NO_EXIST';
    }
    if (type == 'get') {
      user.user_get_cash = amount;
    } else if (type == 'use') {
      user.user_use_cash = amount;
    }

    const cashUpdate = await userRepository.save(user);
    return cashUpdate;
  } catch (err) {
    return;
  }
};
