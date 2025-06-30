'use strict';

const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'SystemInfo',
  table_name: 'system_info',
  comment: '시스템 정보',
  columns: {
    seq: {
      primary: true,
      type: 'bigint',
      unsigned: true,
      generated: true,
      comment: '시스템 고유 번호',
    },
    launcher_ver: { type: 'varchar' },
    ios_ver: { type: 'varchar' },
    aos_ver: { type: 'varchar' },
    middleware_ver: { type: 'varchar' },
    sensor_ver1: { type: 'varchar' },
    sensor_ver2: { type: 'varchar' },
    sensor_ver3: { type: 'varchar' },
    sensor_ver4: { type: 'varchar' },
    sensor_ver5: { type: 'varchar' },
    sensor_ver6: { type: 'varchar' },
    sensor_ver7: { type: 'varchar' },
    sensor_ver8: { type: 'varchar' },
    spomaru_ver: { type: 'varchar' },
    fitness_ver: { type: 'varchar' },
  },
});
