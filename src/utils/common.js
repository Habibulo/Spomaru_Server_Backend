//일반적인 유틸리티 함수들 모음집

'use strict';

const util = {};
const bkfd2Password = require('pbkdf2-password');

const hasher = bkfd2Password();

//값이 비어 있는지 확인 / checks if the value is empty
util.isEmpty = (val) => {
  if (val === '' || val === null || val === undefined || (val !== null && typeof val === 'object' && !Object.keys(val).length)) {
    return true;
  } else {
    return false;
  }
};

/**
 * a가 비어 있으면 b 값을 반환하고 그렇지 않으면 a를 반환합니다.
 * checks if first value is empty if it's empty it returns second value otherwise returns first value
 **/
util.basicEmpty = (a, b) => {
  return exports.isEmpty(a) ? b : a;
};

//주어진 값이 이메일인지 확인합니다/ checks if given value is email
util.isEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email);
};

//비밀번호를 해시/hashes password
util.passwordHasher = (password) => {
  return new Promise((resolve, reject) => {
    hasher({ password }, async (err, pass, salt, hash) => {
      if (err) {
        reject(err);
      } else {
        resolve({ hash, salt });
      }
    });
  });
};

//값이 MAC 주소인지 확인합니다./checks if value is a mac address
util.isMacAddress = (mac) => {
  const macAddressRegex = /^([0-9A-Fa-f]{2}[:]){5}([0-9A-Fa-f]{2})$/;
  return macAddressRegex.test(mac);
};

//password hasher with salt ///salt을 사용한 비밀번호 해시
util.passwordHasher = (password, salt) => {
  return new Promise((resolve, reject) => {
    hasher({ password, salt }, async (err, pass, salt, hash) => {
      if (err) {
        reject(err);
      } else {
        resolve({ hash, salt });
      }
    });
  });
};

//check if player_id is valid
util.isPlayerId = (player_id) => {
  const playerRegex = /^pl_.*/;

  return playerRegex.test(player_id);
};

module.exports = util;
