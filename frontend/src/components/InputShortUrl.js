import { Button, Input } from '@nextui-org/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

export default function InputShortUrl () {
  return (
    <div className='flex justify-center md:w-full'>
      <Input
        className="max-w-xs max-w-md max-w-lg"
        type='text'
        placeholder='Enter URL'
        size='lg'
        endContent={
          <div className='flex gap-4 items-center'>
            <Button
              color="primary" variant="solid" endContent={<FontAwesomeIcon icon={faArrowRight}/>}
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
