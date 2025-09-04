'use strict';
const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'UserNotificationDismissal',
  tableName: 'user_notification_dismissal',
  comment: 'Per-user do-not-show-again state for notifications',
  columns: {
    id: { primary: true, type: 'int', generated: true },
    user_id: { type: 'varchar', length: 255, nullable: false },
    notification_id: { type: 'varchar', length: 36, nullable: false },
    dismissed_at: { type: 'datetime', default: () => 'CURRENT_TIMESTAMP' },
  },
  indices: [
    { name: 'UNQ_user_notification', columns: ['user_id', 'notification_id'], unique: true },
  ],
});
