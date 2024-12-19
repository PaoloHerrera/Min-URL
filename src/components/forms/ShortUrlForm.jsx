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
    <Form onSubmit={handleSubmit} className='w-full max-w-full flex items-center mt-10 gap-5 flex-col'>
      <p className='text-left sm:text-2xl text-md'>
        Free URL shortener with QR code. Just paste your link below!
      </p>

      <div className='w-full mt-5'>
        <InputUrl />

      </div>

      <SubmitButton />

      <ErrorMessage />
    </Form>
  )
}
