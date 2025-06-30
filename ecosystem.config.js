const path = require('path');

const configPath = path.resolve(__dirname, './config/');
const config = require(configPath);

module.exports = {
  apps: [
    {
      name: config.app.name,
      script: './src/app.js',
      listen_timeout: 10000,
      max_memory_restart: '500M',
      exec_mode: 'cluster',
      watch: false,
      ignore_watch: ['node_modules'],
      env: {
        NODE_ENV: 'production',
        TOKEN_KEY: 'AC4F44A3E56612B82E895669B341A',
        BASE_URL: 'launcher.xrsporter.com',
      },
      env_local: {
        NODE_ENV: 'local',
        TOKEN_KEY: 'AC4F44A3E56612B82E895669B341A',
        BASE_URL: 'localhost',
      },
      env_development: {
        NODE_ENV: 'development',
        TOKEN_KEY: 'AC4F44A3E56612B82E895669B341A',
        BASE_URL: '192.168.56.101',
      },
      env_production: {
        NODE_ENV: 'production',
        TOKEN_KEY: 'AC4F44A3E56612B82E895669B341A',
        BASE_URL: 'launcher.xrsporter.com',
      },
    },
  ],
};
