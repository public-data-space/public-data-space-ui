const buildMode = process.env.NODE_ENV === 'production' && process.env.BUILD_MODE 
  ? process.env.BUILD_MODE 
  : 'dev';

const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

module.exports = {
  publicPath: buildMode === 'build' ?
    '/browse/' :
    '/',
  runtimeCompiler: true,
  transpileDependencies: [
    'vuetify/lib',
  ],
  chainWebpack: (config) => {
    config.plugins.delete('prefetch')
  },
  pluginOptions: {
    webpackBundleAnalyzer: {
      analyzerMode: 'disable',
      openAnalyzer: false
    }
  },
  configureWebpack: {
    plugins: [
      new VuetifyLoaderPlugin()
    ],
  },
};
