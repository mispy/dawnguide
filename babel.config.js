module.exports = {
    "presets": [
        // Must come before typescript https://github.com/babel/babel/issues/8752
        "@babel/preset-env",
        "@babel/preset-react",
        [
            "@babel/preset-typescript",
            {
                "allowNamespaces": true
            }
        ],
    ],
    "plugins": [
        "@babel/plugin-transform-runtime",
        [
            "@babel/plugin-proposal-decorators",
            {
                "legacy": true
            }
        ],
        [
            "@babel/plugin-proposal-class-properties",
            {
                "loose": true
            }
        ]
    ]
}