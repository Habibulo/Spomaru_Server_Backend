'use strict';

const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'PlayerFavorite',
  tableName: 'player_favorite',
  comment: '',
  columns: {
    fav_id: {
      primary: true,
      type: 'bigint',
      unsigned: true,
      generated: true,
    },
    player_id: { type: 'varchar' },
    content_id: { type: 'bigint', unsigned: true },
  },
});
