//enums 관련 DB쪽은 컨트롤러 쪽 참고 이건 그냥 Object임

'use strict';

module.exports = Object.freeze({
  // 플랫폼 타입
  LOGIN_PLATFORM_TYPE: {
    //구글 로그인
    GOOGLE: 'google',
    //카카오 로그인
    KAKAO: 'kakao',
    //네이버 로그인
    NAVER: 'naver',
  },

  OS_TYPE: {
    // iOS 아이폰
    APPLE: 'apple',
    //안드로이드폰
    ANDROID: 'android',
    //윈도우 시스템
    WIN: 'win',
  },

  ACCOUNT_STATE: {
    //일반 회원
    NORMAL: 'normal',
    //프리미엄 회원(구독 또는 유료 회원)
    PREMIUM: 'premium',
    //차단 회원
    BLOCK: 'block',
    //휴면 회원
    PAUSE: 'pause',
    //탈퇴 회원
    WITHDRAW: 'withdraw',
  },

  GENDER: {
    //남성 회원
    MALE: 1,
    //여성 회원
    FEMALE: 2,
  },

  ITEM_TYPE: {
    //코스튬 아이템
    COSTUME: 0,
    //메타 스테이스 꾸미기 아이템
    MBLOCK: 1,
    //소모성 아이템
    CONSUME: 2,
    //캐시(유료 재화)
    CASH: 3,
  },

  CATEGORY_TYPE: {
    //스포츠
    SPORTS: 'sports',
    //러닝
    RUNNING: 'running',
    //학습
    STUDY: 'study',
    //트레이닝
    TRAINING: 'training',
    // 캐주얼
    CASUAL: 'casual',
    //측정
    MEASUREMENT: 'measurement',
    //스포마루
    SPOMARU: 'spomaru',
    //누리
    NURI: 'nuri',
    //수학
    MATH: 'math',
    //음악
    MUSIC: 'music',
    //위즈덤박스_학습
    WIZSTUDY: 'wizstudy',
    //인지활동
    RECOGNIZE: 'recognize',
    //신체활동
    PHYSICAL: 'physical',
    //터치팡
    TOUCHPANG: 'touchpang',
    // 클라이밍
    CLIMBING: 'climbing',
  },

  SUBCATEGORY_TYPE: {
    //축구
    FOOTBALL: 'football',
    // 야구
    BASEBALL: 'baseball',
    //농구
    BASKETBALL: 'basketball',
    //양궁
    ARCHERY: 'archery',
    //골프
    GOLF: 'golf',
    //파크 골프
    PARKGOLF: 'parkgolf',
    //티볼
    TEEBALL: 'teeball',
    //발야구
    FOOTBASEBALL: 'footbaseball',
    // 볼링
    BOWLING: 'bowling',
    //기타 스포츠
    ETCSPORTS: 'etcsports',
    //재활
    REMEDY: 'remedy',
    //협동전
    COPLAY: 'coplay',
    //개인
    SOLOPLAY: 'soloplay',
    //대항전
    VSPLAY: 'vsplay',
    //초1~2학년
    ES12: 'es12',
    //초3~4학년
    ES34: 'es34',
    //초5~6학년
    ES56: 'es56',
    //고령자
    SN: 'sn',
    //일반
    NM: 'nm',
    //스트레칭
    STRETCHING: 'stretching',
    //체조
    GYMNASTICS: 'gymnastics',
    //동작 인식
    MOTION: 'motion',
    //XR 기어
    AXIS: 'axis',
    //바닥
    FOOT: 'foot',
    //신체 운동건〮강
    NURIHEALTH: 'nurihealth',
    //의사소통
    NURICOMMUNICATION: 'nuricommunication',
    //사회관계
    NURISOCIAL: 'nurisocial',
    //예술경험
    NURIART: 'nuriart',
    //자연탐구
    NURINATURE: 'nurinature',
    //리듬
    RHYTHM: 'rhythm',
    //XR 트레이닝
    XRTRAINING: 'xrtraining',
    //위핏 챌린지
    WEFIT: 'wefit',
    //피트니스 챌린지
    FITNESS: 'fitness',
    //측정
    MEASUREMENT: 'measurement',
    MAKE: '수의합',
    NUMBER: '수의 순서',
    TINIEST: '크기비교',
    HIGHER: '경우의 수',
    //도솔탐정
    DOSOL: 'dosol',
    //악기
    MUSICEQUIPMENT: 'musicequipment',
    //동식물 관찰
    ANIMALPLANT: 'animalplant',
    //생활 교육
    LIFEEDUCATION: 'lifeeducation',
    //수학과 과학
    MATHSCIENCE: 'mathscience',
    //언어 능력
    LANGUAGESKILL: 'languageskill',
    //사회 탐구
    SOCIALRESEARCH: 'socialresearch',
    //타일런
    TILERUN: 'tilerun',
    //키즈런
    KIDSRUN: 'kidsrun',
    //기억력
    MEMORY: 'memory',
    //계산력
    CALCULATION: 'calculation',
    //시공간훈련
    SPACETIME: 'spacetime',
    //판단력
    JUDGMENT: 'judgment',
    //집중력
    CONCENTRATION: 'concentration',
    //언어력
    LANGUAGEPOWER: 'languagepower',
    //모양 비교
    SHAPECOMPARISON: 'shapecomparison',
    //기초 훈련
    BASICRTRAINING: 'basictraining',
    //융복합 훈련
    COMPLEXTRAINING: 'complextraining',
  },

  SET_TYPE: {
    //추천 세트
    FEATURED: 0,
    //일일 세트
    DAILY: 1,
    // 일반 세트
    NORMAL: 2,
  },

  STAT_TYPE: {
    //상체 근력
    USTR: 'ustr',
    //하체 근력
    LSTR: 'lstr',
    //지구력
    DUR: 'dur',
    //유연성
    FLE: 'fle',
    //평형성
    FLA: 'fla',
    //협응력
    COO: 'coo',
  },

  PAYMENT_TYPE: {
    //무료
    FREE: 0,
    //캐시 (유료 재화)
    CASH: 1,
    // 인앱결제
    INAPP: 2,
  },

  PARTS_TYPE: {
    //얼굴 표정
    FACE: 'face',
    //피부
    SKIN: 'skin',
    //헤어
    HAIR: 'hair',
    //헤어 컬러
    HAIRCOLOR: 'haircolor',
    //상의
    TOP: 'top',
    //하의
    BOTTOM: 'bottom',
    //신발
    SHOES: 'shoes',
    // 장신구
    ACC: 'acc',
  },

  SENSOR_TYPE: {
    //축구 센서
    FOOTBALL: 'football',
    //티볼 센서
    TEEBALL: 'teeball',
    // 파크 골프 센서
    PARKGOLF: 'parkgolf',
    //골프 센서
    GOLF: 'golf',
    //볼링 센서
    BOWLING: 'bowling',
    //터치 센서
    TOUCH: 'touch',
    //바닥 터치 센서
    FOOTTOUCH: 'foottouch',
    // 발판 센서
    FOOT: 'foot',
    //동작인식 센서
    MOTION: 'motion',
    //9축 센서
    AXIS: 'axis', 
    //센서 없음
    SENSORLESS: 'sensorless',
  },

  SCREEN_TYPE: {
    //단면 스크린
    SINGLE: 'single',
    //양면 스크린
    DOUBLE: 'double',
    //삼면 스크린
    TRIPLE: 'triple',
    //바닥 스크린
    FLOOR: 'floor',
    //단면 + 바닥 스크린
    SINGLEFLOOR: 'singlefloor',
    //양면 + 바닥 스크린
    DOUBLEFLOOR: 'doublefloor',
    //삼면 + 바닥 스크린
    TRIPLEFLOOR: 'triplefloor',
  },

  PLAY_STATE_TYPE: {
    //플레이 포기
    DROP: 0,
    //플레이 완료
    DONE: 1,
  },

  COMPLETION_TYPE: {
    //그만하기
    QUIT: 0,
    //완료
    COMPLETE: 1,
    //시간 종료
    TIME_OVER: 2,
  },

  ITEM_REASON_TYPE: {
    //보상 획득
    REWARD: 'reward',
    //결제 획득
    PAID: 'paid',
    //관리자 지급
    ADMIN: 'admin',
  },

  AGE_TYPE: {
    // 전체 이용가
    AGEALL: 'all',
    // 12세 미만
    AGE12: 'a12',
    // 15세 미만
    AGE15: 'a15',
    // 청소년 이용불가
    AGE18: 'a18',
    // 초등학교 1학년
    ES1: 'es1',
    // 초등학교 2학년
    ES2: 'es2',
    // 초등학교 3학년
    ES3: 'es3',
    // 초등학교 4학년
    ES4: 'es4',
    // 초등학교 5학년
    ES5: 'es5',
    // 초등학교 6학년
    ES6: 'es6',
    // 중학교 1학년
    MS1: 'ms1',
    // 중학교 2학년
    MS2: 'ms2',
    // 중학교 3학년
    MS3: 'ms3',
    // 고등학교 1학년
    HS1: 'hs1',
    // 고등학교 2학년
    HS2: 'hs2',
    // 고등학교 3학년
    HS3: 'hs3',
  },

  MYFRIEND_STATE_TYPE: {
    //친구 요청중
    REQUEST: 'request',
    //친구 거절
    REJECT: 'reject',
    //친구중
    MATE: 'mate',
  },

  DIFFICULTY_TYPE: {
    //쉬움
    EASY: 0,
    //보통
    NORMAL: 1,
    //어려움
    HARD: 2,
  },

  BODYPART_TYPE: {
    thighs: '허벅지',
    balance: '균형',
    arm: '팔',
    chest: '가슴',
    hips: '엉덩이',
    lungs: '폐',
    abdomen: '복부',
  },

  BODY_TYPE: {
    //전시
    whole: '전시',
    //상체
    upper: '상체',
    //하체
    lower: '하체',
    //유산소
    cardio: '우산소',
  },

  SERVER_TYPE: {
    //정상
    NORMAL: 'NORMAL',
    //점검
    MAINTENANCE: 'MAINTENANCE',
  },

  CONTENT_STATE: {
    LIVE: 'LIVE',
    OFFLINE: 'OFFLINE',
  },

  STATE_TYPE: {
    LIVE: 0,
    HOLD: 1,
    QA: 2,
  },

  LAUNCHER_TYPE: {
    SPOMARU: 'spomaru',
    XRSPORER: 'xrsporter',
    WIZDOMBOX: 'wizdombox',
    SINIOR: 'sinior',
  },
});
