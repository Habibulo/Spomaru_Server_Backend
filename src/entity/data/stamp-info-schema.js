'use strict';
const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'StampInfo',
  tableName: 'stamp_info',
  comment: '',
  columns: {
    stamp_id: {
      primary: true,
      type: 'bigint',
      unsigned: true,
      generated: true,
    },
    title: {
      type: 'varchar',
    },
    img_name: {
      type: 'varchar',
    },
    description: {
      type: 'varchar',
    },
  },
});
