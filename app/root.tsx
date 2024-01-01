import { cssBundleHref } from '@remix-run/css-bundle'
import {
	type LinksFunction,
	type LoaderFunctionArgs,
	json,
} from '@remix-run/node'
import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
} from '@remix-run/react'
import { href as iconsHref } from './components/ui/icon'
import tailwindStyleSheetUrl from './styles/tailwind.css'
import { getEnv } from './utils/env.server'

export const links: LinksFunction = () => [
	// Preload svg sprite as a resource to avoid render blocking
	{ rel: 'preload', href: iconsHref, as: 'image' },
	// Preload CSS as a resource to avoid render blocking
	{ rel: 'preload', href: tailwindStyleSheetUrl, as: 'style' },
	...(cssBundleHref
		? [{ rel: 'preload', href: cssBundleHref, as: 'style' }]
		: []),

	{ rel: 'stylesheet', href: tailwindStyleSheetUrl },
	...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
]

export async function loader({ request }: LoaderFunctionArgs) {
	return json({
		ENV: getEnv(),
	})
}

export default function App() {
	const data = useLoaderData<typeof loader>()
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				<Outlet />
				<script
					dangerouslySetInnerHTML={{
						__html: `window.ENV = ${JSON.stringify(data.ENV)}`,
					}}
				/>
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	)
}
