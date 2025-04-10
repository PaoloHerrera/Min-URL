import z from 'zod'

const geolocationSchema = z.object({
	ip_address: z.string().min(1),
	country: z.string().min(1),
	region: z.string().min(1),
	timezone: z.string().min(1),
	city: z.string().min(1),
	latitude: z.string().min(1),
	longitude: z.string().min(1),
	created_at: z
		.string()
		.datetime()
		.default(() => new Date().toISOString()),
})

export function validateGeolocation(input) {
	return geolocationSchema.safeParse(input)
}
