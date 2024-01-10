import {
	type MetaFunction,
	type LoaderFunctionArgs,
	json,
	redirect,
} from '@remix-run/node'
import { Link } from '@remix-run/react'
import { buttonVariants } from '~/components/ui/button'
import { auth } from '~/utils/auth.server'

export const meta: MetaFunction = () => {
	return [
		{ title: 'New Remix App' },
		{ name: 'description', content: 'Welcome to Remix!' },
	]
}

export async function loader({ request }: LoaderFunctionArgs) {
	const user = await auth.isAuthenticated(request)

	if (user) {
		return redirect(`/${user.workspaceId}`)
	}
	return json({})
}

export default function Index() {
	return (
		<div className="flex min-h-screen flex-col">
			<header className="container z-40 bg-background">
				<div className="flex h-20 items-center justify-between py-6">
					<p className="text-lg font-medium">Wave</p>
					<nav>
						<Link
							className={buttonVariants({
								variant: 'secondary',
							})}
							to="/login"
						>
							Login
						</Link>
					</nav>
				</div>
			</header>
			<main className="flex-1">
				<section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
					<div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
						<a
							href="https://github.com/G3root/wave"
							className="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium"
							target="_blank"
							rel="noopener noreferrer"
						>
							Star us on GitHub
						</a>

						<h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
							Unlock the power of seamless productivity.
						</h1>
						<p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
							Sync your team's efforts, create a tidal wave of productivity.
							Wave empowers collaboration, propelling your projects forward
							effortlessly
						</p>
					</div>
				</section>
			</main>
		</div>
	)
}
