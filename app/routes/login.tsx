import {
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
	json,
} from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from '~/components/ui/card'
import { LoginForm } from '~/forms/login'
import { auth } from '~/utils/auth.server'
import { sessionStorage } from '~/utils/session.server'

export let loader = async ({ request }: LoaderFunctionArgs) => {
	await auth.isAuthenticated(request, { successRedirect: '/' })
	let session = await sessionStorage.getSession(request.headers.get('Cookie'))

	return json({
		magicLinkSent: session.has('auth:magiclink'),
		magicLinkEmail: session.get('auth:email') as string,
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
		<div className="container flex h-screen w-screen flex-col items-center justify-center">
			<div className="mx-auto flex w-full flex-col justify-center gap-y-6 sm:w-[350px]">
				<div className="flex flex-col gap-y-2 text-center">
					<h1 className="text-2xl font-semibold tracking-tight">
						Welcome back
					</h1>
					{!magicLinkSent && (
						<p className="text-sm text-muted-foreground">
							Enter your email to sign in to your account
						</p>
					)}
				</div>

				{magicLinkSent ? (
					<Card>
						<CardHeader>
							<CardTitle>Check your email</CardTitle>
							<CardDescription>
								We sent you a login link to <b>{magicLinkEmail}</b>. Be sure to
								check your spam too.
							</CardDescription>
						</CardHeader>
					</Card>
				) : (
					<>
						<LoginForm />
					</>
				)}
			</div>
		</div>
	)
}
