'use strict';

const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'FitnessPayment',
  tableName: 'fitness_payment',
  comment: 'Fitness Payment Table',
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
    end_date: {
      type: 'datetime',
      comment: '접속 시간',
    },
  },
  indices: [],
});
