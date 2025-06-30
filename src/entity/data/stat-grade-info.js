'use strict';

const { EntitySchema } = require('typeorm');
const enums = require('../../constants/enums');

module.exports = new EntitySchema({
  name: 'StatGradeInfo',
  tableName: 'stat_grade_info',
  comment: '',
  columns: {
    stat_id: {
      primary: true,
      type: 'bigint',
      unsigned: true,
      generated: true,
    },
    stat_type: {
      type: 'enum',
      enum: enums.STAT_TYPE,
    },
    stat_grade: {
      type: 'int',
    },
    stat_value: {
      type: 'int',
    },
  },
});
