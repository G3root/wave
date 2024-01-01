import { type TCreateProjectSchema } from '~/schema/project.schema'
import { type KyselyDb } from '~/utils/db.server'
import { generatePublicId } from '~/utils/public-id'

export const createProject = (db: KyselyDb, data: TCreateProjectSchema) => {
	return db
		.insertInto('project')
		.returningAll()
		.values({
			publicId: generatePublicId('project'),
			...data,
		})
		.executeTakeFirst()
}
