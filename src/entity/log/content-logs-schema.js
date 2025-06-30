'use strict';

const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'ContentLogs',
  tableName: 'content_logs',
  comment: 'content logs',
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
    download: {
      type: 'int',
    },
    exec: {
      type: 'int',
    },
    updated_at: {
      type: 'datetime',
      default: () => 'CURRENT_TIMESTAMP',
      comment: '업데이트 시간',
    },
  },
});
