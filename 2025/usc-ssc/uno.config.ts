import { defineConfig, presetAttributify, presetIcons, transformerDirectives, transformerVariantGroup } from 'unocss'
import presetWind3 from '@unocss/preset-wind3'

export default defineConfig({
  safelist: [
    '!opacity-0',
    'prose',
    // See https://github.com/slidevjs/slidev/issues/1705
    'grid-rows-[1fr_max-content]',
    'grid-cols-[1fr_max-content]',
  ],
  presets: [
    presetWind3(),
    presetAttributify(),
    presetIcons(),
  ],
  shortcuts: {
    'bg-main': 'bg-[#FFFDF6] text-[#181818]',
    'bg-active': 'bg-gray-400/10',
    'border-main': 'border-gray/20',
    'text-main': 'text-[#181818] dark:text-[#ddd]',
    'text-primary': 'color-$slidev-theme-primary',
    'bg-primary': 'bg-$slidev-theme-primary',
    'border-primary': 'border-$slidev-theme-primary',
    'abs-tl': 'absolute top-0 left-0',
    'abs-tr': 'absolute top-0 right-0',
    'abs-b': 'absolute bottom-0 left-0 right-0',
    'abs-bl': 'absolute bottom-0 left-0',
    'abs-br': 'absolute bottom-0 right-0',
  },
  theme: {
    colors: {
      epfl: '#e30613',     // your custom red
    },
  },
  transformers: [
    transformerDirectives({ enforce: 'pre' }),
    transformerVariantGroup(),
  ],
})