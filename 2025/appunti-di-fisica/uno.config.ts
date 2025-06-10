import { defineConfig } from 'unocss'

export default defineConfig({
  shortcuts: {
    // custom the default background
    'bg-main': 'bg-[#FFFDF6] text-[#181818]',
  },
  theme: {
    colors: {
      epfl: '#e30613',     // your custom red
    },
  },
})
