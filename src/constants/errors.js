//에러 관련된 동작사항은 컨트롤러 쪽 참고 이건 그냥 Object임

'use strict';

module.exports = Object.freeze({
  ERROR_CODE: {
    ALREADY_EXISTS: 1001,
    PARAMS_EMPTY: 1002,
    NO_DATA: 1003,
    INVALID_EMAIL: 1004,
    AUTH_FAILED: 1005,
    ADMIN_NOT_FOUND: 1006,
    ADMIN_AUTH_FAILED: 1007,
    REFRESH_EXPIRED: 1008,
    SCHEDULE_EXISTS: 1009,
    SERVER_IN_MAINTENANCE: 1010,
    INVALID_MAC: 1011,
    NO_SCHEDULE: 1012,
    INVALID_PLAYER: 1013,
  },
});
