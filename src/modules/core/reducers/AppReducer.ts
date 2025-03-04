import type { Language } from '@/modules/core/utils/types.d.ts'

export enum ActionTypes {
	SetLang = 'SET_LANG',
}

interface Action {
	type: ActionTypes
	payload: Language
}

export interface State {
	lang: Language
}

export const initialState: State = {
	lang: (localStorage.getItem('lang') as Language) || 'en',
}

export const appReducer = (state: State, action: Action) => {
	switch (action.type) {
		case 'SET_LANG':
			return {
				...state,
				lang: action.payload,
			}
		default:
			return state
	}
}
