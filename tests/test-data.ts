import { type Selectable } from 'kysely'
import { type Project } from '~/types/db'
export const TEST_ADMINS = [
	'test-admin1@exmple.com',
	'test-admin2@exmple.com',
	'test-admin3@exmple.com',
	'test-admin4@exmple.com',
	'test-admin5@exmple.com',
] as const

type TProjectStatus = Selectable<Project>['status']

export const PROJECT_STATUS: TProjectStatus[] = [
	'backlog',
	'cancelled',
	'completed',
	'in-progress',
	'paused',
	'planed',
]
