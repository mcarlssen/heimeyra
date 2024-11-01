const path = require('path');

module.exports = function override(config, env) {
    config.entry = {
        main: [
            env === 'development' && 
                require.resolve('react-dev-utils/webpackHotDevClient'),
            path.join(__dirname, 'src/index.tsx')
        ].filter(Boolean),
        popup: [
            env === 'development' && 
                require.resolve('react-dev-utils/webpackHotDevClient'),
            path.join(__dirname, 'src/popup.tsx')
        ].filter(Boolean)
    };
    
    config.output = {
        ...config.output,
        filename: 'static/js/[name].js',
        chunkFilename: 'static/js/[name].chunk.js',
        hotUpdateMainFilename: 'static/js/[runtime].[fullhash].hot-update.json',
        hotUpdateChunkFilename: 'static/js/[id].[fullhash].hot-update.js',
    };
    
    if (config.module && config.module.rules) {
        const tsRule = config.module.rules.find(
            rule => rule.test && rule.test.toString().includes('tsx')
        );

        if (tsRule) {
            if (tsRule.use && Array.isArray(tsRule.use)) {
                tsRule.use.forEach(loader => {
                    if (loader.loader && loader.loader.includes('ts-loader')) {
                        loader.options = {
                            ...loader.options,
                            transpileOnly: true,
                            compilerOptions: {
                                ...loader.options?.compilerOptions,
                                noImplicitAny: false,
                                strictNullChecks: false,
                                strictFunctionTypes: false,
                                strictPropertyInitialization: false,
                                strict: false
                            }
                        };
                    }
                });
            }
        }
    }
    
    return config;
};