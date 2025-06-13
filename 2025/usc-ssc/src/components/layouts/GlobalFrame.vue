<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  current: number      // zero-based slide index
  total: number        // total number of slides
}>()

const progressWidth = computed(() =>
  props.total <= 1
    ? '0%'
    : ((props.current) / (props.total - 1) * 100).toFixed(1) + '%',
)
</script>

<template>
  <!-- pointer-events-none lets you click through to slide content -->
  <div class="pointer-events-none fixed inset-0 z-50 select-none">
    <!-- Logo -->
    <img src="/EPFL_Logo.svg"
         class="absolute bottom-0 left-0 w-[10%] m-8" />

    <!-- Progress bar -->
    <div class="absolute bottom-0 left-0 h-1 bg-epfl
                transition-all duration-700 ease-in-out"
         :style="{ width: progressWidth }" />

    <!-- Page number (hide on title slide == index 0) -->
    <div v-if="current !== 0"
         class="absolute bottom-0 right-0 m-8 bg-epfl text-white
                rounded-full w-6 h-6 text-xs font-medium
                flex items-center justify-center">
      {{ current + 1 }}
    </div>
  </div>
</template>