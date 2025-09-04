'use strict';

const { EntitySchema } = require('typeorm');
//여기도 다 타입오알엠임
//typeorm entity schema

const enums = require('../../constants/enums');

module.exports = new EntitySchema({
  name: 'ContentInfo',
  tableName: 'content_info',
  comment: '콘텐츠 정보',
  columns: {
    content_id: {
      primary: true,
      type: 'varchar',
      length: 45,
      nullable: false,
      unique: true,
      comment: '콘텐츠 ID',
    },
    file_name: {
      type: 'varchar',
      length: 255,
      nullable: false,
      comment: '실행 파일',
    },
    download_name: {
      type: 'varchar',
      length: 255,
      comment: '다운로드 파일',
    },
    download_channel: {
      type: 'varchar',
      length: 255,
      comment: '다운로드 경로',
    },
    img_name: {
      type: 'varchar',
      length: 255,
      nullable: false,
      comment: '콘텐츠 이미지',
    },
    parameter: {
      type: 'varchar',
      length: 255,
      comment: '콘텐츠 실행 파라미터',
    },
    is_common_ui: {
      type: 'tinyint',
      default: false,
      comment: '공통 UI 사용 유무',
    },
    is_old_auth: {
      type: 'tinyint',
      default: false,
      comment: '예전에 사용한 콘텐츠 인증 유무 ',
    },
    is_popular_contents: {
      type: 'varchar',
      length: 255,
      comment: '인기 컨텐츠 분류(spomaru 기준)',
    },
    title: { type: 'varchar', length: 255, nullable: false, comment: '콘텐츠 타이틀 이름' },
    title_eng: { type: 'varchar', length: 255, nullable: false, comment: '콘텐츠 타이틀 이름 ENG' },
    description: { type: 'varchar', length: 255, nullable: false },
    description_eng: { type: 'varchar', length: 255, nullable: false },
    exercise_description: { type: 'varchar', length: 255, nullable: false },
    short_description: { type: 'varchar', length: 255, nullable: false },
    short_description_eng: { type: 'varchar', length: 255, nullable: false },
    difficulty: { type: 'enum', enum: enums.DIFFICULTY_TYPE, nullable: false },
    age: {type: 'enum', enum: enums.AGE_TYPE, nullable: false },
    playtime: { type: 'int', nullable: false },
    calorie: { type: 'int', nullable: false },
    state: { type: 'enum', enum: enums.STATE_TYPE, nullable: false },
    version: { type: 'varchar', nullable: false },
    player_count: { type: 'int', nullable: false },
    category: { type: 'enum', enum: enums.CATEGORY_TYPE, nullable: false },
    sub_category: { type: 'enum', enum: enums.SUBCATEGORY_TYPE, nullable: false },
    sensor_type: { type: 'enum', enum: enums.SENSOR_TYPE, nullable: false },
    screen_type: { type: 'enum', enum: enums.SCREEN_TYPE, nullable: false },
    body_type: { type: 'enum', enum: enums.BODY_TYPE, nullable: false },
    bodypart_type_1: { type: 'enum', enum: enums.BODYPART_TYPE, nullable: true },
    bodypart_type_2: { type: 'enum', enum: enums.BODYPART_TYPE, nullable: true },
    stat_1: { type: 'enum', enum: enums.STAT_TYPE },
    stat_2: { type: 'enum', enum: enums.STAT_TYPE },
    stat_3: { type: 'enum', enum: enums.STAT_TYPE },
    stat_4: { type: 'enum', enum: enums.STAT_TYPE },
    stat_5: { type: 'enum', enum: enums.STAT_TYPE },
    stat_6: { type: 'enum', enum: enums.STAT_TYPE },
    pay_type: { type: 'enum', enum: enums.PAYMENT_TYPE },
    pay_value: { type: 'int' },
    updated_at: { type: 'datetime', nullable: true, onUpdate: 'CURRENT_TIMESTAMP', comment: '갱신 시간' },
    created_at: { type: 'datetime', nullable: false, default: () => 'CURRENT_TIMESTAMP', comment: '생성 시간' },
  },
});
