import * as z from 'zod'

export const createProjectSchema = z.object({
	name: z.string({ required_error: 'this field is required' }).min(1),
	description: z.string().optional(),
	workspaceId: z.string(),
})

export type TCreateProjectSchema = z.infer<typeof createProjectSchema>

export const updateProjectSchema = createProjectSchema

export type TUpdateProjectSchema = z.infer<typeof updateProjectSchema>
