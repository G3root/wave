import { invariant, invariantResponse } from '@epic-web/invariant'
import { type LoaderFunctionArgs, json } from '@remix-run/node'
import { Outlet, useRouteLoaderData } from '@remix-run/react'
import { auth } from '~/utils/auth.server'
import { SideBar } from './__sidebar'

export async function loader({ request, params, context }: LoaderFunctionArgs) {
	const user = await auth.isAuthenticated(request, {
		failureRedirect: '/login',
	})

	invariantResponse(params.workspaceId, 'workspaceId params not found')

	invariantResponse(
		params.workspaceId === user.workspaceId,
		'user not authenticated',
	)

	return json({ user })
}

export const useDashboardLoaderData = () => {
	const data = useRouteLoaderData<typeof loader>('routes/_dashboard+/_layout')

	invariant(
		data,
		'useDashboardLoaderData must be used within the _dashboard route or its children',
	)

	return data
}

export default function DashboardLayout() {
	return (
		<div className="bg-background">
			<div className="grid lg:grid-cols-5">
				<SideBar />
				<div className="col-span-3 lg:col-span-4 lg:border-l">
					<div className="h-full px-4 py-6 lg:px-8">
						<Outlet />
					</div>
				</div>
			</div>
		</div>
	)
}
