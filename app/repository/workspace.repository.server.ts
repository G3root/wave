import {
	type Config,
	uniqueNamesGenerator,
	adjectives,
	colors,
} from 'unique-names-generator'
import { type KyselyDb } from '~/utils/db.server'

import { generatePublicId } from '~/utils/public-id'

const config: Config = {
	dictionaries: [adjectives, colors],
	separator: '-',
}

interface createWorkspaceOptions {
	workspaceName?: string | null | undefined
	userPublicId: string
}

export const generateWorkspaceName = () => {
	return uniqueNamesGenerator(config)
}

export const createWorkspace = async (
	db: KyselyDb,
	{ userPublicId, workspaceName: workspaceName_ }: createWorkspaceOptions,
) => {
	const workspaceName = workspaceName_ ?? generateWorkspaceName()

	const workspace = await db
		.insertInto('workspace')
		.values({
			name: workspaceName,
			publicId: generatePublicId(),
			creatorId: userPublicId,
		})
		.returningAll()
		.executeTakeFirstOrThrow()

	const membership = await db
		.insertInto('membership')
		.values({
			publicId: generatePublicId(),
			workspaceId: workspace.publicId,
			status: 'accepted',
			joinedAt: new Date().toISOString(),
			userId: userPublicId,
		})
		.returningAll()
		.executeTakeFirstOrThrow()

	return { workspace, membership }
}

interface isWorkspaceMemberOptions {
	workspaceId: string
	membershipId: string
}

export const isWorkspaceMember = async (
	db: KyselyDb,
	{ workspaceId, membershipId }: isWorkspaceMemberOptions,
) => {
	const data = await db
		.selectFrom('membership as m')
		.where('m.workspaceId', '==', workspaceId)
		.where('m.publicId', '==', membershipId)
		.executeTakeFirst()

	return !!data
}
