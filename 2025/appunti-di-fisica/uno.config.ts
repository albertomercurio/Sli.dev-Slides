import { defineConfig } from 'unocss'

export default defineConfig({
  shortcuts: {
    // custom the default background
    'bg-main': 'bg-[#FFFDF6] text-[#181818] dark:(bg-[#121212] text-[#ddd])',
  },
  theme: {
    colors: {
      epfl: '#ff0000',     // your custom red
    },
  },
})