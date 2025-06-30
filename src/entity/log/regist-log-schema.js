'use strict';

const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'RegistLog',
  tableName: 'regist_log',
  comment: '유저 가입 로그',
  columns: {
    seq: {
      primary: true,
      type: 'bigint',
      unsigned: true,
      generated: true,
      comment: '로그 고유번호',
    },
    email: {
      type: 'varchar',
      length: 128,
      comment: '아이디',
    },
    register_at: {
      type: 'datetime',
      default: () => 'CURRENT_TIMESTAMP',
      comment: '가입 시간',
    },
  },
  indices: [{ columns: ['seq'] }],
});
