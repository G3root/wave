import { cssBundleHref } from '@remix-run/css-bundle'
import {
	type LinksFunction,
	type LoaderFunctionArgs,
	json,
	type HeadersFunction,
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
import { AuthenticityTokenProvider } from 'remix-utils/csrf/react'
import { GeneralErrorBoundary } from './components/error-boundary'
import { href as iconsHref } from './components/ui/icon'
import { Toaster, useToast } from './components/ui/sonner'
import { useTheme } from './hooks/theme'
import { useNonce } from './providers/nonce-provider'
import tailwindStyleSheetUrl from './styles/tailwind.css'
import { ClientHintCheck, getHints } from './utils/client-hints'
import { csrf } from './utils/csrf.server'
import { getEnv } from './utils/env.server'
import { combineHeaders, getDomainUrl } from './utils/misc'
import { type Theme, getTheme } from './utils/theme.server'
import { makeTimings } from './utils/timing.server'
import { getToast } from './utils/toast.server'

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
	const timings = makeTimings('root loader')

	const { toast, headers: toastHeaders } = await getToast(request)

	const [csrfToken, csrfCookieHeader] = await csrf.commitToken()
	return json(
		{
			ENV: getEnv(),
			toast,
			csrfToken,
			requestInfo: {
				hints: getHints(request),
				origin: getDomainUrl(request),
				path: new URL(request.url).pathname,
				userPrefs: {
					theme: getTheme(request),
				},
			},
		},
		{
			headers: combineHeaders(
				{ 'Server-Timing': timings.toString() },
				toastHeaders,
				csrfCookieHeader ? { 'set-cookie': csrfCookieHeader } : null,
			),
		},
	)
}

export const headers: HeadersFunction = ({ loaderHeaders }) => {
	const headers = {
		'Server-Timing': loaderHeaders.get('Server-Timing') ?? '',
	}
	return headers
}

function Document({
	children,
	nonce,
	theme = 'light',
	env = {},
}: {
	children: React.ReactNode
	nonce: string
	theme?: Theme
	env?: Record<string, string>
}) {
	return (
		<html lang="en" className={`${theme} h-full overflow-x-hidden`}>
			<head>
				<ClientHintCheck nonce={nonce} />
				<Meta />
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width,initial-scale=1" />
				<Links />
			</head>
			<body className="bg-background text-foreground">
				{children}
				<script
					nonce={nonce}
					dangerouslySetInnerHTML={{
						__html: `window.ENV = ${JSON.stringify(env)}`,
					}}
				/>
				<ScrollRestoration nonce={nonce} />
				<Scripts nonce={nonce} />
				<LiveReload nonce={nonce} />
			</body>
		</html>
	)
}

function App() {
	const data = useLoaderData<typeof loader>()
	const nonce = useNonce()

	const theme = useTheme()

	useToast(data.toast)

	return (
		<Document nonce={nonce} theme={theme} env={data.ENV}>
			<Outlet />
			<Toaster closeButton theme={theme} />
		</Document>
	)
}

function AppWithProviders() {
	const data = useLoaderData<typeof loader>()
	return (
		<AuthenticityTokenProvider token={data.csrfToken}>
			<App />
		</AuthenticityTokenProvider>
	)
}

export default AppWithProviders

export function ErrorBoundary() {
	// the nonce doesn't rely on the loader so we can access that
	const nonce = useNonce()

	// NOTE: you cannot use useLoaderData in an ErrorBoundary because the loader
	// likely failed to run so we have to do the best we can.
	// We could probably do better than this (it's possible the loader did run).
	// This would require a change in Remix.

	// Just make sure your root route never errors out and you'll always be able
	// to give the user a better UX.

	return (
		<Document nonce={nonce}>
			<GeneralErrorBoundary />
		</Document>
	)
}
