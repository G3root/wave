import { type PrismaClient } from '@prisma/client'
import { generateWorkspaceName } from '~/repository/workspace.repository.server'
import { prisma } from '~/utils/prisma.server'
import { generatePublicId } from '~/utils/public-id'

export function createUser(email: string) {
	return prisma.user.create({
		data: {
			email,
			publicId: generatePublicId(),
		},
	})
}

export type Tuser = Awaited<ReturnType<typeof createUser>>

export function createWorkspace(creator: Tuser) {
	return prisma.workspace.create({
		data: {
			name: generateWorkspaceName(),
			publicId: generatePublicId(),
			creator: {
				connect: creator,
			},
		},
	})
}

export type TWorkspace = Awaited<ReturnType<typeof createWorkspace>>

export function createMembership(user: Tuser, workspace: TWorkspace) {
	return prisma.membership.create({
		data: {
			publicId: generatePublicId(),
			user: {
				connect: user,
			},
			workspace: {
				connect: workspace,
			},
		},
	})
}

export type TMembership = Awaited<ReturnType<typeof createMembership>>

export async function cleanupDb(prisma: PrismaClient) {
	const tables = await prisma.$queryRaw<
		{ name: string }[]
	>`SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_prisma_migrations';`

	await prisma.$transaction([
		// Disable FK constraints to avoid relation conflicts during deletion
		prisma.$executeRawUnsafe(`PRAGMA foreign_keys = OFF`),
		// Delete all rows from each table, preserving table structures
		...tables.map(({ name }) =>
			prisma.$executeRawUnsafe(`DELETE from "${name}"`),
		),
		prisma.$executeRawUnsafe(`PRAGMA foreign_keys = ON`),
	])
}
