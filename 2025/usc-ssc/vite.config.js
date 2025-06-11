import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Unocss from 'unocss/vite'
import Markdown from 'unplugin-vue-markdown/vite'
import MarkdownItPrism from 'markdown-it-prism'
import mdKatex from 'markdown-it-katex'

export default defineConfig({
  plugins: [
    vue({ include: [/\.vue$/, /\.md$/] }),
    Unocss(),
    Markdown({
      // same hooks, but names are now camel-cased like VitePress
      markdownItOptions: { html: true, linkify: true, typographer: true },
      markdownItSetup(md) {            // ✔ identical to Slidev/VitePress
        md.use(MarkdownItPrism)
        md.use(mdKatex)
      },
      headEnabled: true,               // expose front-matter to <head>
      wrapperClasses: 'prose m-auto',  // optional
    }),
  ]
})
