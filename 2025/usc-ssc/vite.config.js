import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import Markdown from 'unplugin-vue-markdown/vite'
import MarkdownItAnchor from 'markdown-it-anchor'
import MarkdownItPrism from 'markdown-it-prism'
import MarkdownItKatex from 'markdown-it-katex'

export default defineConfig({
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/], // <-- Also process .md files with Vue
    }),
    UnoCSS({
      preflight: {
        // leave everything alone under .katex so KaTeX's own rules apply
        exclude: ['.katex', '.katex *']
      }
    }),
    Markdown({
      // default options passed to markdown-it
      // see: https://markdown-it.github.io/markdown-it/
      markdownItOptions: {
        html: true,
        linkify: true,
        typographer: true,
      },
      // A function providing the Markdown It instance gets the ability to apply custom settings/plugins
      markdownItSetup(md) {
        // for example
        md.use(MarkdownItAnchor)
        md.use(MarkdownItKatex)
        md.use(MarkdownItPrism)
      },
      // Class names for the wrapper div
      wrapperClasses: 'markdown-body'
    }),
  ],
})