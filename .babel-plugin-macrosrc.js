const isProduction = process.env.NODE_ENV === "production"

module.exports = {
  styledComponents: {
    pure: isProduction,
    minify: isProduction,
    fileName: !isProduction,
    displayName: !isProduction,
  },
}
