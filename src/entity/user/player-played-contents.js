'use strict';

const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'PlayerPlayed',
  tableName: 'player_played',
  columns: {
    seq: {
      primary: true,
      type: 'bigint',
      unsigned: true,
      generated: true,
    },
    content_id: {
      type: 'varchar',
      length: 50,
    },
    player_id: { type: 'varchar' },
    heartrate: {
      type: 'int',
    },
    playtime: {
      type: 'int',
    },
    score: {
      type: 'int',
    },
    calorie: {
      type: 'int',
    },
    grade: {
      type: 'int',
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
