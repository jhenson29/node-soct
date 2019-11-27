module.exports = {
    env: {
        node: true,
        es6: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
    ],
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    parserOptions: {
        ecmaVersion: 2017,
        sourceType: "module",
    },
    rules: {
        indent: ["error", "tab"],
        "linebreak-style": ["error", "windows"],
        quotes: ["error", "double"],
        semi: ["error", "always"],
    },
};
