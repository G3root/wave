import { customAlphabet } from 'nanoid'

const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz'
const length = 12

const nanoid = customAlphabet(alphabet, length)

const PREFIX = {
	user: 'usr',
	workspace: 'ws',
	member: 'mbr',
	project: 'pro',
} as const

export function generatePublicId(key: keyof typeof PREFIX) {
	return `${PREFIX[key]}-${nanoid()}`
}
