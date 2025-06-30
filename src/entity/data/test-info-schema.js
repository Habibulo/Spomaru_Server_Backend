'use strict';

const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'TestInfo', //table name = test_info
  tableName: 'test_info',
  comment: '테스트 정보',
  columns: {
    //primary key unique
    test_id: {
      primary: true,
      type: 'bigint',
      unsigned: true,
      generated: true,
    },
    title: {
      type: 'varchar',
      nullable: false,
    },
    update_at: {
      type: 'datetime',
      nullable: true,
      onUpdate: 'CURRENT_TIMESTAMP',
    },
    create_at: {
      type: 'datetime',
      nullable: false,
      default: () => 'CURRENT_TIMESTAMP',
    },
  },
});


// -> workbench 