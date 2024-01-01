import * as z from 'zod'

export const createProjectSchema = z.object({
	name: z.string().min(1, { message: 'this field is required' }),
	description: z.string().optional(),
	workspaceId: z.string(),
})

export type TCreateProjectSchema = z.infer<typeof createProjectSchema>
