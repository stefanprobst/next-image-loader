const loaderUtils = require('next/dist/compiled/loader-utils3')
const getImageMetadata = require('./utils.cjs')
/**
 * This is taken from https://github.com/vercel/next.js/blob/canary/packages/next/build/webpack/loaders/next-image-loader.js
 */

/** @type {import('webpack').RawLoaderDefinitionFunction} */
function nextImageLoader(content) {
  const callback = this.async()

  const context = this.rootContext
  const opts = { context, content }
  const interpolatedName = loaderUtils.interpolateName(
    this,
    '/static/media/[name].[hash:8].[ext]',
    opts,
  )

  let extension = loaderUtils.interpolateName(this, '[ext]', opts)

  this.emitFile(interpolatedName, content, null)

  getImageMetadata(content, extension).then(({ blurDataURL, width, height }) => {
    const stringifiedData = JSON.stringify({
      src: interpolatedName,
      height,
      width,
      blurDataURL,
    })

    callback(null, `export default ${stringifiedData};`)
  })
}

module.exports = nextImageLoader
module.exports.raw = true
