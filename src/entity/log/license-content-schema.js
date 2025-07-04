'use strict';

const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'LicenseContent',
  tableName: 'license_content',
  comment: 'License Content Table',
  columns: {
    seq: {
      primary: true,
      type: 'bigint',
      unsigned: true,
      generated: true,
    },
    mac_address: {
      type: 'varchar',
      length: 255,
      comment: 'MAC Address of the payer',
    },
    category: {
      type: 'varchar',
      length: 255,
    },
    sensor: {
      type: 'varchar',
      length: 255,
    },
    screen: {
      type: 'varchar',
      length: 255,
    },
  },
  indices: [],
});
