'use strict';

const { EntitySchema } = require('typeorm');

const enums = require('../../constants/enums');

module.exports = new EntitySchema({
  name: 'PlayerInventory',
  tableName: 'player_inventory',
  comment: '플레이어 인벤토리 정보',
  columns: {
    seq: { primary: true, type: 'bigint', unsigned: true, generated: true },
    player_id: { type: 'varchar' },
    item_id: { type: 'bigint' },
    item_reason: { type: 'enum', enum: enums.ITEM_REASON_TYPE },
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
