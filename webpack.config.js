const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const fs = require('fs');
const path = require('path');
const allHtmlPages = fs.readdirSync('./')
const allPugPages = fs.readdirSync('./src/')

const DEV = 'development'
const PROD = 'production'

const HTML_DEV = 'html'
const PUG_DEV = 'pug'

let mode = DEV
let fileWork = HTML_DEV
let multiplePluginFiles = null

if (process.env.NODE_ENV === PROD) mode = PROD
if (process.env.DEV_FILE === PUG_DEV) fileWork = PUG_DEV

const getPagesNameByExt = (pages, ext) => pages.filter(page => page.endsWith(`.${ext}`) ? page.split(`.${ext}`)[0] : null)

const htmlPages = getPagesNameByExt(allHtmlPages, 'html');
const pugPages = getPagesNameByExt(allPugPages, 'pug');

const multipleHtmlPlugins = htmlPages.map(name => {
    return new HtmlWebpackPlugin({
        template: path.resolve(__dirname, `./${name}`),
        filename: `${name}`,
        chunks: ['main'],
    })
});

const multiplePugPlugins = pugPages.map(name => {
    return new HtmlWebpackPlugin({
        template: path.resolve(__dirname, `./src/${name}`),
        filename: `${name.replace(/\.pug/,'.html')}`,
        chunks: ['main'],
    })
});

if (fileWork === HTML_DEV) {
    multiplePluginFiles = multipleHtmlPlugins
} else if (fileWork === PUG_DEV){
    multiplePluginFiles = multiplePugPlugins
}


module.exports = {
    mode: mode,
    entry: path.resolve(__dirname, './src/js/main.js'),
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist'),
        assetModuleFilename: './assets/[name][ext]',
        clean: mode === PROD ? true : false,
        publicPath: '/'
    },
    optimization: {
        minimize: false,
        splitChunks: {
            chunks: 'all'
        }
    },
    devtool: 'inline-source-map',
    devServer: {
        static: {
          directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 9000,
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css'
        }),
        ...multiplePluginFiles,
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
    ],
    module: {
        rules: [
            {
                test: /\.html$/i,
                loader: "html-loader",
                options: {
                    minimize: false,
                },
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    {
                        loader: "postcss-loader",
                        options: {
                          postcssOptions: {
                            plugins: [
                              [
                                "postcss-preset-env",
                                {
                                  // Options
                                },
                              ],
                            ],
                          },
                        },
                    },
                    "sass-loader",
                ],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.pug$/,
                use: [{
                  loader: 'html-loader'
                }, {
                  loader: 'pug-html-loader',
                  options: {
                    exports: false
                  }
                }],
            },
            {
                test: /\.m?js$/,
                exclude: /node-modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }
};