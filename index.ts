import { rehypeHeadingIds } from '@astrojs/markdown-remark'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import playformCompress from '@playform/compress'
import { transformerColorizedBrackets } from '@shikijs/colorized-brackets'
import type { AstroIntegration, AstroIntegrationLogger } from 'astro'
import pagefind from 'astro-pagefind'
import { uniq } from 'lodash-es'
import { spawn } from 'node:child_process'
import { dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import rehypeAutoLinkHeadings from 'rehype-autolink-headings'
import rehypeKatex from 'rehype-katex'
import rehypeSlug from 'rehype-slug'
import remarkDirective from 'remark-directive'
import remarkFootnotesExtra from 'remark-footnotes-extra'
import remarkGithubAdmonitionsToDirectives from 'remark-github-admonitions-to-directives'
import remarkMath from 'remark-math'
import UnoCSS from 'unocss/astro'
import packageJson from './package.json'
import type { ThemeConfig } from './src/theme/lib/config'
import unoConfig from './uno.config'
import type { ViteUserConfig } from 'astro'
import vue from '@astrojs/vue'

const packageName = packageJson.name
const __dirname = import.meta.dirname

export default function ThemeIntegration(
	userOpts: ThemeConfig,
): AstroIntegration {
	return {
		name: packageName,
		hooks: {
			'astro:config:setup': async ({ config, injectRoute, updateConfig }) => {
				injectRoute({
					pattern: '/blog/[...slug]',
					entrypoint: resolve(
						__dirname,
						'src/theme/pages/blog/[...slug].astro',
					),
					prerender: true,
				})

				injectRoute({
					pattern: 'archive/tag/[...slug]',
					entrypoint: resolve(
						__dirname,
						'src/theme/pages/archive/tag/[...slug].astro',
					),
					prerender: true,
				})

				injectRoute({
					pattern: '/',
					entrypoint: resolve(__dirname, 'src/theme/pages/index.astro'),
					prerender: true,
				})

				injectRoute({
					pattern: 'robots.txt',
					entrypoint: resolve(__dirname, 'src/theme/pages/robots.txt.ts'),
					prerender: true,
				})

				injectRoute({
					pattern: 'rss.xml',
					entrypoint: resolve(__dirname, './src/theme/pages/rss.xml.ts'),
					prerender: true,
				})

				const virtualModuleId = 'virtual:theme-config'
				const resolvedVirtualModuleId = '\0' + virtualModuleId
				const vitePlugin: NonNullable<ViteUserConfig['plugins']>[number] = {
					name: `vite-plugin-${packageName}`,
					resolveId(id) {
						if (id === virtualModuleId) {
							return resolvedVirtualModuleId
						}
					},
					load(id) {
						if (id === resolvedVirtualModuleId) {
							return `export default ${JSON.stringify(userOpts)}`
						}
					},
				}

				updateConfig({
					vite: {
						assetsInclude: ['**/*.{zip,jpg,jpeg,png,gif,webp,svg,bmp}'],
						build: {
							cssTarget: 'chrome61',
							...config.vite?.build,
						},
						plugins: [vitePlugin, ...(config.vite?.plugins ?? [])],
					},
					prefetch: config.prefetch ?? {
						prefetchAll: true,
						defaultStrategy: 'viewport',
					},
					markdown: {
						syntaxHighlight: 'shiki',
						shikiConfig: {
							wrap: true,
							transformers: [
								transformerColorizedBrackets(),
								...(config.markdown?.shikiConfig?.transformers ?? []),
							],
						},
						gfm: config.markdown.gfm,
						remarkPlugins: uniq([
							remarkFootnotesExtra,
							remarkDirective,
							remarkGithubAdmonitionsToDirectives,
							remarkMath,
							...(config.markdown?.remarkPlugins ?? []),
						]),
						rehypePlugins: uniq([
							rehypeHeadingIds,
							[rehypeAutoLinkHeadings, { behavior: 'wrap' }],
							rehypeSlug,
							[rehypeKatex, { output: 'mathml' }],
							...(config.markdown?.rehypePlugins ?? []),
						]),
					},
					integrations: [
						...[
							mdx(),
							vue(),
							UnoCSS({
								injectReset: true,
								...unoConfig,
							}),
							pagefind(),
							playformCompress({
								CSS: true,
								HTML: true,
								JavaScript: true,
								SVG: true,
							}),
							sitemap(),
						].filter(
							(integration) =>
								!config.integrations.find((d) => d.name === integration.name),
						),
						...(config.integrations?.filter((d) => d.name !== packageName) ??
							[]),
					],
				})
			},

			'astro:build:done': ({ dir, logger }) => {
				const loglevelFlag = getPagefindLoggingFlags(logger.options.level)
				const targetDir = fileURLToPath(dir)
				const cwd = dirname(fileURLToPath(import.meta.url))
				const relativeDir = relative(cwd, targetDir)
				return new Promise<void>((resolve) => {
					spawn(
						'npx',
						['-y', 'pagefind', ...loglevelFlag, '--site', relativeDir],
						{
							stdio: 'inherit',
							shell: true,
							cwd,
						},
					).on('close', () => resolve())
				})
			},
		},
	}
}

/** Map the logging level of Astro’s logger to one of Pagefind’s logging level flags. */
function getPagefindLoggingFlags(
	level: AstroIntegrationLogger['options']['level'],
) {
	switch (level) {
		case 'silent':
		case 'error':
			return ['--silent']
		case 'warn':
			return ['--quiet']
		case 'debug':
			return ['--verbose']
		default:
			return []
	}
}
