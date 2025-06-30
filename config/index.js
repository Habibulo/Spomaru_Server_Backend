const path = require('path');

const rootPath = path.normalize(__dirname + '/..');
const env = process.env.NODE_ENV || 'production';
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const config = {
  //로컬
  local: {
    envName: env,
    root: rootPath,
    app: {
      name: 'launcher-local',
      port: 3000,
    },
    database: {
      data: {
        host: 'launcher.xrsporter.com',
        username: 'root',
        password: 'Da!tQk1^',
        port: '3306',
        type: 'mysql',
        database: 'crlauncher_data',
      },
      log: {
        host: 'launcher.xrsporter.com',
        username: 'root',
        password: 'Da!tQk1^',
        port: '3306',
        type: 'mysql',
        database: 'crlauncher_log',
      },
      user: {
        host: 'launcher.xrsporter.com',
        username: 'root',
        password: 'Da!tQk1^',
        port: '3306',
        type: 'mysql',
        database: 'crlauncher_user',
      },
    },
    jwt: {
      user: {
        header_key: 'dfsh-x-code',
        token: 'LaNuQO6EYhiYTaqEpH2AeWByNZfr5behz1X!zopRP4NSyrLdFeebdtSPmwfV',
        expire_seconds: 3600 * 12,
      },
    },
  },
  // 개발
  development: {
    envName: env,
    root: rootPath,
    app: {
      name: 'launcher-dev',
      host: '192.168.56.101',
      port: 3000,
    },
    database: {
      data: {
        host: '192.168.56.101',
        username: 'admin',
        password: 'xcv34@12#4',
        port: '3306',
        type: 'mysql',
        database: 'crlauncher_data',
      },
      log: {
        host: '192.168.56.101',
        username: 'admin',
        password: 'xcv34@12#4',
        port: '3306',
        type: 'mysql',
        database: 'crlauncher_log',
      },
      user: {
        host: '192.168.56.101',
        username: 'admin',
        password: 'xcv34@12#4',
        port: '3306',
        type: 'mysql',
        database: 'crlauncher_user',
      },
    },
    redis: {
      cr_launcher: {
        host: '192.168.56.101',
        port: 6379,
        password: 'xcv34@12#4',
        db: 0,
      },
    },
    jwt: {
      user: {
        header_key: 'codereach-x-token',
        token: 'LaNuQO6EYhiYTaqEpH2AeWByNZfr5behz1X!zopRP4NSyrLdFeebdtSPmwfV',
        expire_seconds: 14400, // 4 hours in seconds
      },
      admin: {
        header_key: 'codereach-admin-x-token',
        access_token_option: { expiresIn: '1h' },
        refresh_token_option: { expiresIn: '1d' },
        access_secret_key: 'Nx5ehkSVYskxsnFtmzQXOabFDHoh9iK409ANpn7mp7RGssiO',
        refresh_secret_key: 'fpidZMIvPkoD01ZJEGnC2GQubMaxJOIRmzydZJNP9MGg2E4x',
      },
    },
  },

  production: {
    envName: env,
    root: rootPath,
    app: {
      name: 'launcher-prod',
      host: 'http://launcher.xrsporter.com',
      port: 3000,
    },
    database: {
      data: {
        host: 'launcher.xrsporter.com',
        username: 'root',
        password: 'Da!tQk1^',
        port: '3306',
        type: 'mysql',
        database: 'crlauncher_data',
      },
      log: {
        host: 'launcher.xrsporter.com',
        username: 'root',
        password: 'Da!tQk1^',
        port: '3306',
        type: 'mysql',
        database: 'crlauncher_log',
      },
      user: {
        host: 'launcher.xrsporter.com',
        username: 'root',
        password: 'Da!tQk1^',
        port: '3306',
        type: 'mysql',
        database: 'crlauncher_user',
      },
    },
    redis: {
      cr_launcher: {
        host: 'launcher.xrsporter.com',
        port: 6379,
        password: 'Da!tQk1^',
        db: 0,
      },
    },
    jwt: {
      user: {
        header_key: 'codereach-x-token',
        token: 'LaNuQO6EYhiYTaqEpH2AeWByNZfr5behz1X!zopRP4NSyrLdFeebdtSPmwfV',
        expire_seconds: 14400, // 4 hours in seconds
      },
      admin: {
        header_key: 'codereach-admin-x-token',
        access_token_option: { expiresIn: '1h' },
        refresh_token_option: { expiresIn: '1d' },
        access_secret_key: 'Nx5ehkSVYskxsnFtmzQXOabFDHoh9iK409ANpn7mp7RGssiO',
        refresh_secret_key: 'fpidZMIvPkoD01ZJEGnC2GQubMaxJOIRmzydZJNP9MGg2E4x',
      },
    },
  },
};

module.exports = config[env];
