import { Form } from '@nextui-org/react'
import { useUrl } from '@hooks/useUrl'
import { useShortUrl } from '@hooks/useShortUrl'
import { useCallback } from 'react'
import debounce from 'just-debounce-it'
import InputUrl from '@components/InputUrl'
import SubmitButton from '@components/SubmitButton'
import ErrorMessage from '@components/ErrorMessage'

export function ShortUrlForm () {
  const { url, setInvalid } = useUrl()
  const { getShortUrl } = useShortUrl()

  const debouncedGetShortUrl = useCallback(debounce((url) => {
    getShortUrl({ url })
  }, 300), [getShortUrl])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const isValid = !setInvalid(url)
    if (!isValid) return
    debouncedGetShortUrl(url)
  }

  return (
    <Form onSubmit={handleSubmit} className='w-full max-w-md flex items-center mt-10'>
      <p className='mt-4 text-left mb-4'>
        Enter a URL to get a short link and a shareable QR code!
      </p>

      <InputUrl />

      <SubmitButton />

      <ErrorMessage />
    </Form>
  )
}
