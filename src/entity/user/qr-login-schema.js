'use strict';

const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'QrLogin',
  tableName: 'qr_login',
  comment: '로그인 정보',
  columns: {
    id: { primary: true, type: 'varchar' },
    code: { type: 'varchar' },
    used: { type: 'tinyint' },
  },
});
