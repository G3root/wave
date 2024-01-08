import { invariantResponse } from '@epic-web/invariant'
import { type LoaderFunctionArgs, json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { ProjectCard } from '~/components/project/project-card'
import { createProjectFormAction } from '~/forms/create-project'
import { getWorkspaceProjects } from '~/repository/project.repoistory'
import { auth } from '~/utils/auth.server'
import { db } from '~/utils/db.server'

export const action = createProjectFormAction

export async function loader({ request }: LoaderFunctionArgs) {
	const user = await auth.isAuthenticated(request)

	invariantResponse(user, 'user not authenticated')
	const projects = await getWorkspaceProjects(db, {
		workspaceId: user.workspaceId,
	})
	return json({ projects })
}

export type ProjectPageLoader = typeof loader

export default function ProjectsPage() {
	const data = useLoaderData<ProjectPageLoader>()

	return (
		<>
			{data.projects.length ? (
				<div className="grid grid-cols-3 gap-6">
					{data.projects.map(item => (
						<ProjectCard
							name={item.name}
							description={item.description}
							key={item.publicId}
							status={item.status}
							publicId={item.publicId}
						/>
					))}
				</div>
			) : null}
		</>
	)
}
