'use strict';

const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Admin',
  tableName: 'admin',
  comment: 'admin',
  columns: {
    seq: {
      primary: true,
      type: 'bigint',
      unsigned: true,
      generated: true,
      comment: '로그 고유번호',
    },
    id: {
      type: 'varchar',
      length: 255,
      comment: '아이디',
    },
    password: {
      type: 'varchar',
      length: 255,
      comment: '비밀번호',
    },
    name: {
      type: 'varchar',
      length: 255,
      comment: '이름',
    },
    role: {
      type: 'varchar',
      length: 255,
      comment: '역할',
    },
    salt: {
      type: 'varchar',
      length: 255,
    },
  },
});
