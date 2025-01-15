This theme is installed as an integration of Astro, which makes the git commit history clearer and makes it easier to upgrade the theme when a new version is released.

## Usage

### Install Dependencies

```sh
pnpm add https://github.com/miaobuao/astro-theme.git
```

### Configure Astro

Update your `astro.config.mjs`:

```ts
// astro.config.mjs
import theme from '@meo/astro-blog-theme'
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

### Customize "About Me" Page

You can write your own information in `src/pages/about.mdx`. To maintain a consistent design style, you can use the layout we provide (of course, you can also write your own Astro page):

```mdx
---
layout: "@meo/astro-blog-theme/layouts/HomeLayout.astro"
---

import "@meo/astro-blog-theme/styles/post.scss"
import Footer from "@meo/astro-blog-theme/components/Footer.astro"

<main class="flex justify-center items-center">
<article class="prose dark:prose-invert p-4">

# About Me

[Welcome to my blog](https://yangqiuyi.com)

</article>
</main>

<Footer class="pb-4" />
