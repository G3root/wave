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
import { TEST_ADMINS, PROJECT_STATUS, MEMBERSHIP_STATUS } from 'tests/test-data'

import { prisma } from '~/utils/prisma.server'
import { generatePublicId } from '~/utils/public-id'

async function seed() {
	console.log('🌱 Seeding...')
	console.time(`🌱 Database has been seeded`)

	console.time('🧹 Cleaned up the database...')
	await cleanupDb(prisma)
	console.timeEnd('🧹 Cleaned up the database...')

	const workspaceData: {
		workspace: TWorkspace
		members: TMembership[]
		admin: TMembership
	}[] = []

	console.time(`👤 Created users...`)
	for (const email of TEST_ADMINS) {
		const admin = await createUser(email)

		console.log(`🔑 created admin user ${email}`)

		const adminWorkspace = await createWorkspace(admin)
		const adminMembership = await createMembership(
			admin,
			adminWorkspace,
			'accepted',
		)

		const memberCount = faker.number.int({ max: 6, min: 1 })
		const memberEmails = new Array(memberCount)
			.fill('')
			.map((_val, index) => `${index}${email}`)

		const memberships: TMembership[] = []
		for (const memberEmail of memberEmails) {
			const member = await createUser(memberEmail)
			const memberWorkspace = await createWorkspace(member)

			await createMembership(admin, adminWorkspace, 'accepted')
			const memberMembership = await createMembership(
				admin,
				memberWorkspace,
				faker.helpers.arrayElement(MEMBERSHIP_STATUS),
			)
			memberships.push(memberMembership)
		}

		workspaceData.push({
			workspace: adminWorkspace,
			members: memberships,
			admin: adminMembership,
		})
	}
	console.timeEnd(`👤 Created users...`)

	console.time(`📦 Created projects...`)
	for (const data of workspaceData) {
		const projectCount = faker.number.int({ max: 6 })
		const projects = new Array(projectCount).fill('')

		for (let index = 0; index < projects.length; index++) {
			const project = await prisma.project.create({
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

			await prisma.projectsOnMembers.create({
				data: {
					membershipId: data.admin.publicId,
					projectId: project.publicId,
				},
			})

			await prisma.projectsOnMembers.create({
				data: {
					membershipId: faker.helpers.arrayElement(data.members).publicId,
					projectId: project.publicId,
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
