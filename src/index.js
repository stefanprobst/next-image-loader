const loaderUtils = require('next/dist/compiled/loader-utils3')
const { resizeImage, getImageSize } = require('next/dist/server/image-optimizer')

/**
 * This is taken from https://github.com/vercel/next.js/blob/canary/packages/next/build/webpack/loaders/next-image-loader.js
 */

const BLUR_IMG_SIZE = 8
const BLUR_QUALITY = 70
const VALID_BLUR_EXT = ['jpeg', 'png', 'webp', 'avif']

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
  if (extension === 'jpg') {
    extension = 'jpeg'
  }

  this.emitFile(interpolatedName, content, null)

  getImageSize(content, extension)
    .then(({ width, height }) => {
      if (VALID_BLUR_EXT.includes(extension)) {
        const dimension = width >= height ? 'width' : 'height'

        return resizeImage(content, dimension, BLUR_IMG_SIZE, extension, BLUR_QUALITY).then(
          (resizedImage) => {
            const blurDataURL = `data:image/${extension};base64,${resizedImage.toString('base64')}`
            return { width, height, blurDataURL }
          },
        )
      }

      return { width, height }
    })
    .then(({ blurDataURL, width, height }) => {
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
