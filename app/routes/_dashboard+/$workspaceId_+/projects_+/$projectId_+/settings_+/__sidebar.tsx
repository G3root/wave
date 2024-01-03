import { Link, useLocation, useParams } from '@remix-run/react'
import { buttonVariants } from '~/components/ui/button'
import { cn } from '~/utils/misc'

const sidebarNavItems = [
	{
		label: 'General',
		href: '/settings',
	},
	{
		label: 'Members',
		href: '/settings/members',
	},
]

export function SideBar() {
	const { pathname } = useLocation()
	const params = useParams()
	const baseUrl = `/${params.workspaceId}/projects/${params.projectId}`
	const currentPathname = pathname.replace(baseUrl, '')

	return (
		<nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
			{sidebarNavItems.map(item => (
				<Link
					className={cn(
						buttonVariants({ variant: 'ghost' }),
						currentPathname === item.href
							? 'bg-muted hover:bg-muted'
							: 'hover:bg-transparent hover:underline',
						'justify-start',
					)}
					key={item.label}
					to={baseUrl + item.href}
				>
					{item.label}
				</Link>
			))}
		</nav>
	)
}
