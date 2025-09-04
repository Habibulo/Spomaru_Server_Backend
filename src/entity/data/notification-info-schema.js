'use strict';
const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Notification',
  tableName: 'notification',
  comment: 'Generic popup notifications for admin/web/electron',

  columns: {
    id: { primary: true, type: 'varchar', length: 36 },
    language_type: { type: 'enum', enum: ['en', 'ko', 'ja'], nullable: false, default: 'ko' },
    popup_type: { type: 'enum', enum: ['update', 'news', 'maintenance', 'promo', 'alert'], nullable: false },

    start_date: { type: 'datetime', nullable: true },
    end_date: { type: 'datetime', nullable: true },

    priority: { type: 'tinyint', unsigned: true, default: 50, nullable: false },

    is_print: { type: 'bool', default: true },

    update_version: { type: 'varchar', nullable: true },
    update_date: { type: 'datetime', nullable: true },

    contents_category: { type: 'varchar', nullable: true },

    title: { type: 'varchar', length: 255, nullable: false },
    description: { type: 'text', nullable: false },

    image_url: { type: 'varchar', length: 1024, nullable: true },

    created_at: { type: 'datetime', default: () => 'CURRENT_TIMESTAMP' },
    updated_at: { type: 'datetime', nullable: true, onUpdate: 'CURRENT_TIMESTAMP', default: () => 'CURRENT_TIMESTAMP' },
  },

  indices: [
    { name: 'IDX_notification_active_window', columns: ['start_date', 'end_date'] },
    { name: 'IDX_notification_priority', columns: ['priority'] },
    { name: 'IDX_notification_popup_type', columns: ['popup_type'] },
  ],
});
