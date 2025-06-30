'use strict';

const { EntitySchema } = require('typeorm');

const enums = require('../../constants/enums');

module.exports = new EntitySchema({
  name: 'ItemInfo',
  tableName: 'item_info',
  comment: '',
  columns: {
    item_id: {
      type: 'varchar',
      primary: true,
    },
    title: {
      type: 'varchar',
      length: 255,
    },
    description: { type: 'varchar', length: 255 },
    type: {
      type: 'enum',
      enum: enums.ITEM_TYPE,
    },
    parts: {
      type: 'enum',
      enum: enums.PARTS_TYPE,
    },
    img_name: {
      type: 'varchar',
    },
    pay_type: { type: 'enum', enum: enums.PAYMENT_TYPE },
    pay_value: { type: 'int' },
  },
});
