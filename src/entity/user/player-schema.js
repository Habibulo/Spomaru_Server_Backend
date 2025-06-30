'use strict';

const { EntitySchema } = require('typeorm');

const enums = require('../../constants/enums');

module.exports = new EntitySchema({
  name: 'Player',
  tableName: 'player',
  comment: '플레이어 정보',
  columns: {
    player_id: {
      primary: true,
      type: 'varchar',
      comment: '플레이어 ID',
    },
    user_seq: {
      type: 'bigint',
      unsigned: true,
    },
    slot_num: {
      type: 'int',
    },
    nickname: {
      type: 'varchar',
    },
    gender: {
      type: 'enum',
      enum: enums.GENDER,
    },
    age: { type: 'int' },
    weight: { type: 'float' },
    height: { type: 'float' },
    post: { type: 'varchar' },
    img: { type: 'varchar' },
    heartrate: { type: 'int' },
    bloodpressure_upper: { type: 'int' },
    bloodpressure_lower: { type: 'int' },
    bmi: { type: 'float' },
    muscle: { type: 'float' },
    fatrate: { type: 'float' },
    pants: { type: 'int' },
    abdomenrate: { type: 'float' },
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
  relations: {
    User: {
      target: 'UserAccount',
      type: 'one-to-many',
      joinColumn: {
        name: 'user_seq',
        referencedColumnName: 'seq',
      },
    },
  },
});
