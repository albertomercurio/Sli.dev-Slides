import { defineConfig, presetAttributify, presetIcons } from 'unocss'
import presetWind3 from '@unocss/preset-wind3'

export default defineConfig({
  presets: [
    presetWind3(),
    presetAttributify(),
    presetIcons(),
  ],
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