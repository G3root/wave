import { Outlet } from '@remix-run/react'
import { SideBar } from '~/components/dashboard/sidebar'

export default function DashboardLayout() {
	return (
		<div className="bg-background">
			<div className="grid lg:grid-cols-5">
				<SideBar />
				<div className="col-span-3 lg:col-span-4 lg:border-l">
					<div className="h-full px-4 py-6 lg:px-8">
						<Outlet />
					</div>
				</div>
			</div>
		</div>
	)
}
