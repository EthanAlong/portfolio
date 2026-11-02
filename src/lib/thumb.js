// Ring tiles use the small copies made by scripts/make-ring-thumbs.cjs.
export const ringThumb = (src) =>
  src && src.startsWith('/') ? '/thumbs' + src.replace(/\.(png|jpe?g|webp)$/i, '.webp') : src
