module.exports = {
  moduleFileExtensions: ['js', 'json', 'jsx', 'json'],
  transform: {
    '^.+\\.(js|jsx)?$': 'babel-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less)$': '<rootDir>/__mocks__/fileMock.js',
  },
  testMatch: ['<rootDir>/**/*.test.(js|jsx)', '<rootDir>/(tests/unit/**/*.spec.(js|jsx)|**/__tests__/*.(js|jsx))'],
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
};
