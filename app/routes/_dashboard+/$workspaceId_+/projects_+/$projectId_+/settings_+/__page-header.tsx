import { type ReactNode } from 'react'
import { Separator } from '~/components/ui/separator'

interface SettingsPageHeaderProps {
	title?: ReactNode
	description?: ReactNode
	children: ReactNode
}

export const SettingsPageHeader = (props: SettingsPageHeaderProps) => {
	const { children, description, title } = props
	return (
		<div className="flex flex-col gap-y-6">
			<div>
				{title && <h3 className="text-lg font-medium">{title}</h3>}
				{description && (
					<p className="text-sm text-muted-foreground">{description}</p>
				)}
			</div>
			<Separator />
			{children}
		</div>
	)
}
