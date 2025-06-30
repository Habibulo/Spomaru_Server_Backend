'use strict';

const { dataSource } = require('../utils/database');
const qrLoginSchema = require('../entity/user/qr-login-schema');

/**
 *
 * @param {*} id
 * @param {*} code
 */
exports.saveCode = async (id, code) => {
  const ds = dataSource('user');
  const repo = ds.getRepository(qrLoginSchema);
  await repo.save({ id: id, code: code });
};
/**
 *
 * @param {*} code
 * @returns
 */
exports.getCode = async (code) => {
  const ds = dataSource('user');
  const repo = ds.getRepository(qrLoginSchema);
  const result = await repo.findOneBy({ code: code });
  return result;
};
/**
 *
 * @param {*} code
 * @returns
 */
exports.checkUsed = async (code) => {
  const ds = dataSource('user');
  const repo = ds.getRepository(qrLoginSchema);

  await repo.update({ code: code }, { used: 1 });

  const updated = await repo.findOneBy({ code: code });
  return updated;
};
/**
 *
 * @param {*} eventId
 * @returns
 */
exports.deleteCodeRecord = async (eventId) => {
  const ds = dataSource('user');
  const repo = ds.getRepository(qrLoginSchema);

  const deleted = await repo.delete({ id: eventId });
  return deleted;
};
/**
 *
 * @returns
 */
exports.deleteAllCodes = async () => {
  const ds = dataSource('user');
  const repo = ds.getRepository(qrLoginSchema);

  const deleted = await repo.delete({});
  return deleted;
};
