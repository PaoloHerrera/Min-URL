import { Button } from '@nextui-org/react'
import { useShortUrl } from '../hooks/useShortUrl'

export default function SubmitButton () {
  const { loading } = useShortUrl()
  return (
    <Button
      type='submit'
      variant='contained'
      className='w-full mt-4 bg-gradient-to-tr from-blue-500 to-black text-white shadow-lg'
      isDisabled={loading}
    >
      Shorten URL
    </Button>
  )
}
