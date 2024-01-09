import { invariantResponse } from '@epic-web/invariant'

import { type LoaderFunctionArgs, json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import * as z from 'zod'
import { Separator } from '~/components/ui/separator'

import {
	ProjectGeneralSettingsForm,
	projectGeneralSettingsFormAction,
} from '~/forms/project-general-settings'
import { getMemberProject } from '~/repository/project.repository.server'
import { auth } from '~/utils/auth.server'
import { db } from '~/utils/db.server'

const paramsSchema = z.object({
	projectId: z.string(),
})

export const action = projectGeneralSettingsFormAction

export async function loader({ request, params }: LoaderFunctionArgs) {
	const { membershipId } = await auth.isAuthenticated(request, {
		failureRedirect: '/login',
	})
	const { projectId } = paramsSchema.parse(params)

	const project = await getMemberProject(db, { membershipId, projectId })

	invariantResponse(project, 'project not found')

	return json({
		project,
	})
}

export default function ProjectSettingsPage() {
	const { project } = useLoaderData<typeof loader>()
	return (
		<div className="flex flex-col gap-y-6">
			<div>
				<h3 className="text-lg font-medium">Profile</h3>
				<p className="text-sm text-muted-foreground">
					This is how others will see you on the site.
				</p>
			</div>
			<Separator />
			<ProjectGeneralSettingsForm
				defaultData={{ description: project.description, name: project.name }}
			/>
		</div>
	)
}
