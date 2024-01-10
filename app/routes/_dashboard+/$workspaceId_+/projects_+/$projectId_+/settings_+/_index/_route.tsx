import { invariantResponse } from '@epic-web/invariant'

import { type LoaderFunctionArgs, json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import * as z from 'zod'

import {
	ProjectGeneralSettingsForm,
	projectGeneralSettingsFormAction,
} from '~/forms/project-general-settings'
import { getMemberProject } from '~/repository/project.repository.server'
import { auth } from '~/utils/auth.server'
import { db } from '~/utils/db.server'
import { SettingsPageHeader } from '../__page-header'

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
		<SettingsPageHeader
			title="Profile"
			description={<>This is how others will see you on the site.</>}
		>
			<ProjectGeneralSettingsForm
				defaultData={{ description: project.description, name: project.name }}
			/>
		</SettingsPageHeader>
	)
}
