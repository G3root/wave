import { Link } from '@remix-run/react'
import { useDashboardLoaderData } from '~/routes/_dashboard+/_layout'
import { type ProjectStatus } from '~/types/kysely-schema'
import {
	Card,
	CardHeader,
	CardContent,
	CardTitle,
	CardDescription,
} from '../ui/card'

interface ProjectCardProps {
	name: string
	description: string | null
	status: ProjectStatus
	publicId: string
}

export function ProjectCard(props: ProjectCardProps) {
	const { user } = useDashboardLoaderData()
	const { description, name, status, publicId } = props
	return (
		<Link to={`/${user.wsPbId}/projects/${publicId}`}>
			<Card>
				<CardHeader>
					<CardTitle>{name}</CardTitle>
					<CardDescription>{description}</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex space-x-4 text-sm text-muted-foreground">
						<div className="flex items-center">{status}</div>
					</div>
				</CardContent>
			</Card>
		</Link>
	)
}
