'use strict';

const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'SurveyInfo',
  tableName: 'survey_info',
  columns: {
    survey_id: {
      primary: true,
      unsigned: true,
      generated: true,
      comment: '설문 id',
    },
    question_id: {
      type: 'bigint',
      comment: '설문 질문 텍스트 1',
    },
    survey_a1: {
      type: 'varchar',
      comment: '설문 보기 1 텍스트',
    },
    survey_a2: {
      type: 'varchar',
      comment: '설문 보기 2 텍스트',
    },
    survey_a3: {
      type: 'varchar',
      comment: '설문 보기 3 텍스트',
    },
    survey_a4: {
      type: 'varchar',
      comment: '설문 보기 4 텍스트',
    },
    survey_a5: {
      type: 'varchar',
      comment: '설문 보기 5 텍스트',
    },
  },
});
