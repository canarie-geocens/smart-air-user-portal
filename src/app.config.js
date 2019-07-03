// App-specific config

// Using CommonJS instead of ES2015+ export, because we also need to
// provide this object to Webpack in vue.config.js.
module.exports = {
  title: process.env.VUE_APP_TITLE,
  description: process.env.VUE_APP_DESCRIPTION,
}
