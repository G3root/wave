import { cssBundleHref } from '@remix-run/css-bundle'
import  { type LinksFunction } from '@remix-run/node'
import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from '@remix-run/react'
import tailwindStyleSheetUrl from './styles/tailwind.css'

export const links: LinksFunction = () => [
	{ rel: 'preload', href: tailwindStyleSheetUrl, as: 'style' },
	...(cssBundleHref
		? [{ rel: 'preload', href: cssBundleHref, as: 'style' }]
		: []),

	{ rel: 'stylesheet', href: tailwindStyleSheetUrl },
	...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
]

export default function App() {
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
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	)
}
