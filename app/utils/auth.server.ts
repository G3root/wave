import { invariant } from '@epic-web/invariant'
import { Authenticator } from 'remix-auth'
import {
	EmailLinkStrategy,
	type VerifyEmailFunction,
} from 'remix-auth-email-link'
import * as z from 'zod'
import {
	createUser,
	getUser,
	getUsersFirstWorkspace,
} from '~/repository/user.repository'
import { createWorkspace } from '~/repository/workspace.repository.server'
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
	userPbId: string
	wsPbId: string
	email: string
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
			const { user, workspace } = await db.transaction().execute(async tx => {
				let user = await getUser(tx, {
					column: 'email',
					value: email,
				})

				if (!user) {
					user = await createUser(tx, { email })

					invariant(user, 'user not found')
				}

				let workspace = await getUsersFirstWorkspace(tx, {
					userPublicId: user.publicId,
				})

				if (!workspace) {
					const { workspace: workspace_ } = await createWorkspace(tx, {
						userPublicId: user.publicId,
					})

					workspace = workspace_

					invariant(workspace, 'workspace not found')
				}

				return { workspace, user }
			})

			return {
				userPbId: user.publicId,
				wsPbId: workspace.publicId,
				email: user.email,
			}
		},
	),
)

export { auth }
