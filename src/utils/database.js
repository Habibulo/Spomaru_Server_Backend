//데이터베이스 초기화, 연결하는 역할 모음집 코드들.
//데이터베이스를 초기화하고, 엔티티(Entity)를 로드한 뒤, typeorm을 사용해 데이터 소스를 연결하는 역할을 합니다

'use strict';

//path - 모듈을 사용하여 파일 경로를 다루기 위해 path 모듈을 불러옵니다.
const path = require('path');
//typeorm - 데이터베이스 연결을 위해 typeorm 모듈을 불러옵니다.
const { DataSource } = require('typeorm');
//SnakeNamingStrategy - typeorm에서 제공하는 네이밍 전략 중 하나인 SnakeNamingStrategy를 불러옵니다.
const { SnakeNamingStrategy } = require('typeorm-naming-strategies');
//config - 설정 파일을 불러오기 위해 config 모듈을 불러옵니다.
const config = require('../../config/index');
//fs - 파일 시스템을 다루기 위해 fs 모듈을 불러옵니다.
const fs = require('fs');
//logger - 로그를 출력하기 위해 logger 모듈을 불러옵니다.
const logger = require('./logger');
//CONNECTIONS - 데이터 소스를 저장하기 위한 객체입니다.
const CONNECTIONS = {};

/**
 * Database initialization
 * Reads entity files from specified directories [data,log,user] and initializes DataSource.
 */
exports.initialize = async () => {
  const entityPath = path.normalize(__dirname + '/../entity');

  for (const [name, cfg] of Object.entries(config.database)) {
    if (typeof cfg !== 'object') continue;

    cfg.name = name;
    cfg.namingStrategy = new SnakeNamingStrategy();
    cfg.entities = [];

    const files = fs.readdirSync(path.join(entityPath, name)).filter((file) => file.endsWith('.js'));

    for (const file of files) {
      const models = require(path.join(entityPath, name, file));
      cfg.entities.push(models);
    }
    try {
      CONNECTIONS[name] = await new DataSource(cfg).initialize();
      logger.warn(`Data Source initialized:${name}`);
    } catch (error) {
      console.error(`Failed to initialize database connection for ${name}: ${error.code} ${error.message}`);
    }
  }
};

exports.dataSource = (type) => {
  return CONNECTIONS[type];
};
//type는 data, user, log()
//dataSource를 통해 데이터베이스와 연결하는 코드임.
