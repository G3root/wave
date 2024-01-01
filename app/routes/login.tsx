import {
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
	json,
} from '@remix-run/node'
import { Form, useLoaderData } from '@remix-run/react'
import { auth } from '~/utils/auth.server'
import { sessionStorage } from '~/utils/session.server'

export let loader = async ({ request }: LoaderFunctionArgs) => {
	await auth.isAuthenticated(request, { successRedirect: '/' })
	let session = await sessionStorage.getSession(request.headers.get('Cookie'))

	return json({
		magicLinkSent: session.has('auth:magiclink'),
		magicLinkEmail: session.get('auth:email'),
	})
}

export let action = async ({ request }: ActionFunctionArgs) => {
	// The success redirect is required in this action, this is where the user is
	// going to be redirected after the magic link is sent, note that here the
	// user is not yet authenticated, so you can't send it to a private page.
	await auth.authenticate('email-link', request, {
		successRedirect: '/me',
		// If this is not set, any error will be throw and the ErrorBoundary will be
		// rendered.
		failureRedirect: '/login',
	})
}

export default function Login() {
	let { magicLinkSent, magicLinkEmail } = useLoaderData<typeof loader>()

	return (
		<Form action="/login" method="post">
			{magicLinkSent ? (
				<p>
					Successfully sent magic link{' '}
					{magicLinkEmail ? `to ${magicLinkEmail}` : ''}
				</p>
			) : (
				<>
					<h1>Log in to your account.</h1>
					<div>
						<label htmlFor="email">Email address</label>
						<input id="email" type="email" name="email" required />
					</div>
					<button>Email a login link</button>
				</>
			)}
		</Form>
	)
}
