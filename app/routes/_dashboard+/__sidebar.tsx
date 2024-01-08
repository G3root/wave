import { Link, useLocation } from '@remix-run/react'
import { type ReactNode } from 'react'
import { Button } from '~/components/ui/button'
import { Icon } from '~/components/ui/icon'
import { useDashboardLoaderData } from '~/routes/_dashboard+/_layout'

import { cn } from '~/utils/misc'

interface SideBarProps {
	className?: string
}

type NavItem = {
	label: string
	active?: boolean
	Icon: ReactNode
	path?: string
}

function NavItem(item: NavItem) {
	const children = (
		<>
			{item.Icon}
			{item.label}
		</>
	)
	return (
		<Button
			asChild
			variant={item.active ? 'secondary' : 'ghost'}
			className="flex w-full justify-start gap-x-2"
			key={item.label}
		>
			{item?.path ? (
				<Link to={item.path}>{children}</Link>
			) : (
				<button>{children}</button>
			)}
		</Button>
	)
}

export function SideBar({ className }: SideBarProps) {
	const { pathname } = useLocation()
	const { user } = useDashboardLoaderData()
	const basePath = `/${user.workspaceId}`

	const navigation: NavItem[] = [
		{
			label: 'Dashboard',
			active: pathname === basePath,
			Icon: <Icon name="dashboard" />,
			path: basePath,
		},
		{
			label: 'Projects',
			active: pathname.startsWith(basePath + '/projects'),
			Icon: <Icon name="card-stack" />,
			path: basePath + '/projects',
		},
		{
			label: 'Inbox',
			Icon: <Icon name="envelope-open" />,
		},
	]

	return (
		<div className={cn('pb-12', className)}>
			<div className="gap-y-4 py-4">
				<div className="flex flex-col gap-y-4 px-3 py-2">
					<div className="flex flex-col gap-y-1">
						{navigation.map(item => (
							<NavItem key={item.label} {...item} />
						))}
					</div>
				</div>
			</div>
		</div>
	)
}
