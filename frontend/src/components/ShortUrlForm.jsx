import { Form, Input, Button, Alert } from '@nextui-org/react'
import { useUrl } from '../hooks/useUrl'
import { useShortUrl } from '../hooks/useShortUrl'

export function ShortUrlForm () {
  const { url, setUrl, isInvalid, setInvalid } = useUrl()
  const { getShortUrl, error } = useShortUrl()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const isValid = !setInvalid(url)

    if (!isValid) return

    getShortUrl({ url })
  }

  return (
    <Form onSubmit={handleSubmit} className='w-full max-w-md flex items-center'>
      <Input
        name='url'
        placeholder='Enter your URL here'
        color={isInvalid ? 'danger' : 'default'}
        className='w-full'
        errorMessage='Please enter a valid URL'
        isInvalid={isInvalid}
        value={url}
        onValueChange={setUrl}
      />
      <Button
        type='submit'
        variant='contained'
        className='w-full mt-4 bg-gradient-to-tr from-blue-500 to-black text-white shadow-lg'
      >
        Shorten URL
      </Button>
      {error &&
        <Alert color='danger' title={error.message} />}
    </Form>
  )
}
