This theme is installed as an integration of Astro, which makes the git commit history clearer and makes it easier to upgrade the theme when a new version is released.

If you don't have an existing Astro project, you can refer to the [official documentation](https://docs.astro.build/en/install-and-setup/) to initialize the project.

## Usage

### Install dependencies

```sh
pnpm add https://github.com/miaobuao/astro-theme.git
```

### Configure astro

Update your `astro.config.mjs`:

```ts
// astro.config.mjs
import theme from 'astro-theme-meo'
import { defineConfig } from 'astro/config'

export default defineConfig({
	site: 'https://example.com',
	integrations: [
		theme({
			site: {
				title: `Example Blog`,
				description: 'Here is Example Blog!',
				locale: 'zh-CN',
				url: 'https://example.com',
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
		// ... other integrations
	],
})
```

### Customize "About Me" page

You can write information about yourself in `src/pages/about.mdx`. To maintain a consistent design style, you can use the layout we provide (of course, you can also write your own astro page):

```mdx
---
layout: 'astro-theme-meo/layouts/HomeLayout.astro'
---

import 'astro-theme-meo/styles/post.scss'
import Footer from 'astro-theme-meo/components/Footer.astro'

<main class="flex justify-center items-center">
<article class="prose dark:prose-invert p-4">

# About Me

[Welcome to my blog](https://yangqiuyi.com)

</article>
</main>

<Footer class="pb-4" />
```
