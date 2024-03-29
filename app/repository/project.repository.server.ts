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

interface createProjectWithMemberOptions extends TCreateProjectSchema {
	membershipId: string
}

export const createProjectWithMember = async (
	db: KyselyDb,
	data: createProjectWithMemberOptions,
) => {
	const { workspaceId, membershipId, ...rest } = data

	const project = await createProject(db, { ...rest, workspaceId })

	if (!project) {
		throw new Error('project not found')
	}

	await db
		.insertInto('projectOnMembers')
		.values({
			membershipId,
			projectId: project.publicId,
		})
		.executeTakeFirstOrThrow()
	return project
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

export const getProjectMembers = (
	db: KyselyDb,
	{ projectId }: { projectId: string },
) => {
	return db
		.selectFrom('membership as m')
		.innerJoin('projectOnMembers as pm', 'pm.membershipId', 'm.publicId')
		.innerJoin('user as u', 'm.userId', 'u.publicId')
		.where('pm.projectId', '==', projectId)
		.selectAll(['m'])
		.select(['u.email', 'u.name'])
		.execute()
}
