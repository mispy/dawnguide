// https://github.com/nrwl/nx/issues/812#issuecomment-429488470
module.exports = {
    roots: ["test"],
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ["<rootDir>/test/setupTests.ts"],
    moduleNameMapper: {
        "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/test/__mocks__/fileMock.ts",
        "\\.(css|less)$": "<rootDir>/test/__mocks__/styleMock.ts"
    },
    // moduleNameMapper: {
    //     '^settings$': '<rootDir>/settings',
    //     '^serverSettings$': '<rootDir>/serverSettings'
    // }
};
