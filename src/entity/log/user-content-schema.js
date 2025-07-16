'use strict';

const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'UserContent',
  tableName: 'user_content',
  comment: 'User Content Table',
  columns: {
    seq: {
      primary: true,
      type: 'bigint',
      unsigned: true,
      generated: true,
      comment: 'Unique Identifier',
    },
    mac_address: {
      type: 'varchar',
      length: 17,
      comment: '계정 고유 번호',
    },
    content_id: {
      type: 'varchar',
      length: 45,
      nullable: true,
      comment: '콘텐츠 ID',
    },
    is_active: {
      type: 'tinyint',
      default: true,
    },
  },
});
