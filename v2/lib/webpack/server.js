const path = require('path');
const staticSiteGenerator = require('static-site-generator-webpack-plugin');
const webpackNiceLog = require('webpack-nicelog');
const createBaseConfig = require('./base');
const {applyChainWebpack} = require('./utils');

module.exports = function createServerConfig(props) {
  const config = createBaseConfig(props, true);

  config.entry('main').add(path.resolve(__dirname, '../core/serverEntry.js'));
  config.target('node');
  config.output.filename('server.bundle.js').libraryTarget('commonjs2');

  // Workaround for Webpack 4 Bug (https://github.com/webpack/webpack/issues/6522)
  config.output.globalObject('this');

  const {siteConfig, blogMetadatas, docsMetadatas, pagesMetadatas} = props;

  // static site generator webpack plugin
  const docsFlatMetadatas = Object.values(docsMetadatas);
  const paths = [...blogMetadatas, ...docsFlatMetadatas, ...pagesMetadatas].map(
    data => data.permalink,
  );
  config.plugin('siteGenerator').use(staticSiteGenerator, [
    {
      entry: 'main',
      locals: {
        baseUrl: siteConfig.baseUrl,
      },
      paths,
    },
  ]);

  // show compilation progress bar
  const isProd = process.env.NODE_ENV === 'production';
  config
    .plugin('niceLog')
    .use(webpackNiceLog, [
      {name: 'Server', color: 'yellow', skipBuildTime: isProd},
    ]);

  // user extended webpack-chain config
  applyChainWebpack(props.siteConfig.chainWebpack, config, true);

  return config;
};
