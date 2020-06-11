const config = {
  preset: "ts-jest",
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/test-directory/**/*",
    "!src/extension.ts"
  ],
};
module.exports = config;
