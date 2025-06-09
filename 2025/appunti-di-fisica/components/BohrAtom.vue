<template>
  <svg :width="size" :height="size" :viewBox="viewBox">
    <circle v-for="(count, i) in orbits"
            :key="'orbit-' + i"
            :r="radiusStep * (i + 1)"
            stroke="#888"
            fill="none"
            stroke-dasharray="4 4"
            :cx="center"
            :cy="center" />

    <g v-for="(count, i) in orbits"
       :key="'electrons-' + i"
       :ref="el => electronGroups[i] = el">
      <circle v-for="n in count"
              :key="'e' + i + '-' + n"
              :r="3"
              fill="dodgerblue"
              :cx="electronX(i, n, count)"
              :cy="electronY(i, n, count)" />
    </g>

    <!-- Nucleus -->
    <circle :cx="center" :cy="center" r="6" fill="red" />
  </svg>
</template>

<script setup>
import { ref } from 'vue'
import { gsap } from 'gsap'
import { onSlideEnter, onSlideLeave } from '@slidev/client'

const props = defineProps({
  orbits: { type: Array, default: () => [2, 4] },
  speeds: { type: Array, default: () => [6, 4] }, // seconds per revolution
})

const size = 200
const center = size / 2
const radiusStep = 30
const viewBox = `0 0 ${size} ${size}`

const electronGroups = ref([])

const electronX = (orbitIndex, n, total) => {
  const angle = (2 * Math.PI * (n - 1)) / total
  return center + (radiusStep * (orbitIndex + 1)) * Math.cos(angle)
}
const electronY = (orbitIndex, n, total) => {
  const angle = (2 * Math.PI * (n - 1)) / total
  return center + (radiusStep * (orbitIndex + 1)) * Math.sin(angle)
}

let ctx;

onSlideEnter(() => {
    ctx = gsap.context(() => {
        electronGroups.value.forEach((group, i) => {
            gsap.to(group, {
            rotation: 360,
            transformOrigin: 'center center',
            repeat: -1,
            ease: 'linear',
            duration: props.speeds[i] || 5,
            })
        })
    })
})

onSlideLeave(() => {
    // We delay the revert to avoid abrupt stops during slide transitions
    gsap.delayedCall(1, () => {
        ctx.revert()
    })
})

</script>