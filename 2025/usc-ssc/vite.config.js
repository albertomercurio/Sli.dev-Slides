// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import Markdown from 'unplugin-vue-markdown/vite'
import MarkdownItAnchor from 'markdown-it-anchor'
import Shiki from '@shikijs/markdown-it'

export default defineConfig(async () => ({
  plugins: [
    vue({ include: [/\.vue$/, /\.md$/] }),
    UnoCSS(),
    Markdown({
      wrapperClasses: 'markdown-body',

      markdownItOptions: {
        html: true,
        linkify: true,
        typographer: true,
      },

      /* markdown-it is handed to you here */
      async markdownItSetup(md) {
        md.use(
          await Shiki({
            // preload a dual theme – any built-in or custom theme works
            themes: {
              light: 'github-light',
              dark:  'github-dark',
            },
            // preload grammars you care about (optional, speeds up first build)
            langs: ['bash', 'js', 'ts', 'vue', 'json', 'julia', 'python'],
          }),
        )

        md.use(MarkdownItAnchor)
      },
    }),
  ],
}))