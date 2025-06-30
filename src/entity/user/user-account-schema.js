'use strict';

const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'UserAccount',
  tableName: 'user_account',
  comment: '유저 계정 정보',
  columns: {
    seq: {
      primary: true,
      type: 'bigint',
      unsigned: true,
      generated: true,
      comment: '계정 고유 번호',
    },
    email: {
      type: 'varchar',
      length: 128,
      unique: true,
      comment: '아이디',
    },
    login_platform: {
      type: 'varchar',
      length: 128,
      comment: '로그인 플랫폼 타입',
    },
    auth_key: {
      type: 'varchar',
      length: 255,
      nullable: true,
      comment: '인증 키',
    },
    user_state: {
      type: 'varchar',
      length: 45,
    },
    user_get_cash: {
      type: 'bigint',
      unsigned: true,
      default: 0,
      comment: '총 획득 캐시',
    },
    user_use_cash: {
      type: 'bigint',
      unsigned: true,
      default: 0,
      comment: '총 사용 캐시',
    },
    user_paid_cash: {
      type: 'bigint',
      unsigned: true,
      default: 0,
      comment: '과금하여 획득한 캐시',
    },
    updated_at: {
      type: 'datetime',
      nullable: true,
      onUpdate: 'CURRENT_TIMESTAMP',
      comment: '갱신 시간',
    },
    created_at: {
      type: 'datetime',
      default: () => 'CURRENT_TIMESTAMP',
      comment: '생성 시간',
    },
  },
});
