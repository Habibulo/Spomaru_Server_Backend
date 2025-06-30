'use strict';

const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'MspaceInfo',
  tableName: 'mspace_info',
  columns: {
    mspace_id: {
      primary: true,
      unsigned: true,
      generated: true,
      comment: '메타 스페이스 id',
    },
    title: {
      type: 'varchar',
      comment: '메타 스페이스 이름',
    },
    image_name: { type: 'varchar' },
    description: { type: 'varchar' },
  },
});
