import daisyuiThemes from 'daisyui/src/theming/themes'
import {
	defineConfig,
	presetAttributify,
	presetTypography,
	presetUno,
	presetIcons,
	transformerDirectives,
	transformerVariantGroup,
} from 'unocss'
import { presetDaisy } from 'unocss-preset-daisy'
import { presetScrollbarHide } from 'unocss-preset-scrollbar-hide'

export default defineConfig({
	presets: [
		presetUno(),
		presetDaisy({
			themes: [
				{
					lofi: {
						...daisyuiThemes['[data-theme=lofi]'],
						primary: daisyuiThemes['[data-theme=light]'].primary,
					},
				},
				{
					black: {
						...daisyuiThemes['[data-theme=black]'],
						primary: daisyuiThemes['[data-theme=dark]'].primary,
					},
				},
			],
			darkTheme: 'black',
		}),
		presetScrollbarHide(),
		presetAttributify(),
		presetTypography(),
		presetIcons({
			collections: {
				'lets-icons': () =>
					import('@iconify-json/lets-icons/icons.json').then((i) => i.default),
				ri: () => import('@iconify-json/ri/icons.json').then((i) => i.default),
				ion: () =>
					import('@iconify-json/ion/icons.json').then((i) => i.default),
				'line-md': () =>
					import('@iconify-json/line-md/icons.json').then((i) => i.default),
				mingcute: () =>
					import('@iconify-json/mingcute/icons.json').then((i) => i.default),
				mdi: () =>
					import('@iconify-json/mdi/icons.json').then((i) => i.default),
			},
		}),
	],
	transformers: [transformerDirectives(), transformerVariantGroup()],
})
