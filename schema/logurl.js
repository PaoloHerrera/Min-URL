import z from 'zod'

const urlSchema = z.object({
  url_id_url: z.number().positive(),
  id_logurl_hash: z.string(64),
  ip_address: z.string().ip({ version: 'v4' }),
  country: z.string().optional(),
  region: z.string().optional(),
  timezone: z.string().optional(),
  city: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  deleted: z.boolean().default(false),
  created_at: z.string().datetime().default(() => new Date().toISOString()),
  updated_at: z.string().datetime().default(() => new Date().toISOString()),
  deleted_at: z.string().datetime().optional()

})

export function validateLogUrl (input) {
  return urlSchema.safeParse(input)
}
