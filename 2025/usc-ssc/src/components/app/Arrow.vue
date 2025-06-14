<template>
  <svg
    class="absolute inset-0 pointer-events-none">
    <defs>
      <marker
        id="arrowhead"
        markerWidth="10"
        markerHeight="7"
        refX="0"
        refY="3.5"
        orient="auto"
      >
        <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
      </marker>
    </defs>

    <line
      :x1="start.x"
      :y1="start.y"
      :x2="end.x"
      :y2="end.y"
      stroke="currentColor"
      stroke-width="2"
      marker-end="url(#arrowhead)"
    />
  </svg>
</template>

<script setup>
import { toRefs } from 'vue'

const props = defineProps({
  /** { x: Number, y: Number } in pixels relative to the parent container */
  start: { type: Object, required: true },
  end:   { type: Object, required: true },
})

const { start, end } = toRefs(props)
</script>

<style scoped>
.absolute { position: absolute; }
.inset-0   { top: 0; right: 0; bottom: 0; left: 0; }
.pointer-events-none { pointer-events: none; }
</style>