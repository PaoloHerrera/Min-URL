import validator from 'validator'

export default function validateURL (url) {
  if (validator.isURL(url)) {
    return true
  } else return false
}
