import theme from '.'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
	site: 'https://example.com',
	integrations: [
		theme({
			site: {
				title: `Example Blog`,
				description: 'Here is Example Blog!',
				locale: 'zh-CN',
				url: 'https://yangqiuyi.com',
			},
			author: {
				name: 'Example',
				email: 'user@example.com',
				signature: 'To Be A Geek :)',
				avatar: {
					url: 'https://avatars.githubusercontent.com/u/62047803?v=4',
					alt: 'Meo',
				},
			},
			pages: {
				aboutMe: '/about',
			},
		}),
	],
})
