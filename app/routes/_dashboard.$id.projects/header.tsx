import { type ReactNode } from 'react'
import { Separator } from '~/components/ui/separator'

interface HeaderProps {
	children: ReactNode
}

export function Header({ children }: HeaderProps) {
	return (
		<>
			<div className="flex items-center justify-between">
				<h3 className="text-sm font-medium">Projects</h3>
			</div>
			<div className="py-4">
				<Separator />
			</div>
			{children}
		</>
	)
}
