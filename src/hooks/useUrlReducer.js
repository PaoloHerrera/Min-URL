import { useReducer } from 'react'
import {
	urlReducer,
	initialUrlState,
	URL_ACTION_TYPES,
} from '../reducers/urlReducer'
import validator from 'validator'

export function useUrlReducer() {
	const [state, dispatch] = useReducer(urlReducer, initialUrlState)

	const setUrl = (url) => {
		dispatch({ type: URL_ACTION_TYPES.SET_URL, payload: url })
	}
	const setInvalid = (url) => {
		dispatch({ type: URL_ACTION_TYPES.SET_INVALID, payload: url })
		return !validator.isURL(url)
	}

	return { url: state.url, isInvalid: state.isInvalid, setUrl, setInvalid }
}
