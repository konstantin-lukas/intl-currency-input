import path from 'path';
const __dirname = path.resolve();
const varConfig = {
    entry: './src/intl-currency-input.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'intl-currency-input.js',
        library: {
            type: 'var',
            name: 'Ici'
        }
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: [path.resolve(__dirname, 'tests')],
                use: 'ts-loader',
                include: [path.resolve(__dirname, 'src')]
            }
        ]
    },
    devServer: {
        static: __dirname,
        compress: true,
        port: 9000,
        liveReload: true,
        devMiddleware: {
            publicPath: '/dist/',
            writeToDisk: true
        }
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    mode: 'development'
};
const umdConfig = {
    entry: './src/intl-currency-input.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'intl-currency-input.umd.js',
        library: {
            type: 'umd'
        },
        umdNamedDefine: true
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: [path.resolve(__dirname, 'tests')],
                use: 'ts-loader',
                include: [path.resolve(__dirname, 'src')]
            }
        ]
    },
    devServer: {
        static: __dirname,
        compress: true,
        port: 9000,
        liveReload: true,
        devMiddleware: {
            publicPath: '/dist/',
            writeToDisk: true
        }
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    mode: 'development'
};
const cjsConfig = {
    entry: './src/intl-currency-input.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'intl-currency-input.commonjs.cjs',
        library: {
            type: 'commonjs'
        }
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: [path.resolve(__dirname, 'tests')],
                use: 'ts-loader',
                include: [path.resolve(__dirname, 'src')]
            }
        ]
    },
    devServer: {
        static: __dirname,
        compress: true,
        port: 9000,
        liveReload: true,
        devMiddleware: {
            publicPath: '/dist/',
            writeToDisk: true
        }
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    mode: 'development'
};
export default (options) => {
    console.log(options);
    if (typeof options.configType === 'undefined' || options.production === 'undefined') {
        console.log("MISSING ARGUMENTS FOR WEBPACK CONFIG! DEFAULTING TO VAR DEV CONFIG!");
        return varConfig;
    }
    if (options.configType === 'cjs') {
        cjsConfig.mode = options.production === 'true' ? 'production' : 'development';
        return cjsConfig;
    } else if (options.configType === 'umd') {
        umdConfig.mode = options.production === 'true' ? 'production' : 'development';
        return umdConfig
    } else {
        varConfig.mode = options.production === 'true' ? 'production' : 'development';
        return varConfig
    }

};

