declare const getImageMetadata: (
  content: Buffer,
  extension: 'avif' | 'webp' | 'png' | 'jpeg' | 'jpg',
) => { width: number; height: number; blurDataURL?: string }

export = getImageMetadata
