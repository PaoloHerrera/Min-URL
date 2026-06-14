import {
	ActionTypes,
	appReducer,
	initialState,
} from '@/modules/core/reducers/AppReducer'
import type { Language } from '@/modules/core/utils/types.d.ts'
import { useReducer } from 'react'
import { useEffect } from 'react'

export const useAppReducer = () => {
	const [state, dispatch] = useReducer(appReducer, initialState)

	const setLang = (lang: Language) => {
		dispatch({ type: ActionTypes.SetLang, payload: lang })
	}
	//Save language to localStorage
	useEffect(() => {
		localStorage.setItem('lang', state.lang)
		//change language in the browser
		document.documentElement.lang = state.lang
	}, [state.lang])

	return { lang: state.lang, setLang }
}
