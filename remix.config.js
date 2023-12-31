/** @type {import('@remix-run/dev').AppConfig} */
export default {
	ignoredRouteFiles: ['**/.*'],
	tailwind: true,
	postcss: true,
	cacheDirectory: './node_modules/.cache/remix',
	serverModuleFormat: 'esm',
	serverPlatform: 'node',
	watchPaths: ['./tailwind.config.ts'],
}
