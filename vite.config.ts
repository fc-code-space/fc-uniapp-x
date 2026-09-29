import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import { unovite } from './fcuni/tool/a-hua-unocss'
// import { createThemeUnoConfig } from './fcuni/tool/theme-unocss'

// 顶层副作用：monkey-patch fs.readFileSync / fs.readFile / fs/promises.readFile，
// 自动给 .uvue/.vue/.ts/.uts/.js 注入 import { FC } from '@/fcuni'。
// 必须放在任何源码读取之前执行。esbuild 在 ESM-to-CJS bundle 时会保留裸 require 调用。
// @ts-ignore - require is available at runtime after esbuild bundle
require('./fcuni/tool/fc-auto-import.cjs')

// const theme = createThemeUnoConfig(__dirname)

export default defineConfig({
	plugins: [
		// theme.vitePlugin,
		uni(),
		unovite({
			// rules: theme.rules,
		}),
	]
})
