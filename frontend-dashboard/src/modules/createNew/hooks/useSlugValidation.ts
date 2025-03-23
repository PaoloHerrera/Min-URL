import { useDebounce } from '@/modules/core/hooks/useDebounce'
import { useCheckSlug } from '@/modules/createNew/hooks/useCheckSlug'

export const useSlugValidation = (slug: string) => {
	const debouncedSlug = useDebounce(slug, 500)
	const { isAvailable, loading } = useCheckSlug({ slug: debouncedSlug })
	return { isAvailable, loading }
}
