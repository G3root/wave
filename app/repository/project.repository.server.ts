import {
	type TCreateProjectSchema,
	type TUpdateProjectSchema,
} from '~/schema/project.schema'
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

export const updateProject = (db: KyselyDb, data: TUpdateProjectSchema) => {
	const { workspaceId, ...rest } = data
	return db
		.updateTable('project')
		.set({
			...rest,
		})
		.where('workspaceId', '==', workspaceId)
		.returningAll()
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

export const getMemberProjects = (
	db: KyselyDb,
	{ membershipId, workspaceId }: { membershipId: string; workspaceId: string },
) => {
	return db
		.selectFrom('project as p')
		.innerJoin('projectOnMembers as pm', 'pm.projectId', 'p.publicId')
		.where('p.workspaceId', '==', workspaceId)
		.where('pm.membershipId', '==', membershipId)
		.selectAll('p')
		.execute()
}

export const getMemberProject = (
	db: KyselyDb,
	{ membershipId, projectId }: { membershipId: string; projectId: string },
) => {
	return db
		.selectFrom('project as p')
		.innerJoin('projectOnMembers as pm', 'pm.projectId', 'p.publicId')
		.where('pm.projectId', '==', projectId)
		.where('pm.membershipId', '==', membershipId)
		.limit(1)
		.selectAll('p')
		.executeTakeFirst()
}
