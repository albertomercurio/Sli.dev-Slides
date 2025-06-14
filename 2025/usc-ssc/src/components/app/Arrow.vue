<template>
  <!-- Full-viewport overlay so coordinates are absolute to the page -->
  <svg :style="svgStyle" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Arrowhead: base anchored to the polyline end; the tip projects forward by `headLength` px -->
      <marker
        :id="markerId"
        :viewBox="viewBox"
        :refX="0"
        :refY="headWidth / 2"
        :markerWidth="headLength"
        :markerHeight="headWidth"
        orient="auto"
        markerUnits="userSpaceOnUse"
      >
        <path :d="arrowPath" :fill="stroke" />
      </marker>
    </defs>

    <!-- Draw the shaft, shortened so the arrowhead covers its end -->
    <line
      :x1="start.x"
      :y1="start.y"
      :x2="trimmedEnd.x"
      :y2="trimmedEnd.y"
      :stroke="stroke"
      :stroke-width="strokeWidth"
      :marker-end="`url(#${markerId})`"
      stroke-linecap="round"
    />
  </svg>
</template>

<script setup>
// Vue 3 composition-API component
import { computed } from 'vue'

const props = defineProps({
  /** absolute page coordinates */
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
  /** stroke color */
  stroke: {
    type: String,
    default: '#444'
  },
  /** shaft thickness */
  strokeWidth: {
    type: Number,
    default: 3
  },
  /** arrowhead length in px along the direction vector */
  headLength: {
    type: Number,
    default: 12
  },
  /** arrowhead width (base) in px – defaults to the same as length */
  headWidth: {
    type: Number,
    default: 12
  }
})

// Generate a unique <marker> id for each instance
const markerId = `arrowhead-${Math.random().toString(36).slice(2, 9)}`

/**
 * Compute the line end so that the visible shaft stops `headLength` px short
 * of the desired end, leaving room for the arrowhead.
 */
const trimmedEnd = computed(() => {
  const dx = props.end.x - props.start.x
  const dy = props.end.y - props.start.y
  const len = Math.hypot(dx, dy)
  if (len === 0) return { ...props.end }

  const ratio = (len - props.headLength) / len
  return {
    x: props.start.x + dx * ratio,
    y: props.start.y + dy * ratio
  }
})

/** SVG defs helpers */
const viewBox = computed(() => `0 0 ${props.headLength} ${props.headWidth}`)
const arrowPath = computed(
  () => `M0,0 L${props.headLength},${props.headWidth / 2} L0,${props.headWidth} Z`
)

/**
 * Keep the overlay absolute and non-interactive
 */
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
/* Nothing here – tint via `stroke` prop */
</style>