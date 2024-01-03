import { invariantResponse } from '@epic-web/invariant'
import { type LoaderFunctionArgs, json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { ProjectListTable } from '~/components/project/project-list-table'
import { createProjectFormAction } from '~/forms/create-project'
import { getWorkspaceProjects } from '~/repository/project.repoistory'
import { auth } from '~/utils/auth.server'
import { db } from '~/utils/db.server'
import { Header } from './__header'

export const action = createProjectFormAction

export async function loader({ request }: LoaderFunctionArgs) {
	const user = await auth.isAuthenticated(request)

	invariantResponse(user, 'user not authenticated')
	const projects = await getWorkspaceProjects(db, { workspaceId: user.wsPbId })
	return json({ projects })
}

export type ProjectPageLoader = typeof loader

export default function ProjectsPage() {
	const data = useLoaderData<ProjectPageLoader>()

	return (
		<Header>
			<ProjectListTable data={data.projects} />
		</Header>
	)
}
