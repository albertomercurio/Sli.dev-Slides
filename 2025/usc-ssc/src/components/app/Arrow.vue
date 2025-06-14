<template>
  <svg :style="svgStyle" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <marker
        :id="markerId"
        viewBox="0 0 10 10"
        refX="0" refY="5"
        :markerWidth="markerSize"
        :markerHeight="markerSize"
        orient="auto"
        markerUnits="strokeWidth"
      >
        <path d="M0,0 L10,5 L0,10 Z" :fill="stroke" />
      </marker>
    </defs>

    <line
      :x1="start.x"
      :y1="start.y"
      :x2="end.x"
      :y2="end.y"
      :stroke="stroke"
      :stroke-width="strokeWidth"
      :marker-end="`url(#${markerId})`"
      stroke-linecap="round"
    />
  </svg>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  start: {
    type: Object,
    required: true,
    validator: p => p && typeof p.x === 'number' && typeof p.y === 'number'
  },
  end: {
    type: Object,
    required: true,
    validator: p => p && typeof p.x === 'number' && typeof p.y === 'number'
  },
  stroke: {
    type: String,
    default: '#000'
  },
  strokeWidth: {
    type: Number,
    default: 2
  },
  markerSize: {
    type: Number,
    default: 8
  }
})

const markerId = `arrowhead-${Math.random().toString(36).slice(2, 9)}`

const svgStyle = computed(() => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  pointerEvents: 'none'
}))
</script>

<style scoped>
/* The arrow inherits the stroke color set via props */
</style>
