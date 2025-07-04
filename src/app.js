//전체적인 모음집

const Koa = require('koa');
const { koaBody } = require('koa-body');
const cors = require('@koa/cors');
const mount = require('koa-mount');
const compress = require('koa-compress');
const serve = require('koa-static');
const session = require('koa-session');
const router = require('./routes');
const logger = require('./utils/logger');
const config = require('../config');
const uuidV4 = require('uuid').v4;

const SESSION_MAX_AGE = 60 * 60 * 1000;
// 데이터베이스 초기화 / database initialization
(async () => {
  const database = require('./utils/database');
  await database.initialize();
  const redis = require('./utils/redis');
  await redis.initialize();
  const redisService = require('./service/redis');
  await redisService.setServerInit();
  const serviceAdmin = require('./service/admin');
  await serviceAdmin.insertDefAdmin();

  require('./schedule/schedule');
})().catch((err) => {
  logger.error(err + err.code);
  process.exit(1);
});

const app = new Koa();

const checkServerStatus = require('./middlewares/server-state');
app.use(checkServerStatus);

const serverOrigin = config.app.host;
const allowedOrigins = ['http://localhost:3000', serverOrigin];
// Configure CORS options
// CORS = 
const corsOptions = {
  origin: (ctx) => {
    const origin = ctx.request.header.origin;
    if (allowedOrigins.includes(origin) || !origin) {
      return origin;
    } else {
      return null;
    }
  },
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
};

app.use(cors(corsOptions));
app.use(compress());
app.use(koaBody({ jsonLimit: '100mb', parse: true }));
app.use(router.routes());
app.keys = [process.env.TOKEN_KEY];
session(
  {
    genid: () => uuidV4(),
    secret: process.env.TOKEN_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: SESSION_MAX_AGE,
    },
  },
  app,
);

app.listen(config.app.port, () => {
  logger.info(`Server listening on port, http://localhost:${config.app.port},  config.app.port`);
});

/**
 * @api {all} / HTTP Errors
 * @apiName HttpErrors
 * @apiGroup Errors
 *
 * @apiError (Error 1001) {Number=1001} code 데이터가 이미 존재합니다
 * @apiError (Error 1002) {Number=1002} code 패러미터가 비어 있습니다
 * @apiError (Error 1003) {Number=1003} code 데이터가 존재하지 않습니다
 * @apiError (Error 1004) {Number=1004} code 유효한 이메일 형식이 아닙니다
 * @apiError (Error 1005) {Number=1005} code 인증에 실패했습니다
 * @apiError (Error 1006) {Number=1006} code Admin 없습니다
 * @apiError (Error 1007) {Number=1007} code 관리자 인증 실패
 * @apiError (Error 1008) {Number=1008} code 토큰 만료
 * @apiError (Error 1009) {Number=1009} code 스케줄 이미 존재합니다
 * @apiError (Error 1010) {Number=1010} code 서버 점검중입니다
 * @apiError (Error 1011) {Number=1011} code 잘못된 맥 주소
 * @apiError (Error 1012) {Number=1012} code 스케줄이 존재하지 않습니다
 * */

/**
 * @api {all} / SFT 파라미터
 * @apiName SFT 파라미터
 * @apiGroup SFT
 *
 * @apiSuccess {String} player_id 런처는 앱을 시작할 때 파라미터를 추가합니다.
 * 이 파라미터는 나중에 "플레이어 능력치 추가" API에 능력 데이터를 저장하는 데 사용될 수 있습니다.
 */
