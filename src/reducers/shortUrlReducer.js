export const SHORT_URL_ACTION_TYPES = {
	SET_SHORT_URL: 'SET_SHORT_URL',
	SET_ERROR: 'SET_ERROR',
	SET_LOADING: 'SET_LOADING',
}

export const initialShortUrlState = {
	shortUrl: '',
	error: '',
	loading: false,
}

export const shortUrlReducer = (state, action) => {
	const { type, payload } = action

	const actions = {
		[SHORT_URL_ACTION_TYPES.SET_SHORT_URL]: () => ({
			...state,
			shortUrl: payload,
		}),
		[SHORT_URL_ACTION_TYPES.SET_ERROR]: () => ({
			...state,
			error: payload,
		}),
		[SHORT_URL_ACTION_TYPES.SET_LOADING]: () => ({
			...state,
			loading: payload,
		}),
	}

	return actions[type] ? actions[type]() : state
}
