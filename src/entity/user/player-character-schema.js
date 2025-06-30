'use strict';

const { EntitySchema } = require('typeorm');

const enums = require('../../constants/enums');

module.exports = new EntitySchema({
  name: 'PlayerCharacter',
  tableName: 'player_character',
  comment: '플레이어 캐릭터 정보',
  columns: {
    character_id: { primary: true, type: 'bigint', unsigned: true, generated: true, comment: '캐릭터 ID' },
    player_id: { type: 'varchar', comment: '플레이어 ID' },
    gender: { type: 'enum', enum: enums.GENDER, comment: '캐릭터 성별' },
    face: { type: 'int', nullable: true, comment: '얼굴' },
    skin: { type: 'int', nullable: true, comment: '피부색' },
    hair: { type: 'int', nullable: true, comment: '헤어' },
    haircolor: { type: 'int', nullable: true, comment: '헤어 컬러' },
    top: { type: 'int', nullable: true, comment: '상의' },
    bottom: { type: 'int', nullable: true, comment: '하의' },
    shoes: { type: 'int', nullable: true, comment: '신발' },
    acc: { type: 'int', nullable: true, comment: '장신구' },
    mspace_id: {
      type: 'varchar',
      nullable: true,
      comment: '메타 스페이스 id',
    },
    updated_at: {
      type: 'datetime',
      nullable: true,
      onUpdate: 'CURRENT_TIMESTAMP',
      comment: '갱신 시간',
    },
    created_at: {
      type: 'datetime',
      default: () => 'CURRENT_TIMESTAMP',
      comment: '생성 시간',
    },
  },
  relations: {
    Player: {
      target: 'Player',
      type: 'one-to-one',
      joinColumn: {
        name: 'player_id',
        referencedColumnName: 'player_id',
      },
    },
  },
});
