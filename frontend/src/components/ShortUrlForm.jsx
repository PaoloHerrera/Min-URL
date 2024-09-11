import { useState } from 'react'
import { Button, Input } from '@nextui-org/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

import validateURL from '../utils/validateURL'

export default function ShortUrlForm ({ sendUrl }) {
  const [urlValue, setUrlValue] = useState('')
  const [isInvalidURL, setInvalidURL] = useState()
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    setUrlValue(event.target.value)
  }

  const handleClick = () => {
    if (validateURL(urlValue)) {
      setInvalidURL(false)
      setLoading(true)
      sendUrl(urlValue)
    } else {
      setInvalidURL(true)
    }
  }

  return (
      <div className="flex justify-center md:w-full grid grid-cols-1 gap-10">
        <Input
          className="max-w-xs max-w-md max-w-lg justify-self-center"
          type="text"
          placeholder="Enter URL"
          size="lg"
          disabled={loading}
          value={urlValue}
          onChange={handleChange}
          isInvalid={isInvalidURL}
          errorMessage="Please enter a valid URL"
          endContent={
            <div className="flex gap-4 items-center">
              <Button
                color="primary"
                variant="solid"
                endContent={<FontAwesomeIcon icon={faArrowRight}/>}
                disabled={loading}
                onClick={handleClick}
              >
                <b>Short Link</b>
              </Button>
            </div>
          }
        >
        </Input>
      </div>

  )
}
