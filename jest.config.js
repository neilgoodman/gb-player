module.exports = {
  preset: 'jest-expo',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  modulePaths: ['<rootDir>'],
  transform: {
    '^.+\\.(js)$': '<rootDir>/node_modules/babel-jest',
    '\\.(ts|tsx)$': '<rootDir>/node_modules/ts-jest/preprocessor.js',
  },
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$',
  testPathIgnorePatterns: [
    '\\.snap$',
    '<rootDir>/node_modules/',
    '<rootDir>/lib/',
  ],
  cacheDirectory: '.jest/cache',
  collectCoverage: true,
  collectCoverageFrom: [
    'App.js',
    'src/**/*.{ts,tsx,js}',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      branches: 95,
      functions: 95,
      lines: 95,
    },
  },
  setupFiles: ['./setupJest.js'],
  // See https://github.com/facebook/jest/issues/2663#issuecomment-317109798
  // Only happens to me on Windows 10
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/assetsTransformer.js',
    '\\.(css|less)$': '<rootDir>/assetsTransformer.js',
  },
};
