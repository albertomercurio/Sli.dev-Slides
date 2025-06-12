<!-- PresentationCanvas.vue -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const BASE_W = 1920
const BASE_H = 1080
const scale = ref(1)

function resize () {
  const w = window.innerWidth
  const h = window.innerHeight
  /* -------------  CONTAIN  ------------- */
  scale.value = Math.min(w / BASE_W, h / BASE_H)
}

onMounted(() => {
  resize()
  window.addEventListener('resize', resize)
})
onUnmounted(() => window.removeEventListener('resize', resize))
</script>

<template>
  <div
    class="canvas"
    :style="{
      width:  `${BASE_W}px`,
      height: `${BASE_H}px`,
      transform: `scale(${scale})`
    }"
  >
    <div class="slidev-layout section w-full h-full grid">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.canvas {
  position: absolute;
  top:   0;         /* anchor   */
  left:  0;         /* to top-left corner   */
  transform-origin: top left;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>