import { Authenticator } from 'remix-auth'
import {
	EmailLinkStrategy,
	type VerifyEmailFunction,
} from 'remix-auth-email-link'
import * as z from 'zod'
import { getOrCreateSession } from '~/repository/session.repository.server'

import { db } from './db.server'
import { sessionStorage } from './session.server'

export const verifyEmailAddress: VerifyEmailFunction = async email => {
	try {
		z.string().email().parse(email)
	} catch (error) {
		throw new Error('Invalid email address.')
	}
}

const secret = process.env.MAGIC_LINK_SECRET

const auth = new Authenticator<{
	membershipId: string
	workspaceId: string
	userId: string
}>(sessionStorage)

auth.use(
	new EmailLinkStrategy(
		{
			verifyEmailAddress,
			sendEmail: async ({ magicLink }) => {
				console.log({ magicLink })
			},
			secret,
			callbackURL: '/magic',
		},
		// In the verify callback you will only receive the email address and you
		// should return the user instance
		async ({ email }: { email: string }) => {
			return db.transaction().execute(async tx => {
				return getOrCreateSession(tx, { email })
			})
		},
	),
)

export { auth }
