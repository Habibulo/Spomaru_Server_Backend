'use strict';

const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'PlayerCurrent',
  tableName: 'player_set_content',
  columns: {
    set_content_id: {
      primary: true,
      unsigned: true,
      generated: true,
    },
    player_id: { type: 'varchar' },
    set_id: {
      type: 'int',
    },
    content_id: {
      type: 'int',
    },
    is_complete: {
      type: 'int',
      default: 0,
    },
  },
});
