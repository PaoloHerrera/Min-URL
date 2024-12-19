const DEV_CONSTANTS = {
  SHORT_URL_API: 'https://localhost:1234.com/api/urls',
  RECAPTCHA_SITE_KEY: '6LcW5J4qAAAAAAzPPQs8lMfNf_lFopw-qUDxvKni'
}

const PROD_CONSTANTS = {
  SHORT_URL_API: 'https://go.min-url.com/api/urls',
  RECAPTCHA_SITE_KEY: '6LcW5J4qAAAAAAzPPQs8lMfNf_lFopw-qUDxvKni'
}

export const {
  SHORT_URL_API,
  RECAPTCHA_SITE_KEY
} = process.env.NODE_ENV === 'development' ? DEV_CONSTANTS : PROD_CONSTANTS
