import * as z from 'zod'

export const themeFormSchema = z.object({
	theme: z.enum(['system', 'light', 'dark']),
})
