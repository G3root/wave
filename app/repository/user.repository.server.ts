import { type KyselyDb } from '~/utils/db.server'
import { generatePublicId } from '~/utils/public-id'

interface getUserOption {
	column: 'publicId' | 'email'
	value: string
}

export const getUser = (db: KyselyDb, { column, value }: getUserOption) => {
	return db
		.selectFrom('user')
		.where(column, '=', value)
		.selectAll()
		.executeTakeFirst()
}

interface createUserOption {
	email: string
	name?: string
}

export const createUser = async (
	db: KyselyDb,
	{ email, name }: createUserOption,
) => {
	const data = await db
		.insertInto('user')
		.values({
			publicId: generatePublicId(),
			email,
		})
		.returningAll()
		.executeTakeFirst()
	return data
}

interface getUsersFirstWorkspaceOptions {
	userPublicId: string
}

export const getUsersFirstWorkspace = async (
	db: KyselyDb,
	{ userPublicId }: getUsersFirstWorkspaceOptions,
) => {
	return db
		.selectFrom('workspace as ws')
		.innerJoin('membership as p', 'p.workspaceId', 'ws.publicId')
		.where('p.userId', '=', userPublicId)
		.selectAll('ws')
		.executeTakeFirst()
}
