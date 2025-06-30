'use strict';

const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'PlayerStamp',
  tableName: 'player_stamp',
  columns: {
    seq: {
      primary: true,
      type: 'bigint',
      unsigned: true,
      generated: true,
    },
    player_id: {
      type: 'varchar',
    },
    stamp_id: {
      type: 'bigint',
    },
  },
});
