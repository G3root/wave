import { type KyselyDb } from '~/utils/db.server'

import { generatePublicId } from '~/utils/public-id'
import { generateWorkspaceName } from './workspace.repository.server'

interface getOrCreateSessionOptions {
	email: string
}

export const getOrCreateSession = async (
	db: KyselyDb,
	{ email }: getOrCreateSessionOptions,
) => {
	const existingUser = await db
		.selectFrom('user')
		.select('publicId')
		.where('email', '=', email)
		.executeTakeFirst()

	if (existingUser) {
		const data = await db
			.selectFrom('membership as mbs')
			.innerJoin('workspace as ws', 'mbs.workspaceId', 'ws.publicId')
			.select([
				'mbs.publicId as membershipId',
				'ws.publicId as workspaceId',
				'mbs.userId as userId',
			])
			.where('userId', '=', existingUser.publicId)
			.limit(1)
			.execute()
		return data[0]
	}

	const { userId } = await db
		.insertInto('user')
		.values({
			email,
			publicId: generatePublicId(),
		})
		.returning('publicId as userId')
		.executeTakeFirstOrThrow()

	const { workspaceId } = await db
		.insertInto('workspace')
		.values({
			name: generateWorkspaceName(),
			publicId: generatePublicId(),
			creatorId: userId,
		})
		.returning('publicId as workspaceId')
		.executeTakeFirstOrThrow()

	const { membershipId } = await db
		.insertInto('membership')
		.values({
			publicId: generatePublicId(),
			workspaceId,
			status: 'accepted',
			joinedAt: new Date().toISOString(),
			userId,
		})
		.returning('publicId as membershipId')
		.executeTakeFirstOrThrow()

	return { userId, workspaceId, membershipId }
}
