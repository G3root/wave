import { useMatches } from '@remix-run/react'
import { type ReactNode } from 'react'
import { Button } from '~/components/ui/button'
import { Icon } from '~/components/ui/icon'
import { cn } from '~/utils/misc'
interface SideBarProps {
	className?: string
}

type NavItem = {
	label: string
	active?: boolean
	Icon: ReactNode
}

export function SideBar({ className }: SideBarProps) {
	const matches = useMatches()

	console.log({ matches })

	const navigation: NavItem[] = [
		{
			label: 'Dashboard',
			active: matches.length === 3 && matches[2].id === 'routes/_dashboard.$id',
			Icon: <Icon name="dashboard" />,
		},
		{
			label: 'Projects',
			active: false,
			Icon: <Icon name="card-stack" />,
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
					<div className="gap-y-1">
						{navigation.map(item => (
							<Button
								variant={item.active ? 'secondary' : 'ghost'}
								className="flex w-full justify-start gap-x-2"
								key={item.label}
							>
								{item.Icon}
								{item.label}
							</Button>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}
