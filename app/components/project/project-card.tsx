import { Link } from '@remix-run/react'
import { useDashboardLoaderData } from '~/routes/_dashboard+/_layout'
import { type ProjectStatus } from '~/types/kysely-schema'
import { buttonVariants } from '../ui/button'
import {
	Card,
	CardHeader,
	CardContent,
	CardTitle,
	CardDescription,
} from '../ui/card'
import { Icon } from '../ui/icon'

interface ProjectCardProps {
	name: string
	description: string | null
	status: ProjectStatus
	publicId: string
}

export function ProjectCard(props: ProjectCardProps) {
	const { user } = useDashboardLoaderData()
	const { description, name, status, publicId } = props
	const baseLink = `/${user.workspaceId}/projects/${publicId}`
	return (
		<Card>
			<Link to={baseLink} aria-label={name}>
				<CardHeader>
					<CardTitle>{name}</CardTitle>
					<CardDescription>{description}</CardDescription>
				</CardHeader>
			</Link>
			<CardContent>
				<div className="flex items-center justify-between">
					<div className="flex space-x-4 text-sm text-muted-foreground">
						<div className="flex items-center">{status}</div>
					</div>
					<Link
						aria-label="settings"
						className={buttonVariants({
							size: 'icon',
							variant: 'outline',
						})}
						to={baseLink + '/settings'}
					>
						<Icon name="settings" />
					</Link>
				</div>
			</CardContent>
		</Card>
	)
}
