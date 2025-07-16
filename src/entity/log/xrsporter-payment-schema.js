'use strict';

const { EntitySchema } = require('typeorm');
const enums = require('../../constants/enums');

module.exports = new EntitySchema({
  name: 'XRSporterPayment',
  tableName: 'xrsporter_payment',
  comment: 'XRSporter Payment Table',
  columns: {
    seq: {
      primary: true,
      type: 'bigint',
      unsigned: true,
      generated: true,
      comment: 'Payment Unique Identifier',
    },
    name: {
      type: 'varchar',
      length: 255,
      comment: 'Name of the payer',
    },
    mac_address: {
      type: 'varchar',
      length: 17,
      comment: 'MAC Address of the payer',
    },
    type: {
      type: 'enum',
      enum: enums.LAUNCHER_TYPE,
      nullable: false,
    },
    end_date: {
      type: 'datetime',
      comment: '접속 시간',
    },
    created_at: {
      type: 'datetime',
    },
  },
  indices: [],
});
