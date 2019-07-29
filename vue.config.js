const appConfig = require('./src/app.config')
const webpack = require('webpack')

module.exports = {
  configureWebpack: {
    // We provide the app's title in Webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: appConfig.title,
    // Set up all the aliases we use in our app.
    resolve: {
      alias: require('./aliases.config').webpack,
    },
    plugins: [
      new webpack.ProvidePlugin({
        mapboxgl: 'mapbox-gl',
        $: 'jquery',
        jquery: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
      }),
    ],
  },
  css: {
    // Enable CSS source maps.
    sourceMap: true,
  },
  // Configure Webpack's dev server.
  // https://cli.vuejs.org/guide/cli-service.html
  devServer: {
    ...(process.env.API_BASE_URL
      ? // Proxy API endpoints to the production base URL.
        { proxy: { '/api': { target: process.env.API_BASE_URL } } }
      : // Proxy API endpoints a local mock API.
        { before: require('./tests/mock-api') }),
  },
  pluginOptions: {
    s3Deploy: {
      assetPath: 'dist',
      bucket: process.env.VUE_APP_S3D_BUCKET,
      region: process.env.VUE_APP_S3D_REGION,
      pwa: false,
      enableCloudfront: true,
      cloudfrontId: process.env.VUE_APP_S3D_CLOUDFRONT_ID,
      cloudfrontMatchers: '/*',
      uploadConcurrency: 5,
      createBucket: false,
      staticHosting: true,
      staticIndexPage: 'index.html',
      staticErrorPage: 'index.html',
      assetMatch: '**',
      deployPath: '/',
      acl: 'public-read',
      pluginVersion: '3.0.0',
    },
  },
}
