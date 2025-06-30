'use strict';

const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'PlayerStats',
  tableName: 'player_stats',
  comment: '플레이어 능력지 정보',
  columns: {
    seq: { primary: true, type: 'bigint', unsigned: true, generated: true },
    player_id: { type: 'varchar' },
    ustr: { type: 'float', comment: '상체 근력' },
    lstr: { type: 'float', comment: '하체 근력' },
    dur: { type: 'float', comment: '심폐지구력' },
    fle: { type: 'varchar', length: 45, comment: '유연성' },
    fla: { type: 'float', comment: '평형성' },
    coo: { type: 'float', comment: '협응력' },
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
