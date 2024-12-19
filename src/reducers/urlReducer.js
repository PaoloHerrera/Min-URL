import validator from 'validator'

export const URL_ACTION_TYPES = {
  SET_URL: 'SET_URL',
  SET_INVALID: 'SET_INVALID'
}

export const initialUrlState = {
  url: '',
  isInvalid: false
}

export const urlReducer = (state, action) => {
  const { type, payload } = action

  const actions = {
    [URL_ACTION_TYPES.SET_URL]: () => ({
      ...state,
      url: payload
    }),
    [URL_ACTION_TYPES.SET_INVALID]: () => ({
      ...state,
      isInvalid: !validator.isURL(payload)
    })
  }

  return actions[type] ? actions[type]() : state
}
