const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

module.exports = {
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
