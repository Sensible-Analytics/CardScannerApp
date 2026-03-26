module.exports = {
  preset: "react-native",
  setupFiles: ["<rootDir>/jest.setup.cjs"],
  setupFilesAfterEnv: [],
  transformIgnorePatterns: [
    "node_modules/(?!(react-native|@react-native|react-native-vector-icons|rn-mlkit-ocr)/)",
  ],
  collectCoverage: false,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],
};
