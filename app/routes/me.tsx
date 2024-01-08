import { type LoaderFunctionArgs, json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { auth } from '~/utils/auth.server'

export let loader = async ({ request }: LoaderFunctionArgs) => {
	let user = await auth.isAuthenticated(request, { failureRedirect: '/login' })
	return json({ user })
}

export default function Me() {
	let { user } = useLoaderData<typeof loader>()
	return (
		<div>
			<h1>membership id {user.userId}</h1>
			<p>workspace id {user.workspaceId}</p>
			<p>membership id {user.membershipId}</p>
		</div>
	)
}
