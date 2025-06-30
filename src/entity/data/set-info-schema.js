'use strict';
const { EntitySchema } = require('typeorm');

const enums = require('../../constants/enums');

module.exports = new EntitySchema({
  name: 'SetInfo',
  tableName: 'set_info',
  comment: '',
  columns: {
    set_id: {
      primary: true,
      type: 'varchar',
      comment: '세트 ID',
    },
    type: {
      type: 'enum',
      enum: enums.SET_TYPE,
      comment: '세트 타입',
    },
    title: {
      type: 'varchar',
      comment: '세트 제목',
    },
    img_name: {
      type: 'varchar',
      comment: '이미지',
    },
    description: {
      type: 'varchar',
    },
    body_type: {
      type: 'varchar',
    },
    stat_1: { type: 'enum', enum: enums.STAT_TYPE },
    stat_2: { type: 'enum', nullable: true, enum: enums.STAT_TYPE },
    stat_3: { type: 'enum', nullable: true, enum: enums.STAT_TYPE },
    stat_4: { type: 'enum', nullable: true, enum: enums.STAT_TYPE },
    stat_5: { type: 'enum', nullable: true, enum: enums.STAT_TYPE },
    stat_6: { type: 'enum', nullable: true, enum: enums.STAT_TYPE },
    reward: {
      type: 'varchar',
    },
  },
});
