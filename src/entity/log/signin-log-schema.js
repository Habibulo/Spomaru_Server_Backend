'use strict';

const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'SignInLog',
  tableName: 'signin_log',
  comment: '유저 로그인 로그',
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
    signed_at: {
      type: 'datetime',
      default: () => 'CURRENT_TIMESTAMP',
      comment: '접속 시간',
    },
  },
  indices: [{ columns: ['seq'] }],
});
