'use strict';

const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'ContentVersion',
  tableName: 'content_version',
  comment: 'content version',
  columns: {
    seq: {
      primary: true,
      type: 'bigint',
      unsigned: true,
      generated: true,
      comment: '로그 고유번호',
    },
    content_id: {
      type: 'varchar',
      length: 45,
      nullable: false,
      comment: '콘텐츠 ID',
    },
    version: {
      type: 'varchar',
      length: '45',
      nullable: false,
    },
    released_at: {
      type: 'datetime',
      default: () => 'CURRENT_TIMESTAMP',
      comment: '업데이트 시간',
    },
  },
});
