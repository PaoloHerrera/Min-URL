import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function LoadingIndicator () {
  return (
    <div className="loading-indicator">
      <p>Generating short URL, please wait...</p>
      <FontAwesomeIcon icon={faCircleNotch} className='flex animate-spin primary-color fa-xl'/>
    </div>
  )
}
