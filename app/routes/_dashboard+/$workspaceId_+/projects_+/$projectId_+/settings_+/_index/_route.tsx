import { type LoaderFunctionArgs, json } from '@remix-run/node'
import * as z from 'zod'
import { auth } from '~/utils/auth.server'

const paramsSchema = z.object({
	workspaceId: z.string(),
	projectId: z.string(),
})

export async function loader({ request, params }: LoaderFunctionArgs) {
	await auth.isAuthenticated(request, {
		failureRedirect: '/login',
	})
	const { projectId, workspaceId } = paramsSchema.parse(params)

	return json({ projectId, workspaceId })
}

export default function ProjectSettingsPage() {
	return <div>Project settings Page</div>
}
