import { type TCreateProjectSchema } from '~/schema/project.schema'
import { type KyselyDb } from '~/utils/db.server'
import { generatePublicId } from '~/utils/public-id'

export const createProject = (db: KyselyDb, data: TCreateProjectSchema) => {
	return db
		.insertInto('project')
		.returningAll()
		.values({
			publicId: generatePublicId(),
			...data,
		})
		.executeTakeFirst()
}

export const getWorkspaceProjects = (
	db: KyselyDb,
	{ workspaceId }: { workspaceId: string },
) => {
	return db
		.selectFrom('project')
		.select(['name', 'publicId', 'createdAt', 'description', 'status'])
		.where('workspaceId', '=', workspaceId)
		.execute()
}
