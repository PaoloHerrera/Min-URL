import { UrlContext } from './UrlContext'
import { useUrlReducer } from '../hooks/useUrlReducer'

// Create a new provider component that takes children as a prop
export const UrlProvider = ({ children }) => {
	// Create a state to hold the url
	const urlState = useUrlReducer()

	return <UrlContext.Provider value={urlState}>{children}</UrlContext.Provider>
}
