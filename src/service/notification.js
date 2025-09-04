'use strict';

const crypto = require('crypto');
const { dataSource } = require('../utils/database');
const Notification = require('../entity/data/notification-info-schema');
const UserNotificationDismissal = require('../entity/data/user-notification-dismissal');
// Helpers
const uuid = () => crypto.randomUUID();

// Latest (by created_at) with optional filters
// Get the most recent notification by created_at
exports.getLatest = async () => {
  const conn = dataSource('data');
  const repo = conn.getRepository(Notification);

  return repo.createQueryBuilder('n')
    .orderBy('n.created_at', 'DESC')
    .getOne();
};


// Latest for a user (exclude dismissed)
exports.getLatestForUser = async (user_id, filters = {}) => {
  const conn = dataSource('data');
  const nRepo = conn.getRepository(Notification);
  const dRepo = conn.getRepository(UserNotificationDismissal);

  const dismissed = await dRepo.find({ where: { user_id } });
  const excludedIds = dismissed.map(d => d.notification_id);

  const qb = nRepo.createQueryBuilder('n')
    .orderBy('n.created_at', 'DESC');

  if (filters.language_type) qb.andWhere('n.language_type = :lt', { lt: filters.language_type });
  if (filters.popup_type) qb.andWhere('n.popup_type = :pt', { pt: filters.popup_type });
  if (filters.activeNow) {
    qb.andWhere('(n.start_date IS NULL OR n.start_date <= NOW())')
      .andWhere('(n.end_date IS NULL OR n.end_date >= NOW())')
      .andWhere('n.is_print = 1');
  }

  if (excludedIds.length) {
    qb.andWhere('n.id NOT IN (:...ids)', { ids: excludedIds });
  }

  return qb.getOne();
};

// List (with optional filters)
exports.list = async (filters = {}) => {
  const conn = dataSource('data');
  const repo = conn.getRepository(Notification);

  const qb = repo.createQueryBuilder('n').orderBy('n.priority', 'DESC').addOrderBy('n.created_at', 'DESC');

  if (filters.popup_type) qb.andWhere('n.popup_type = :popup_type', { popup_type: filters.popup_type });
  if (filters.language_type) qb.andWhere('n.language_type = :language_type', { language_type: filters.language_type });
  if (filters.activeNow) {
    qb.andWhere('(n.start_date IS NULL OR n.start_date <= NOW())')
      .andWhere('(n.end_date IS NULL OR n.end_date >= NOW())')
      .andWhere('n.is_print = 1');
  }

  return qb.getMany();
};

// Get one
exports.getById = async (id) => {
  const conn = dataSource('data');
  return conn.getRepository(Notification).findOne({ where: { id } });
};

// Create
exports.create = async (payload) => {
  const conn = dataSource('data');
  const repo = conn.getRepository(Notification);

  const entity = {
    id: uuid(),
    language_type: payload.language_type ?? 'ko',
    popup_type: payload.popup_type,
    start_date: payload.start_date ?? null,
    end_date: payload.end_date ?? null,
    priority: payload.priority ?? 50,
    is_print: payload.is_print ?? true,
    update_version: payload.update_version ?? null,
    update_date: payload.update_date ?? null,
    contents_category: payload.contents_category ?? null,
    title: payload.title,
    description: payload.description,
    image_url: payload.image_url ?? null,
  };

  await repo.save(entity);
  return entity;
};

// Update
exports.update = async (id, patch) => {
  const conn = dataSource('data');
  const repo = conn.getRepository(Notification);
  const existing = await repo.findOne({ where: { id } });
  if (!existing) throw new Error('Notification not found');

  Object.assign(existing, {
    language_type: patch.language_type ?? existing.language_type,
    popup_type: patch.popup_type ?? existing.popup_type,
    start_date: patch.start_date ?? existing.start_date,
    end_date: patch.end_date ?? existing.end_date,
    priority: patch.priority ?? existing.priority,
    is_print: typeof patch.is_print === 'boolean' ? patch.is_print : existing.is_print,
    update_version: patch.update_version ?? existing.update_version,
    update_date: patch.update_date ?? existing.update_date,
    contents_category: patch.contents_category ?? existing.contents_category,
    title: patch.title ?? existing.title,
    description: patch.description ?? existing.description,
    image_url: patch.image_url ?? existing.image_url,
  });

  await repo.save(existing);
  return existing;
};

// Delete
exports.remove = async (id) => {
  const conn = dataSource('data');
  const repo = conn.getRepository(Notification);
  const existing = await repo.findOne({ where: { id } });
  if (!existing) return { deleted: false };
  await repo.remove(existing);
  return { deleted: true };
};

// Mark "do not show again" (per user)
exports.dismissForUser = async (user_id, notification_id) => {
  const conn = dataSource('data');
  const repo = conn.getRepository(UserNotificationDismissal);

  const record = await repo.findOne({ where: { user_id, notification_id } });
  if (record) return record;

  const saved = await repo.save({ user_id, notification_id });
  return saved;
};

// Get list excluding dismissed by user (and optionally activeNow)
exports.listForUser = async (user_id, filters = {}) => {
  const conn = dataSource('data');

  const nRepo = conn.getRepository(Notification);
  const dRepo = conn.getRepository(UserNotificationDismissal);

  const dismissed = await dRepo.find({ where: { user_id } });
  const excludedIds = new Set(dismissed.map(d => d.notification_id));

  const all = await this.list(filters);
  return all.filter(n => !excludedIds.has(n.id));
};
