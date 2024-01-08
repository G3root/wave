import { faker } from '@faker-js/faker'
import dayjs from 'dayjs'
import {
	cleanupDb,
	type TMembership,
	type TWorkspace,
	createMembership,
	createUser,
	createWorkspace,
} from 'tests/db-utils'
import { TEST_ADMINS, PROJECT_STATUS } from 'tests/test-data'

import { prisma } from '~/utils/prisma.server'
import { generatePublicId } from '~/utils/public-id'

async function seed() {
	console.log('🌱 Seeding...')
	console.time(`🌱 Database has been seeded`)

	console.time('🧹 Cleaned up the database...')
	await cleanupDb(prisma)
	console.timeEnd('🧹 Cleaned up the database...')

	const workspaceData: { workspace: TWorkspace; members: TMembership[] }[] = []

	console.time(`👤 Created users...`)
	for (const email of TEST_ADMINS) {
		const admin = await createUser(email)

		console.log(`🔑 created admin user ${email}`)

		const adminWorkspace = await createWorkspace(admin)
		await createMembership(admin, adminWorkspace)

		const memberCount = faker.number.int({ max: 6 })
		const memberEmails = new Array(memberCount)
			.fill('')
			.map((_val, index) => `${index}${email}`)

		const memberships: TMembership[] = []
		for (const memberEmail of memberEmails) {
			const member = await createUser(memberEmail)
			const memberWorkspace = await createWorkspace(member)

			await createMembership(admin, adminWorkspace)
			const memberMembership = await createMembership(admin, memberWorkspace)
			memberships.push(memberMembership)
		}

		workspaceData.push({
			workspace: adminWorkspace,
			members: memberships,
		})
	}
	console.timeEnd(`👤 Created users...`)

	console.time(`📦 Created projects...`)
	for (const data of workspaceData) {
		const projectCount = faker.number.int({ max: 6 })
		const projects = new Array(projectCount).fill('')

		for (let index = 0; index < projects.length; index++) {
			await prisma.project.create({
				data: {
					name: faker.lorem.words({ max: 6, min: 3 }),
					publicId: generatePublicId(),
					description: faker.helpers.maybe(() => faker.lorem.paragraph()),
					status: faker.helpers.arrayElement(PROJECT_STATUS),
					workspace: {
						connect: data.workspace,
					},
					targetDate: faker.helpers.maybe(() =>
						dayjs().add(6, 'months').toDate(),
					),
					startDate: faker.helpers.maybe(() => dayjs().toDate()),
				},
			})
		}
	}

	console.timeEnd(`📦 Created projects...`)
}

seed()
	.catch(e => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
