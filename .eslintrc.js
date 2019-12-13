module.exports = {
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "project": "./tsconfig.json"
    },
    "plugins": ["@typescript-eslint"],
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "rules": {
        // No-semicolons typescript
        "@typescript-eslint/member-delimiter-style": [1, {
            "multiline": {
                "delimiter": "none",
                "requireLast": false
            },
            "singleline": {
                "delimiter": "comma",
                "requireLast": false
            }
        }],
        "@typescript-eslint/interface-name-prefix": 0,
        "@typescript-eslint/no-explicit-any": 0,
        "@typescript-eslint/explicit-function-return-type": 0,
        "@typescript-eslint/no-unused-vars": 0,
        "@typescript-eslint/no-inferrable-types": 0,
        "@typescript-eslint/no-use-before-define": 0,

        // Used for libs without type decs
        "@typescript-eslint/no-var-requires": 0
    }
}