'use strict'; //eslint-disable-line strict

const webpack = require('webpack');
const production = process.env.NODE_ENV === 'production';
const path = require('path');

const paths = {
  'build': path.resolve(__dirname, './build'),
  'src': path.resolve(__dirname, './src')
};

let plugins = [
  new webpack.ProvidePlugin({
    'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
  }),
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': `'${production || 'development'}'`,
      'API_HOST': `'${process.env.API_ADDR && process.env.API_PORT ? `${process.env.API_ADDR}:${process.env.API_PORT}` : 'localhost:3000' }'`,
      'LINK_HOST': `'${process.env.LINK_HOST || ''}'`
    }
  })
];

if(production){

  plugins = plugins.concat(
    new webpack.optimize.UglifyJsPlugin({
      'output': {
        'comments': false
      },
      'compress': {
        'warnings': false
      }
    }),
    new webpack.optimize.DedupePlugin()
  );

}

const webpackConfig = {
  'entry': {
    'app': [`${paths.src}/index.js`, `${paths.src}/index.html`]
  },
  'output': {
    'path': paths.build,
    'filename': 'scripts/app.bundle.js'
  },
  'module': {
    'loaders': [
      {
        'test': /.js$/,
        'loader': 'babel-loader',
        'exclude': /node_modules/,
        'query': {
          'cacheDirectory': true,
          'presets': ['es2015'],
          'plugins': [
            'transform-decorators-legacy'
          ]
        }
      },
      {
        'test': /\.html$/,
        'loader': 'file?name=[name].[ext]'
      },
      {
        'test': /\.json/,
        'loader': 'json'
      },
      {
        'test': /\.(png|jpg|gif)$/,
        'loader': 'file?name=img/[hash:6].[ext]'
      },
      {
        'test': /\.scss$/,
        'loader': 'style!css!sass'
      }
    ]
  },
  'plugins': plugins
};

module.exports = webpackConfig;
