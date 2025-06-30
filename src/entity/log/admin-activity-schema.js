'use strict';

const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Activity Log',
  tableName: 'activity_log',
  comment: '관리자 활동 로그',
  columns: {
    seq: {
      primary: true,
      type: 'bigint',
      unsigned: true,
      generated: true,
      comment: '로그 고유번호',
    },
    admin_id: {
      type: 'varchar',
      length: 255,
      comment: '아이디',
    },
    action: {
      type: 'varchar',
      length: 255,
      comment: '수행된 동작 (예: 로그인, 로그아웃, 사용자 추가, 등)',
    },
    created_at: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      comment: '활동 기록 생성 시간',
    },
  },
});
