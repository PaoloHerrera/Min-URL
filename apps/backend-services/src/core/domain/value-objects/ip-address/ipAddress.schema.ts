import z from 'zod'

export const ipSchema = z.object({
	ipAddress: z.string().max(45).pipe(z.ipv4().or(z.ipv6())),
})

export type IpSchema = z.infer<typeof ipSchema>
