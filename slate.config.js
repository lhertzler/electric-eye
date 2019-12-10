/* eslint-disable no-undef */
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const isDevelopment = process.env.NODE_ENV === 'development'


const alias = {
  jquery: path.resolve('./node_modules/jquery/src/jquery'),
  $: path.resolve('./node_modules/jquery/src/jquery'),
  cartJS: path.resolve('./node_modules/shopify-cartjs'),
  vue$: 'vue/dist/vue.common.js'
}

const part = {
  resolve: {
    alias,
    extensions: ['.js', '.min.js', '.vue', '.css', '.json']
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            js: 'babel-loader'
          }
        }
      }
    ]
  },
  plugins: [new VueLoaderPlugin()]
}

const styleLoader = {
  loader: 'style-loader',
  options: {
    hmr: isDevelopment
  }
}

const cssLoader = {
  loader: 'css-loader',
  // Enabling sourcemaps in styles when using HMR causes style-loader to inject
  // styles using a <link> tag instead of <style> tag. This causes
  // a FOUC content, which can cause issues with JS that is reading
  // the DOM for styles (width, height, visibility) on page load.
  options: { sourceMap: !isDevelopment }
}

const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    ident: 'postcss',
    sourceMap: !isDevelopment
  }
}

module.exports = {
  'webpack.extend': config => {


    const postCssRule = {
      test: /\.pcss$/,
      exclude: config.get('webpack.commonExcludes')
    }

    postCssRule.use = [
      ...(isDevelopment ? [styleLoader] : [MiniCssExtractPlugin.loader]),
      cssLoader,
      postcssLoader
    ]
    part.module.rules.push(postCssRule)

    return part
  }
}
