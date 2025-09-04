'use strict';

const Result = require('../utils/result');
const errors = require('../constants/errors');
const logger = require('../utils/logger');
const notificationService = require('../service/notification');

// GET /api/notification/latest
exports.getLatest = async (ctx) => {
  try {
    const latest = await notificationService.getLatest();

    if (!latest) {
      return Result.success(ctx, { content: null }, 'No notifications available.');
    }

    // Format update_date as the created_at in YYYY-MM-DD
    latest.update_date = latest.created_at?.toISOString().split('T')[0];

    return Result.success(ctx, { content: latest });
  } catch (err) {
    logger.error(err.message);
    return Result.error(ctx, errors.ERROR_CODE.INTERNAL_SERVER_ERROR, err.message);
  }
};

// GET /api/notification
exports.list = async (ctx) => {
  try {
    const { popup_type, language_type, activeNow, user_id } = ctx.query;
    const filters = {
      popup_type,
      language_type,
      activeNow: activeNow === 'true',
    };

    const data = user_id
      ? await notificationService.listForUser(user_id, filters)
      : await notificationService.list(filters);

    return Result.success(ctx, { content: data });
  } catch (err) {
    logger.error(err.message);
    return Result.error(ctx, errors.ERROR_CODE.INTERNAL_SERVER_ERROR, err.message);
  }
};

// GET /api/notification/:id
exports.getById = async (ctx) => {
  const { id } = ctx.params;
  if (!id) return Result.error(ctx, errors.ERROR_CODE.PARAMS_EMPTY, 'id is required');
  try {
    const row = await notificationService.getById(id);
    if (!row) return Result.error(ctx, errors.ERROR_CODE.NOT_FOUND, 'Notification not found');
    return Result.success(ctx, { content: row });
  } catch (err) {
    return Result.error(ctx, errors.ERROR_CODE.INTERNAL_SERVER_ERROR, err.message);
  }
};

// POST /api/notification
exports.create = async (ctx) => {
  try {
    const created = await notificationService.create(ctx.request.body);
    return Result.success(ctx, { content: created }, 'Create Notification Success.');
  } catch (err) {
    logger.error(err.message);
    return Result.error(ctx, errors.ERROR_CODE.INTERNAL_SERVER_ERROR, err.message);
  }
};

// PUT /api/notification/:id
exports.update = async (ctx) => {
  const { id } = ctx.params;
  if (!id) return Result.error(ctx, errors.ERROR_CODE.PARAMS_EMPTY, 'id is required');
  try {
    const updated = await notificationService.update(id, ctx.request.body);
    return Result.success(ctx, { content: updated }, 'Updated successfully.');
  } catch (err) {
    logger.error(err.message);
    return Result.error(ctx, errors.ERROR_CODE.INTERNAL_SERVER_ERROR, err.message);
  }
};

// DELETE /api/notification/:id
exports.remove = async (ctx) => {
  const { id } = ctx.params;
  if (!id) return Result.error(ctx, errors.ERROR_CODE.PARAMS_EMPTY, 'id is required');
  try {
    const res = await notificationService.remove(id);
    if (!res.deleted) return Result.error(ctx, errors.ERROR_CODE.NOT_FOUND, 'Notification not found');
    return Result.success(ctx, { deleted: true }, 'Deleted successfully.');
  } catch (err) {
    logger.error(err.message);
    return Result.error(ctx, errors.ERROR_CODE.INTERNAL_SERVER_ERROR, err.message);
  }
};

// POST /api/notification/:id/dismiss  (body: { user_id })
exports.dismiss = async (ctx) => {
  const { id } = ctx.params;
  const { user_id } = ctx.request.body || {};
  if (!id || !user_id) {
    return Result.error(ctx, errors.ERROR_CODE.PARAMS_EMPTY, 'id and user_id are required');
  }
  try {
    const saved = await notificationService.dismissForUser(user_id, id);
    return Result.success(ctx, { content: saved }, 'Dismissed for user.');
  } catch (err) {
    logger.error(err.message);
    return Result.error(ctx, errors.ERROR_CODE.INTERNAL_SERVER_ERROR, err.message);
  }
};
