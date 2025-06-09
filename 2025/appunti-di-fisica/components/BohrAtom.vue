<template>
  <svg :width="size" :height="size" :viewBox="viewBox">
    <!-- Orbits -->
    <circle v-for="(count, i) in orbits"
            :key="'orbit-' + i"
            :r="radiusStep * (i + 1)"
            stroke="#888"
            fill="none"
            stroke-dasharray="4 4"
            :cx="center"
            :cy="center" />

    <!-- Electrons -->
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

    <!-- Nucleus: Alternating protons (red) and neutrons (gray) -->
    <g>
    <circle
        v-for="(pos, i) in [...nucleusLayout].reverse()"
        :key="'nucleon-' + i"
        :cx="pos[0]"
        :cy="pos[1]"
        :r="nucleonRadius"
        :fill="isProton(i) ? 'red' : '#555'"
    />
    </g>
  </svg>
</template>

<script setup>
import { ref } from 'vue'
import { gsap } from 'gsap'
import { onSlideEnter, onSlideLeave } from '@slidev/client'

const props = defineProps({
  orbits: { type: Array, default: () => [2, 4] },
  speeds: { type: Array, default: () => [6, 4] },
  size: { type: Number, default: 200 },
  protons: { type: Number, default: 3 },
  neutrons: { type: Number, default: 4 },
})

const center = props.size / 2
const radiusStep = props.size / 8
const viewBox = `0 0 ${props.size} ${props.size}`

const electronGroups = ref([])

const electronX = (orbitIndex, n, total) => {
  const angle = (2 * Math.PI * (n - 1)) / total
  return center + (radiusStep * (orbitIndex + 1)) * Math.cos(angle)
}
const electronY = (orbitIndex, n, total) => {
  const angle = (2 * Math.PI * (n - 1)) / total
  return center + (radiusStep * (orbitIndex + 1)) * Math.sin(angle)
}

function generatePackedNucleusAlternating(total, center, spacing) {
  const positions = [[center, center]]
  if (total === 1) return positions

  let count = 1
  let ring = 1

  while (count < total) {
    const radius = ring * spacing
    const steps = 6 * ring
    for (let i = 0; i < steps && count < total; i++) {
      const angle = (2 * Math.PI * i) / steps
      const x = center + radius * Math.cos(angle)
      const y = center + radius * Math.sin(angle)
      positions.push([x, y])
      count++
    }
    ring++
  }

  return positions
}

const totalNucleons = props.protons + props.neutrons
const nucleonRadius = 4
const overlapFactor = 1.6 // < 2 for overlap (instead of 2.2)
const nucleonSpacing = nucleonRadius * overlapFactor

// Packed positions
const nucleusLayout = generatePackedNucleusAlternating(totalNucleons, center, nucleonSpacing)

// Alternate proton/neutron
const isProton = (i) => i % 2 === 0 ? true : false

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