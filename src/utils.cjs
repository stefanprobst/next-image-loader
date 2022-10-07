const { resizeImage, getImageSize } = require('next/dist/server/image-optimizer')

/**
 * This is taken from https://github.com/vercel/next.js/blob/canary/packages/next/build/webpack/loaders/next-image-loader.js
 */

const BLUR_IMG_SIZE = 8
const BLUR_QUALITY = 70
const VALID_BLUR_EXT = ['jpeg', 'png', 'webp', 'avif']

function addBlurDataUrl(content, extension, width, height) {
  if (VALID_BLUR_EXT.includes(extension)) {
    return resizeImage(content, BLUR_IMG_SIZE, BLUR_IMG_SIZE, extension, BLUR_QUALITY).then(
      (resizedImage) => {
        const blurDataURL = `data:image/${extension};base64,${resizedImage.toString('base64')}`
        return { width, height, blurDataURL }
      },
    )
  }

  return { width, height }
}

function getImageMetadata(content, extension) {
  if (extension === 'jpg') {
    extension = 'jpeg'
  }

  return getImageSize(content, extension).then(({ width, height }) => {
    return addBlurDataUrl(content, extension, width, height)
  })
}

module.exports = getImageMetadata
