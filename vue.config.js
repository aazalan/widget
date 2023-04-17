require('dotenv').config()

const { NODE_ENV = 'development', WEBPACK_PORT } = process.env
const webpack = require('webpack')
const publicPath = `https://localhost:${WEBPACK_PORT}`

module.exports = {
    publicPath,

    configureWebpack: {
        output: {
            library: 'starter',
            libraryTarget: 'umd'
        },
        plugins: [
            new webpack.EnvironmentPlugin({ NODE_ENV })
        ]
    },
    
    chainWebpack: (config) => {
        config.plugins.delete('html')
        config.plugins.delete('preload')
        config.plugins.delete('prefetch')
        config.optimization.delete('splitChunks')
    },
    css: {
        extract: false,
        loaderOptions: { 
            less: {
               lessOptions: {
                javascriptEnabled: true
               }
            }
        }
    },
    devServer: {
        https: true,
        port: WEBPACK_PORT,
        server: publicPath,
        // disableHostCheck: true,
        headers: {
            'Access-Control-Allow-Origin' : '*',
            'Access-Control-Allow-Headers' : '*',
            'Access-Control-Allow-Methods' : '*'
        }
    },

    transpileDependencies: true
}
