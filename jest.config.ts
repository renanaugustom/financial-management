import { pathsToModuleNameMapper } from 'ts-jest';

import { compilerOptions } from './tsconfig.json';

export default {
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: '.*\\.spec\\.ts$',
  roots: ['<rootDir>'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  clearMocks: true,
  verbose: true,
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    '!src/main.ts',
    '!**/config.ts',
    '!**/*.module.ts',
    '!src/modules/swagger/index.ts',
    '!**/*.dto.ts',
    '!**/*.entity.ts',
    '!**/migrations/*.ts',
  ],
  coverageDirectory: './coverage',
  testTimeout: 15000,
  coverageThreshold: {
    global: {
      lines: 95,
      branches: 95,
      functions: 95,
    },
  },
};
