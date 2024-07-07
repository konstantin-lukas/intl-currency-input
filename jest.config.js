const config = {
    verbose: true,
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    coverageReporters: ["lcov", "text"],
    bail: 1
};

export default config;
