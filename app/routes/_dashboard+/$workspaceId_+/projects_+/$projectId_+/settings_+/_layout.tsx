import { Outlet } from '@remix-run/react'
import { SideBar } from './__sidebar'

export default function SettingsLayoutPage() {
	return (
		<div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
			<div className="-mx-4 lg:w-1/5">
				<SideBar />
			</div>
			<div className="flex-1 lg:max-w-2xl">
				<Outlet />
			</div>
		</div>
	)
}
