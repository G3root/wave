import { createProjectFormAction } from '~/forms/create-project'
import { Header } from './header'

export const action = createProjectFormAction

export default function ProjectsPage() {
	return (
		<Header>
			<div>Projects Page</div>
		</Header>
	)
}
