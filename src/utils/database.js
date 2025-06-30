'use strict';

const path = require('path');
const { DataSource } = require('typeorm');
const { SnakeNamingStrategy } = require('typeorm-naming-strategies');
const config = require('../../config/index');
const fs = require('fs');
const logger = require('./logger');
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
