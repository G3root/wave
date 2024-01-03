import { type ProjectStatus } from '~/types/kysely-schema'
export const TEST_ADMINS = [
	'test-admin1@exmple.com',
	'test-admin2@exmple.com',
	'test-admin3@exmple.com',
	'test-admin4@exmple.com',
	'test-admin5@exmple.com',
] as const

export const PROJECT_STATUS: ProjectStatus[] = [
	'backlog',
	'cancelled',
	'completed',
	'in-progress',
	'paused',
	'planed',
]
