export const addHttpScheme = (url) => {
  if (!/^https?:\/\//i.test(url)) {
    return `http://${url}`
  }
  return url
}
