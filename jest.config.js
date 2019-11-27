/* eslint-disable no-useless-catch */
/* eslint-disable indent */
module.exports = {
    roots: ["<rootDir>/src"],
    transform: {
        "^.+\\.tsx?$": "ts-jest",
    },
    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
