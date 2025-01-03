module.exports = {
    preset: 'ts-jest', // Set the preset for TypeScript
    testEnvironment: 'node', // Set the environment to Node.js (not the default jsdom for browser tests)
    moduleFileExtensions: ['ts', 'js', 'json', 'node'], // Ensure it recognizes TypeScript files
    rootDir: './', // Explicitly define the root directory if needed
    transform: {
      '^.+\\.ts$': 'ts-jest', // Tell Jest to use ts-jest to transform TypeScript files
    },
    testMatch: ['**/?(*.)+(spec|test).ts'], // Glob pattern for your test files
    collectCoverage: true, // Enable coverage collection if needed
    coverageDirectory: './coverage', // Specify the directory for coverage reports
  };
  