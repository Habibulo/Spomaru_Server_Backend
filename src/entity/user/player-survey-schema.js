'use strict';

const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'PlayerSurvey',
  tableName: 'player_survey',
  comment: '플레이어 측정 설문 답변',
  columns: {
    survey_id: { primary: true, type: 'bigint', unique: true, generated: true },
    player_id: { type: 'varchar' },
    question_id: { type: 'varchar', comment: '설문 ID' },
    answer: { type: 'varchar', comment: '설문 답변 ' },
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
});
