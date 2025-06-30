'use strict';

const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'SetContent',
  tableName: 'set_content',
  comment: '',
  columns: {
    setcontent_id: { primary: true, unsigned: true, generated: true },
    set_id: {
      type: 'bigint',
      comment: '세트 ID',
      unsigned: true,
    },
    content_id: { type: 'varchar' },
  },
  relations: {
    SetInfo: {
      target: 'SetInfo',
      type: 'one-to-many',
    },
  },
});
