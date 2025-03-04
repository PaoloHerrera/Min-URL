type Error = {
	type:
		| 'invalidUrl'
		| 'serverError'
		| 'connectionError'
		| 'recaptchaError'
		| 'unknownError'
		| ''
	message: string
}

type Purpose = 'direct' | 'qr' | 'api' | ''

export type State = {
	longUrl: string
	shortUrl: string
	qrCodeUrl: string
	purpose: Purpose
	createdAt: string
	error: Error
	isLoading: boolean
}

export enum ActionType {
	SetLongUrl = 'SET_LONG_URL',
	SetShortUrl = 'SET_SHORT_URL',
	SetQrCodeUrl = 'SET_QR_CODE_URL',
	SetPurpose = 'SET_PURPOSE',
	SetCreatedAt = 'SET_CREATED_AT',
	SetError = 'SET_ERROR',
	SetIsLoading = 'SET_IS_LOADING',
}

type Action<T extends ActionType, P> = {
	type: T
	payload: P
}

type ActionShortUrl =
	| Action<ActionType.SetLongUrl, string>
	| Action<ActionType.SetShortUrl, string>
	| Action<ActionType.SetQrCodeUrl, string>
	| Action<ActionType.SetPurpose, Purpose>
	| Action<ActionType.SetCreatedAt, string>
	| Action<ActionType.SetError, Error>
	| Action<ActionType.SetIsLoading, boolean>

export const initialState: State = {
	longUrl: '',
	shortUrl: '',
	qrCodeUrl: '',
	purpose: '',
	createdAt: '',
	error: {
		type: '',
		message: '',
	},
	isLoading: false,
}

export const shortUrlReducer = (state: State, action: ActionShortUrl) => {
	switch (action.type) {
		case ActionType.SetLongUrl:
			return {
				...state,
				longUrl: action.payload,
			}
		case ActionType.SetShortUrl:
			return {
				...state,
				shortUrl: action.payload,
			}
		case ActionType.SetQrCodeUrl:
			return {
				...state,
				qrCodeUrl: action.payload,
			}
		case ActionType.SetPurpose:
			return {
				...state,
				purpose: action.payload,
			}
		case ActionType.SetCreatedAt:
			return {
				...state,
				createdAt: action.payload,
			}
		case ActionType.SetError:
			return {
				...state,
				error: action.payload,
			}
		case ActionType.SetIsLoading:
			return {
				...state,
				isLoading: action.payload,
			}
		default:
			return state
	}
}
