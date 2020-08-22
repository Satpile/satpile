module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        "plugins": ["babel-plugin-react-native-nodeify-hack"],
        env: {
            production: {
                plugins: ['react-native-paper/babel'],
            },
        },
    };
};
