const webpack = require('webpack'),
      uglifyJS = require('uglifyjs-webpack-plugin');

const config = {
    output: {
        filename: 'bandle.js'
    },
    plugins: [
        new uglifyJS ({
            sourceMap: true
        }),
        new webpack.ProvidePlugin ({
            $: 'jquery',
            jQuery: 'jquery'
        })
    ]
};

module.exports = config;