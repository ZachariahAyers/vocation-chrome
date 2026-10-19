module.exports = {
    pluginOptions: {
        browserExtension: {
            componentOptions: {
                contentScripts: {
                    entries: {
                        main: ["src/overlay/main.js"],
                    },
                },
            },
        },
    },
};
