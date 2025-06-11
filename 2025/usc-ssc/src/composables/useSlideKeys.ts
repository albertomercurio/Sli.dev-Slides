// src/composables/useSlideKeys.ts
import { onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { slides } from '@/router'

export function useSlideKeys () {
  const router = useRouter()
  const route  = useRoute()

  function handler (e: KeyboardEvent) {
    const i = Number(route.meta.index ?? 0)
    if (e.key === 'ArrowRight' && i < slides.length - 1) router.push(`/${i + 1}`)
    if (e.key === 'ArrowLeft'  && i > 0)                 router.push(`/${i - 1}`)
  }

  onMounted  (() => window.addEventListener('keydown', handler))
  onUnmounted(() => window.removeEventListener('keydown', handler))
}