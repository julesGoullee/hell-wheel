const webpack = require('webpack');
const production = process.env.NODE_ENV === 'production'; //eslint-disable-line no-process-env
const path = require('path');

const paths = {
  'build': path.resolve(__dirname, './build'),
  'src': path.resolve(__dirname, './src')
};

let plugins = [
  new webpack.ProvidePlugin({ 'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch' }),
  new webpack.DefinePlugin({ 'process.env': {
    'NODE_ENV': `'${production || 'development'}'`
  }})
];

if(production){

  plugins = plugins.concat(
    new webpack.optimize.UglifyJsPlugin({
      'output': { 'comments': false },
      'compress': { 'warnings': false }
    }),
    new webpack.optimize.DedupePlugin()
  );

}

const webpackConfig = {
  'entry': { 'app': [`${paths.src}/index.js`, `${paths.src}/index.html`]},
  'output': {
    'path': paths.build,
    'filename': 'scripts/app.bundle.js'
  },
  'module': { 'loaders': [
    {
      'test': /.js$/,
      'loader': 'babel-loader',
      'exclude': /node_modules/,
      'query': {
        'cacheDirectory': true,
        'presets': ['es2015', 'es2016', 'es2017'],
        'plugins': [
          'transform-runtime',
          'transform-decorators-legacy',
          'transform-class-properties'
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
  ]},
  'plugins': plugins
};

module.exports = webpackConfig;
