<script setup lang="ts">
import { provideLocal, useElementSize } from '@vueuse/core'
import { computed, onUnmounted, ref, watchEffect } from 'vue'

const slideAspect = 16 / 9
const slideWidth = 980
const slideHeight = slideWidth / slideAspect

const container = ref<HTMLDivElement | null>(null)
const containerSize = useElementSize(container)
const slideElement = ref<HTMLElement | null>(null)

const width = computed(() => containerSize.width.value)
const height = computed(() => containerSize.height.value)

const scale = computed(() => {
  return Math.min(width.value / slideWidth, height.value / slideHeight)
})

const contentStyle = computed(() => ({
  'height': `${slideHeight}px`,
  'width': `${slideWidth}px`,
  'transform': `translate(-50%, -50%) scale(${scale.value})`,
  '--slidev-slide-scale': scale.value,
}))
</script>

<template>
  <div
    ref="container"
    class="slidev-slide-container"
    style="background: var(--slidev-slide-container-background, black);">
    <div
      :id="'slide-content'"
      ref="slideElement"
      class="slidev-slide-content"
      :style="contentStyle">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="postcss">
.slidev-slide-container {
  @apply relative w-full h-full overflow-hidden;
}

.slidev-slide-content {
  @apply absolute left-1/2 top-1/2 overflow-hidden bg-main;
}
</style>